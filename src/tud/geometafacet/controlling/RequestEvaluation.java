package tud.geometafacet.controlling;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.xpath.NodeSet;
import org.w3c.dom.NodeList;

import tud.geometafacet.helper.Constants;
import tud.geometafacet.helper.FileDocumentMethods; 
import tud.geometafacet.helper.HelpMethods;
import tud.geometafacet.xpath.EvaluatingXPath;

/**
 * 
 * This class handles simple evaluations of requested metadata.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class RequestEvaluation {

	static EvaluatingXPath xpe = new EvaluatingXPath(); 
	
	/**
	 * This method evaluates geographic extents and concatenates them as a comma-separated string.
	 * 
	 * @param nodes - sub node of metadata xml
	 * @return extent string
	 */
	public static String convertUTMtoLatLon(NodeList nodes) {
		String extent = "";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentEastShort, new String(), nodes) + ",";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentSouthShort, new String(), nodes) + ";";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentWestShort, new String(), nodes) + ",";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentSouthShort, new String(), nodes) + ";";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentWestShort, new String(), nodes) + ",";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentNorthShort, new String(), nodes) + ";";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentEastShort, new String(), nodes) + ",";
		extent += (String) xpe.getXPathResult(Constants.xPathExtentNorthShort, new String(), nodes);
		return extent;
	}
	
	/**
	 * This method evaluates a metadata xml string and parses information and download URL.
	 * 
	 * @param result - the db request result 
	 * @return Array with [0] download url, [1] information URL
	 * @throws SQLException
	 */
	public static String[] getLinks(ResultSet result) throws SQLException {
		NodeList resultNode = FileDocumentMethods.createDocument(result.getString(12)).getChildNodes();
		NodeList nl = (NodeList) xpe.getXPathResult(Constants.xPathOnLineFunction, new NodeSet(), resultNode);
		NodeList nl2 = (NodeList) xpe.getXPathResult(Constants.xPathOnLineLink, new NodeSet(), resultNode);
		
		String[] results = new String[2]; 
		for (int i = 0; i < nl.getLength(); i++) {
			if (nl.item(i).getNodeValue().equals("information")) results[1] = nl2.item(i).getNodeValue();
			if (nl.item(i).getNodeValue().equals("download")) results[0] = nl2.item(i).getNodeValue();			
		}  
		return results;
	}
	
	/**
	 * This method evaluates a service xml string and
	 * returns service url.
	 * 
	 * @param result- the db request result
	 * @return service url
	 */
	public static String getServiceURL(ResultSet result) { 
		try {
			return (String) xpe.getXPathResult(Constants.xPathUrnLink, new String(), FileDocumentMethods.createDocument(result.getString(12)).getChildNodes());
		} catch (SQLException e) { e.printStackTrace(); }
		return "";
	}
	
	/**
	 * This method evaluates the hierarchylevelname (hvl) and separates the values into 
	 * hvls and scenarios (scen) (based on project-specific settings).
	 * Only used for database
	 * 
	 * @param result- the db request result
	 * @return Array with [0] hvl, [1] scen
	 * @throws SQLException
	 */
	public static String[] getHVLScenario(ResultSet result) throws SQLException {
		String[] hvlScen = new String[2];
		if (result.getString(11) != null) { 
			String res = result.getString(11); 
			
			if (res.equals("UFZ") || res.equals("PIK") || res.equals("LMU") || res.equals("KEI") || res.equals("ILR") || res.equals("CarBioCial") || res.equals("KULUNDA") 
			|| res.equals("TFO") || res.equals("LUCCi") || res.equals("LEGATO")) {
				hvlScen[0] = res; 
			} else if (res.equals("A1") || res.equals("A1B") || res.equals("A2") || res.equals("B1") || res.equals("B2") || res.equals("Baseline")) {
				hvlScen[1] = res;
			} else if (res.equals("GLUES"))
				hvlScen[0] = res;
			 
			if (hvlScen[0] != null && !hvlScen[0].equals("")) { 
				if (hvlScen[0].equals("PIK") || hvlScen[0].equals("UFZ") || hvlScen[0].equals("ILR") || hvlScen[0].equals("LMU") || hvlScen[0].equals("KEI"))
					hvlScen[0] = "GLUES"; 
			} 
			
			if (result.getString(4).equals("TU Dresden")) {
				hvlScen[0] = "GLUES"; 
			} else if (result.getString(4).equals("Potsdam Institute for Climate Impact Research (PIK)")) {
				hvlScen[0] = "GLUES"; 
			}
				
		}  		 
		return hvlScen;
	}
	

	/**
	 * This methods checks hierarchylevelnames (hvl) and return project specific hvl names.
	 * For distributed catalogues only.
	 * 
	 * @param nodes - sub node of metadata xml
	 * @return hvl string
	 */
	public static String getHVLScenario2(NodeList nodes) {
		String parent = (String) xpe.getXPathResult(Constants.xPathParentShort, new String(), nodes);
		if (parent.contains("obis")) { return "TFO";
		} else if (parent.contains("rbis")) { return "LUCCi";
		} else if (parent.contains("vgtb")) { return "LUCCi";
		} else return "";
	}
	
	/**
	 * This methods evaluates topics. It separates concatenated strings to human readable topic names.
	 * 
	 * @param nodes - sub node of metadata xml
	 * @return corrected topic name 
	 */
	public static String[] checkTopic(NodeList nodes) {
		NodeList topicCats = (NodeList) xpe.getXPathResult(Constants.xPathTopicShort, new NodeSet(), nodes);
		String[] topics = new String[topicCats.getLength()];
		
		for (int i = 0; i < topicCats.getLength(); i++) {
			String topic = topicCats.item(i).getTextContent(); //i-tes El.  
 			if (topic.equals("climatologyMeteorologyAtmosphere")) topic = "climatology, meteorology, atmosphere";
 			else if (topic.equals("imageryBaseMapsEarthCover")) topic = "imagery base maps earth cover";
 			else if (topic.equals("geoscientificInformation")) topic = "geoscientific information";
 			else if (topic.equals("inlandWaters")) topic = "inland waters";
 			else if (topic.equals("planningCadastre")) topic = "planning cadastre"; 
 			topic = HelpMethods.prepareString(topic);
 			topics[i] = topic; 
		}	 
		return topics;
	}

	

}
