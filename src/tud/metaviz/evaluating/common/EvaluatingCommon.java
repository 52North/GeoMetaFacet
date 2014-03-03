package tud.metaviz.evaluating.common;

import java.util.HashMap;
import java.util.Map;

import org.apache.xpath.NodeSet;
import org.w3c.dom.NodeList;

import tud.metaviz.connection.csw.CSWConnection; 
import tud.metaviz.connection.db.JDBCConnection;
import tud.metaviz.connection.file.FileConnection;
import tud.metaviz.controlling.RequestControlling; 
import tud.geometafacet.helper.Constants;
import tud.geometafacet.xpath.EvaluatingXPath;

/**
 * 
 * This class handles xml evaluation of common metadata information such as title, abstract or organisation.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class EvaluatingCommon {
	
	static EvaluatingXPath xpe = new EvaluatingXPath(); 
	
	/**
	 * This method parses common metadata information from an xml (based on id) and
	 * returns the information as Map<String,Object>.
	 * 
	 * @param id - id of metadata entry
	 * @param paramName - unique param name
	 * @param type - type the entry (lineage, usage or detail)
	 * @return Map <String, Object> with common metadata information
	 */
	public static Map<String,Object> getBaseDetailsTo(String id, String paramName, String type) { 
		NodeList resultNode = getResultNode(id);
		
		Map<String, Object> detailContent = new HashMap<String, Object>();
		detailContent.put("paramName", paramName);
		detailContent.put("title", (String) xpe.getXPathResult(Constants.xPathDataSets, new String(), resultNode));
		detailContent.put("description", (String) xpe.getXPathResult(Constants.xPathDataSetAbstract, new String(), resultNode));
		detailContent.put("organisation", (String) xpe.getXPathResult(Constants.xPathOrganisation, new String(), resultNode));
		
		NodeList keywords = (NodeList) xpe.getXPathResult(Constants.xPathKeywords, new NodeSet(), resultNode);
		String connectedKeys = "";
		for (int i = 0; i < keywords.getLength(); i++) {
			if (i > 0) connectedKeys = connectedKeys + ", ";
			connectedKeys = connectedKeys + keywords.item(i).getNodeValue();
		}
		if (connectedKeys.equals("")) connectedKeys = "not set";
		detailContent.put("keywords", connectedKeys);
		
		if (!type.equals("")) //detail has no type, but lineage and usage datasets
			detailContent.put("type", type);
		
		NodeList nl = (NodeList) xpe.getXPathResult(Constants.xPathOnLineFunction, new NodeSet(), resultNode);
		NodeList nl2 = (NodeList) xpe.getXPathResult(Constants.xPathOnLineLink, new NodeSet(), resultNode);
		
		String info = "", save ="";
		for (int i = 0; i < nl.getLength(); i++) {
			if (nl.item(i).getNodeValue().equals("information")) info = nl2.item(i).getNodeValue();
			if (nl.item(i).getNodeValue().equals("download")) save = nl2.item(i).getNodeValue();			
		} 
		detailContent.put("save", save);
		detailContent.put("info", info);
		
		String rsIDCS = (String) xpe.getXPathResult(Constants.xPathRSIdCodeSpace, new String(), resultNode);
		String rsIDC = (String) xpe.getXPathResult(Constants.xPathRSIdentifier, new String(), resultNode);
		
		detailContent.put("view", getRecordLink(rsIDCS, rsIDC));
		
		String time = (String) xpe.getXPathResult(Constants.xPathTimeBegin, new String(), resultNode);
		if (time != "" && (String) xpe.getXPathResult(Constants.xPathTimeEnd, new String(), resultNode) != "") time += " - " + (String) xpe.getXPathResult(Constants.xPathTimeEnd, new String(), resultNode);
		detailContent.put("time", time);
		
		String extent = "WE:" + (String) xpe.getXPathResult(Constants.xPathExtentWest, new String(), resultNode);
		extent += "/" + (String) xpe.getXPathResult(Constants.xPathExtentEast, new String(), resultNode);		
		extent += "; NS:" + (String) xpe.getXPathResult(Constants.xPathExtentNorth, new String(), resultNode);
		extent += "/" + (String) xpe.getXPathResult(Constants.xPathExtentSouth, new String(), resultNode);		
		detailContent.put("extent", extent);
		detailContent.put("vector", "false");	 // --TODO: get xpath and fill 
		 
		detailContent.put("relations_csw", getRelationCSW(resultNode, id));  	
		
		return detailContent;
	}
	
	/**
	 * This method return an xml sub node of the metadata. Based on the mode it request via CSW, DB or file.
	 *
	 * @param id - id of metadata entry
	 * @return NodeList with metadata information (full xml as nodes)
	 */
	public static NodeList getResultNode(String id) { 
		if (RequestControlling.getMode().contains("tud.metaviz.connection.csw.CSWConnection")) 	
			return CSWConnection.doRecordRequest(id).getChildNodes();
		else if (RequestControlling.getMode().contains("tud.metaviz.connection.db.JDBCConnection")) 
			return JDBCConnection.doRecordRequest(id).getChildNodes();
		if (RequestControlling.getMode().contains("tud.metaviz.connection.file.FileConnection")) 	
			return FileConnection.getInstance().doRecordRequest(id).getChildNodes();
		else return null;
	}
	
	/**
	 * This method get a service url based on code and code space. Based on the mode it request via CSW, DB or file.
	 * 
	 * @param rsIDCS - code space of metadata entry
	 * @param rsIDC - code of metadata entry
	 * @return url as string
	 */
	public static String getRecordLink(String rsIDCS, String rsIDC) {
		if (RequestControlling.getMode().contains("tud.metaviz.connection.csw.CSWConnection")) 	
			return CSWConnection.getRecordLink(rsIDCS, rsIDC);
		else if (RequestControlling.getMode().contains("tud.metaviz.connection.db.JDBCConnection")) 
			return JDBCConnection.getRecordLink(rsIDCS, rsIDC);
		else if (RequestControlling.getMode().contains("tud.metaviz.connection.file.FileConnection")) 
			return FileConnection.getInstance().getRecordLink(rsIDCS, rsIDC);
		else return null;
	}
	
	@SuppressWarnings("static-access")
	/**
	 * This method evaluates data set relations (parent-child). Based on the mode it request via CSW, DB or file.
	 * 
	 * @param resultNode - metadata as node
	 * @param id - id of data set
	 * @return Map<String,Object> with relations
	 */
	public static Map<String, Object> getRelationCSW(NodeList resultNode, String id) {
		if (RequestControlling.getMode().contains("tud.metaviz.connection.csw.CSWConnection")) 	
			return tud.metaviz.evaluating.csw.EvaluatingCSWRelations.getRelations(resultNode, CSWConnection.updateXML()); 
		else if (RequestControlling.getMode().contains("tud.metaviz.connection.db.JDBCConnection")) 
			return tud.metaviz.evaluating.jdbc.EvaluatingCSWRelations.getRelations(id); 
		if (RequestControlling.getMode().contains("tud.metaviz.connection.file.FileConnection")) 	
			return tud.metaviz.evaluating.csw.EvaluatingCSWRelations.getRelations(resultNode, FileConnection.getInstance().updateXML()); 
		else return null;
	}
}
