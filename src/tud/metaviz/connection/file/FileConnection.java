package tud.metaviz.connection.file;
 
import java.util.ArrayList;
import java.util.HashMap; 
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.xpath.NodeSet;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

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
 * This class handles lineage requests based on an uploaded xml file. 
 * File should contain data set with lineage description and its lineage data sets.
 * Functionality is same as @see JDBCConnection, CSWConnection
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class FileConnection implements Connection {
 
	private static Document docu = null;
	private static FileConnection fileConnection;
	static EvaluatingXPath xpe = new EvaluatingXPath(); 	
	String[] ids;
	
	/**
	 * Singleton implementation
	 * @return JDBCConnection
	 */
	public static FileConnection getInstance() {
		if (fileConnection == null) fileConnection = new FileConnection();
		return fileConnection;
	}
	
	//private FileConnection() {}
 
	/**
	 * This method requests and evaluates all data from the file.
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
	
	public void setDocu(Document doc) {
		docu = doc;  
	}
	
	/**
	 * Help method to return document file with xml data.
	 * 
	 * @return document
	 */
	public Document getDocu() {
		return docu;  
	}
		
	/**
	 * Help method to return document file with xml data.
	 * 
	 * @return document
	 */
	public static Document updateXML() {	
		if (docu == null) {   
			return null; 	
		} else return docu;
	}
	
	/**
	 * This method requests a single metadata entry based on a given metadata id.
	 * 
	 * @param id - of metadata entry
	 * @return result string as JSON
	 */
	public Document doRecordRequest(String id) {  
		Document allDataDocument = updateXML();	 
		Document resultDocument = null; 
		String xPathMDNode = "//csw:SearchResults/gmd:MD_Metadata[gmd:fileIdentifier/gco:CharacterString='" + id + "']";
		 
		NodeList idNode = (NodeList) xpe.getXPathResult(xPathMDNode, new NodeSet(), allDataDocument.getChildNodes());
		 
		DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
		fac.setNamespaceAware(true); //DON'T REMOVE - needs to be set, to handle xPath and elements correct
		DocumentBuilder docBuilder;
		try {
			docBuilder = fac.newDocumentBuilder(); 
			resultDocument = docBuilder.newDocument(); 
		} catch (ParserConfigurationException e) { e.printStackTrace(); return null; } 
		
		Element firstNode = resultDocument.createElementNS("http://www.opengis.net/cat/csw/2.0.2", "SearchResults");
		firstNode.setPrefix("csw");
		firstNode.setAttribute("numberOfRecordsMatched", "12");
		firstNode.setAttribute("numberOfRecordsReturned", "14");  
		resultDocument.appendChild(firstNode);
		Node helper = resultDocument.getChildNodes().item(0);
		helper.appendChild(resultDocument.importNode(idNode.item(0), true));
		return resultDocument;
	}

	/**
	 * This help method is used to get an id from data set based on its code and code space.
	 * 
	 * @param code
	 * @param codeSpace
	 * @return id as string
	 */
	public String getID(String code, String codeSpace) {
		String xPathRSIdentifier = "//gmd:MD_Metadata" +
				"[gmd:identificationInfo/gmd:MD_DataIdentification/" +
				"gmd:citation/gmd:CI_Citation/gmd:identifier/" +
				"gmd:RS_Identifier/gmd:code/" +
				"gco:CharacterString='" + code + "']/gmd:fileIdentifier/gco:CharacterString/text()";//text()";
		
		String id = (String) xpe.getXPathResult(xPathRSIdentifier, new String(), updateXML().getChildNodes());	 	
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
		Map<String,Object> model_data = new HashMap<String, Object>();
		Map<String,Object> dataset_data = new HashMap<String, Object>();
		Map<String,Object> detail_data = new HashMap<String, Object>(); 
		Map<String,Object> all_data = new HashMap<String,Object>();	
		Map<String,Object> mappingIdsUuids = new HashMap<String, Object>(); 
	 
		//TODO: change to static request ..
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
	public String getRecordLink(String codeSpace, String code) { 
		NodeList nodes = updateXML().getChildNodes();
		String xPathUrnLink = "//gmd:MD_Metadata/gmd:identificationInfo/srv:SV_ServiceIdentification[srv:operatesOn/@uuidref='" +
				codeSpace + "#" + code + "']/srv:containsOperations/srv:SV_OperationMetadata/srv:connectPoint/gmd:CI_OnlineResource/gmd:linkage/gmd:URL/text()";
		String url = (String) xpe.getXPathResult(xPathUrnLink, new String(), nodes);
		return url;
	}
 
}
