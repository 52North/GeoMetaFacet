/**
 * Copyright 2012 52°North Initiative for Geospatial Open Source Software GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */

package tud.metaviz.connection.csw;
  
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
 

import org.apache.xpath.NodeSet;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList; 

import de.conterra.suite.catalog.client.exception.SystemException;
import de.conterra.suite.catalog.client.facades.GetRecordByIdResponse;
import de.conterra.suite.catalog.client.facades.GetRecordsResponse;
import de.conterra.suite.catalog.client.invoker.HttpPostInvoker;
import de.conterra.suite.catalog.client.invoker.IServiceInvoker;
import de.conterra.suite.catalog.client.request.GetRecordByIdRequest;
import de.conterra.suite.catalog.client.request.GetRecordsRequest;
import tud.metaviz.connection.Connection;  
import tud.metaviz.evaluating.common.EvaluatingCommon;
import tud.metaviz.evaluating.common.EvaluatingLineage;
import tud.metaviz.evaluating.common.EvaluatingSourcesModels;
import tud.geometafacet.xpath.EvaluatingXPath;  
import tud.metaviz.evaluating.csw.EvaluatingUsage;
import tud.geometafacet.helper.Constants;
import tud.geometafacet.helper.HelpMethods;
import tud.geometafacet.json.JsonObjectBuilder;
 
/**
 * 
 * This class handles lineage requests to the CSW.
 * Functionality is same as @see JDBCConnection (using DB), FileConnection (using File)
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class CSWConnection implements Connection {

	static EvaluatingXPath xpe = new EvaluatingXPath();  
	private static CSWConnection cswConnection;
	
	/**
	 * Singleton implementation 
	 * @return CSWConnection
	 */
	public static CSWConnection getInstance() {
		if (cswConnection == null) cswConnection = new CSWConnection();
		return cswConnection;
	}
	
	/**
	 * Private constructor.
	 */
	private CSWConnection() {}
 
	String[] ids;
	static Document docu = null;
	 
	/**
	 * This method requests and evaluates all data from the CSW.
	 */
	public String getRecordNames() {	
		Document document = updateXML();

		NodeList entries = (NodeList) xpe.getXPathResult(Constants.xPathEntries, new NodeSet(), document.getChildNodes());

		Map<String, Object> allData = new HashMap<String, Object>(); 
		ArrayList<Object> elementlist = new ArrayList<Object>();
		
		for (int i = 0; i < entries.getLength(); i++) { 
			Map<String, String> element = new HashMap<String, String>();
			element.put("paramName", (String) xpe.getXPathResult(Constants.xPathId, new String(), entries.item(i).getChildNodes())); 
			element.put("organisation", (String) xpe.getXPathResult(Constants.xPathOrganisationShort, new String(), entries.item(i).getChildNodes()));

			NodeList type = (NodeList) xpe.getXPathResult(Constants.xPathRessourceType, new NodeSet(), entries .item(i).getChildNodes());

			if (type.getLength() > 0) 
				if (type.item(0).hasAttributes()) 
					if (type.item(0).getAttributes().getLength() > 1) 
						element.put("type", type.item(0).getAttributes().item(1).getNodeValue());
	 
			if (element.get("type").equals("dataset") || element.get("type").equals("application")) {
				element.put("name", (String) xpe.getXPathResult(Constants.xPathPartDataSets, new String(), entries.item(i).getChildNodes()));
				element.put("abstracttext", HelpMethods.trimText((String) xpe.getXPathResult(Constants.xPathDataSetAbstractShort, new String(), entries.item(i).getChildNodes()),500));
			} 
			
			if (!element.get("type").equals("service") && hasLineage(entries.item(i).getChildNodes())) 
				elementlist.add(element);
			// end an element
		}
 
		allData.put("paramName", "data"); 
		allData.put("elementlist", HelpMethods.fillArray(elementlist)); 
		return (String) JsonObjectBuilder.buildLayer(allData, "string");
	}
	
	/**
	 * This method request a certain metadata entry by its id
	 * and returns processed data as string.
	 */
	public String getRecordDetails(String id) {	 
		Map<String,Object> allData = buildRecordMaps(doRecordRequest(id).getChildNodes(), id, updateXML());	 
		return (String) JsonObjectBuilder.buildLayer(allData, "string");
	}
		
	/**
	 * This method returns the current request result document. If there is no document available,
	 * it requests new one.
	 * Catalog requests only send about 50 records back. This methods is used to get further results as "partRequests".
	 * 
	 * @return result document
	 */
	public static Document updateXML() {
		 
		if (docu == null) {
			Node helper = null; 
			NodeList node = doPartRequest(0).getChildNodes();  			
			
			Integer results = Integer.parseInt(node.item(0).getChildNodes().item(2).getAttributes().item(0).getNodeValue());
			Integer got = Integer.parseInt(node.item(0).getChildNodes().item(2).getAttributes().item(1).getNodeValue());
			int gotRecords = got; //counting
			 
			DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
			fac.setNamespaceAware(true); //DON'T REMOVE - needs to be set, to handle xPath and elements correct
			DocumentBuilder docBuilder;
			try {
				docBuilder = fac.newDocumentBuilder(); 
				docu = docBuilder.newDocument(); 
			} catch (ParserConfigurationException e) { e.printStackTrace(); }  
			
			Element firstNode = docu.createElementNS("http://www.opengis.net/cat/csw/2.0.2", "SearchResults");
			firstNode.setPrefix("csw");
			docu.appendChild(firstNode);  
			firstNode.setAttribute("numberOfRecordsMatched", results.toString());
			firstNode.setAttribute("numberOfRecordsReturned", got.toString());  
			
			helper = docu.getChildNodes().item(0);
			//needs to be combination of appendChild and importNode
			//do appendChild on helper node (got from docu)
			//do importNode on document (docu) you got helper node from
			//if you don't do it like this: hierarchy exception in dom
			helper.appendChild(docu.importNode(node.item(0).getChildNodes().item(2), true));
		
			while (gotRecords < results) {
				Document furtherDoc = doPartRequest(gotRecords+1); //or -1?
				NodeList furthers = furtherDoc.getChildNodes().item(0).getChildNodes().item(2).getChildNodes();					
				for (int i = 0; i < furthers.getLength(); i++)  
					helper.appendChild(docu.importNode(furtherDoc.getChildNodes().item(0).getChildNodes().item(2).getChildNodes().item(i), true));				
				got = Integer.parseInt(furtherDoc.getChildNodes().item(0).getChildNodes().item(2).getAttributes().item(1).getNodeValue());
				gotRecords += got; 
			} 
			return docu;	
		} else
			return docu;
	}
	
	/**
	 * This method request 50 records from the CSW and uses a given start position for counting these 50 ones.
	 * 
	 * @param pos - start position from which records should be requested
	 * @return record result document
	 */
	public static Document doPartRequest(Integer pos) {

		GetRecordsRequest lRequest = new GetRecordsRequest();
		lRequest.addNamespace("gco", "http://www.isotc211.org/2005/gco");
		lRequest.addNamespace("gmd", "http://www.isotc211.org/2005/gmd");
		lRequest.addNamespace("srv", "http://www.isotc211.org/2005/srv");
		lRequest.addNamespace("csw", "http://www.opengis.net/cat/csw/2.0.2");
		lRequest.addNamespace("apiso","http://www.opengis.net/cat/csw/apiso/1.0");
		lRequest.addNamespace("xsi","http://www.w3.org/2001/XMLSchema-instance");
		lRequest.addNamespace("gmi","http://eden.ign.fr/xsd/metafor/20050620/gmi");
		lRequest.addNamespace("dc", "http://purl.org/dc/elements/1.1/");

		lRequest.setElementSetName("full").setMaxRecords(50)
				.setTypeName("gmd:MD_Metadata").setStartPosition(pos)
				.setResultType("results")
				.setOutputSchema("http://www.isotc211.org/2005/gmd");

		GetRecordsResponse gResponse = new GetRecordsResponse();
		IServiceInvoker invoker = new HttpPostInvoker();
		invoker.initialize(Constants.cswURL);
		try {
			invoker.invoke(lRequest, gResponse);
		} catch (SystemException e) {
			e.printStackTrace();
		}
 
		return gResponse.getDocument();
	}
	
	/**
	 * This method requests a single metadata entry based on a given metadata id.
	 * 
	 * @param id - of metadata entry
	 * @return result string as JSON
	 */
	public static Document doRecordRequest(String id) { 
	 
		GetRecordByIdRequest lRequest = new GetRecordByIdRequest();
		List<String> lIdentifiers = new ArrayList<String>();
		lIdentifiers.add(id);
		lRequest.setElementSetName("full")
				.setOutputSchema("http://www.isotc211.org/2005/gmd")
				.setIdentifier(lIdentifiers);
		GetRecordByIdResponse lResponse = new GetRecordByIdResponse();
		IServiceInvoker invoker = new HttpPostInvoker();
		invoker.initialize(Constants.cswURL);
		try {
			invoker.invoke(lRequest, lResponse);
		} catch (SystemException e) {
			e.printStackTrace();
		}
		
		return lResponse.getDocument(); 
	}

	/**
	 * This help method is used to get an id from data set based on its code and code space.
	 * 
	 * @param code
	 * @param codeSpace
	 * @return id as string
	 */
	public static String getID(String code, String codeSpace) {
		String xPathRSIdentifier = "//gmd:MD_Metadata" +
				"[gmd:identificationInfo/gmd:MD_DataIdentification/" +
				"gmd:citation/gmd:CI_Citation/gmd:identifier/" +
				"gmd:RS_Identifier/gmd:code/" +
				"gco:CharacterString='" + code + "']/gmd:fileIdentifier/gco:CharacterString/text()";//text()";
		
		String id = (String) xpe.getXPathResult(xPathRSIdentifier, new String(), docu.getChildNodes());	 	
		return id;
	}
	
	/**
	 * This method parses code and code space of a given data set (id).
	 * 
	 * @param id - id of data set
	 * @return string array with [0] code and [1] code space
	 */
	public static String[] getURN(String id) {
		String[] codeSpace = new String[2];
		
		String xPathCode = "//gmd:MD_Metadata" +
				"[gmd:fileIdentifier/gco:CharacterString='" + id + "']" +
				"/gmd:identificationInfo/gmd:MD_DataIdentification/" +
				"gmd:citation/gmd:CI_Citation/gmd:identifier/" +
				"gmd:RS_Identifier/gmd:code/" +
				"gco:CharacterString/text()";
				
		String xPathCodeSpace = "//gmd:MD_Metadata" +
				"[gmd:fileIdentifier/gco:CharacterString='" + id + "']" +
				"/gmd:identificationInfo/gmd:MD_DataIdentification/" +
				"gmd:citation/gmd:CI_Citation/gmd:identifier/" +
				"gmd:RS_Identifier/gmd:code/" +
				"gco:CharacterString/text()";		
			 
		codeSpace[0] = (String) xpe.getXPathResult(xPathCode, new String(), updateXML().getChildNodes());
		codeSpace[1] = (String) xpe.getXPathResult(xPathCodeSpace, new String(), updateXML().getChildNodes());
		
		return codeSpace;
	}
	
	/**
	 * This methods calls all other methods of this class, and builds the response
	 * object with lineage, usage and detail data for a certain data set (id)
	 * 
	 * @param id - id of data set
	 * @return result string of requests
	 */
	public Map<String,Object> buildRecordMaps(NodeList resultNode, String dsId, Node allData) {
		Map<String,Object> mappingIdsUuids = new HashMap<String, Object>();  
		Map<String,Object> model_data = new HashMap<String, Object>();
		Map<String,Object> dataset_data = new HashMap<String, Object>();
		Map<String,Object> detail_data = new HashMap<String, Object>(); 
		Map<String,Object> all_data = new HashMap<String,Object>();	
		
		EvaluatingUsage eu = new EvaluatingUsage();
		EvaluatingLineage el = new EvaluatingLineage(); 
		EvaluatingSourcesModels esm = new EvaluatingSourcesModels(mappingIdsUuids);
		
		dataset_data.put("paramName", "datasets");
		dataset_data.putAll(esm.getSources(resultNode,""));
		dataset_data.putAll(eu.getSources(allData, dsId, mappingIdsUuids)); 
		
		model_data.put("paramName", "models");
		model_data.putAll(esm.getModels(resultNode, dsId, "lineage", esm.getSourceIds()));
		model_data.putAll(eu.getModels());  
		
		all_data.put("paramName", "metaViz_data");
		all_data.put("lineage_detail", el.getLineage(resultNode));
		all_data.put("dataset_data", dataset_data);
		all_data.put("model_data", model_data);

		detail_data.put("paramName", "detail"); 
 
		Map<String, Object> detail = new HashMap<String, Object>();
		detail.put("paramName", "detail");
		detail.put(dsId, EvaluatingCommon.getBaseDetailsTo(dsId, dsId, ""));	
		all_data.put("detail_data", detail); 
		
		mappingIdsUuids.put("detail_0", dsId);
		mappingIdsUuids.put("paramName", "mapping_ids_uuids");
		
		all_data.put("mapping_ids_uuids", mappingIdsUuids); 
		all_data.put("usage", eu.getUsage(allData, dsId, mappingIdsUuids));
		return all_data;
	}
	
	/**
	 * This help method analyzes weather a metadata entry of a data set has lineage information or not.
	 * 
	 * @param resultNode - xml sub node of metadata
	 * @return true/false
	 */
	public boolean hasLineage(NodeList resultNode) {
		 NodeList processSteps = (NodeList) xpe.getXPathResult(Constants.xPathProcessSteps, new NodeSet(), resultNode);
		 
		 if (processSteps.item(0) != null) { 
			 if (((String) xpe.getXPathResult(Constants.xPathPSDescriptionShort, new String(), processSteps.item(0).getChildNodes()) == "") &&
				((String) xpe.getXPathResult(Constants.xPathStatement, new String(), resultNode) == "") &&
				((String) xpe.getXPathResult(Constants.xPathPSRationaleShort, new String(), processSteps.item(0).getChildNodes()) == "") &&
				((String) xpe.getXPathResult(Constants.xPathPSProcessorOrganisationShort, new String(), resultNode)) == "") {		 
				 return false;
			 } else return true;
		 } else return false;
	}
	
	/**
	 * This method requests a related service for a data set. Information about the
	 * data set are stored as code and code space. 
	 * 
	 * @param codeSpace
	 * @param code
	 * @return service url 
	 */
	public static String getRecordLink(String codeSpace, String code) { 
		NodeList nodes = updateXML().getChildNodes();
		String xPathUrnLink = "//gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification[srv:operatesOn/@uuidref='" +
				codeSpace + "#" + code + "']/srv:containsOperations/srv:SV_OperationMetadata/srv:connectPoint/gmd:CI_OnlineResource/gmd:linkage/gmd:URL/text()";
		String url = (String) xpe.getXPathResult(xPathUrnLink, new String(), nodes);
		return url;
	}
}
