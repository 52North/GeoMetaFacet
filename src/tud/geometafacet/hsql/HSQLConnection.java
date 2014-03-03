package tud.geometafacet.hsql;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement; 
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import tud.geometafacet.helper.Constants;
import tud.geometafacet.helper.HelpMethods;

/**
 * This class handles all database requests. Incoming requests (from servlet) will be prepared and results 
 * evaluated and send back to the frontend.
 * 
 * Extended example
 * http://www.itblogging.de/java/java-hsqldb-tutorial/
 *
 */
public class HSQLConnection {
	public HSQLConnection() {
		try { Class.forName("org.hsqldb.jdbcDriver"); } 
		catch (ClassNotFoundException e) { System.err.println("Driver not found!"); return; } 
	}
	
	/**
	 * The method handles database queries. 
	 * Based on the given params the query is prepared, set up and evaluated.
	 * 
	 * @param query - query string, indicates which query has to be prepared, e.g. "countAllHierarchylevelnames"
	 * @param id - id of metadata entry
	 * @param hvl - hierarchylevelnames
	 * @param scen - scenarios
	 * @param orga - organizations
	 * @param topic - topiccategories
	 * @param dt - datatypes
	 * @param bbox - boundingboxen
	 * @return result string 
	 */
	public String queryStatement(String query, String id, String hvl, String scen, String orga, String topic, String dt, String bbox) {
		orga = HelpMethods.replaceSpecialCharacters(orga);
		topic = HelpMethods.replaceSpecialCharacters(topic);
		
		Connection con = null;
		String sql = "";
		try { 
			con = DriverManager.getConnection("jdbc:hsqldb:file:C:/Users/ch/workspace3/GeoMetaFacet/gmf/db; shutdown=true", "root", "");
			Statement stmt = con.createStatement();

			String[] countables = null;
			String selectable = "", whereable = "";
			String resultCode = "", result = "";
			Boolean countAll = false;
			
			//countAlls
			if (query.equals(Constants.countAllHierarchylevelnames)) {
				countables = hvl.split(";");
				selectable = "Hierarchylevelname";
				scen = scen.replaceAll(";", "' OR Scenario ='");
				orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";
				
				resultCode = "hvl";
				countAll = true;
			} else if (query.equals(Constants.countAllScenarios)) {
				countables = scen.split(";");
				selectable = "Scenario";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable += " Hierarchylevelname = '" + hvl + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";				
				
				resultCode = "scen";
				countAll = true;
			} else if (query.equals(Constants.countAllDatatypes)) {
				countables = dt.split(";");
				selectable = "Datatype";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";				
				
				resultCode = "dt";
				countAll = true;
			} else if (query.equals(Constants.countAllOrganizations)) {
				countables = orga.split("\\.\\.");
				selectable = "Organization";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND ";
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";				
				
				resultCode = "orga";
				countAll = true;
			} else if (query.equals(Constants.countAllTopiccategories)) { 
				countables = topic.split("\\.\\.");
				selectable = "Topiccategory";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR '");
				orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";				
				
				resultCode = "tc";
				countAll = true;
				
			//findAlls	
			} else if (query.equals(Constants.findAllDatatypes)) { 
				selectable = "Datatype";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";	
				
			} else if (query.equals(Constants.findAllOrganizations)) {
				selectable = "Organization";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";					
			
			} else if (query.equals(Constants.findAllTopics)) {
				selectable = "Topiccategory";
				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR '");
				orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";				
			} 
			
			//create sql query for countAlls
			if (countAll) {	
				sql = "SELECT"; 
				for (int i = 0; i < countables.length; i++) {
					if (i > 0) sql += ", ";
					String as = countables[i].replaceAll(" ", "").replaceAll("-", "").replaceAll(";", "").replaceAll("&#", "").replaceAll("\\.", "").replaceAll("-", "").replaceAll("#", "");
					sql += " count(case when " + selectable + " = '" + countables[i].trim().replaceAll("\\.", "") + "' then 1 else null end) as " + "a" + as;				  
				} 
				//if (!topic.equals("-")) sql += " FROM Facets JOIN Topics ON Facets.GMF_ID = Topics.GMF_ID ";
				if (!topic.equals("-")) sql += " FROM TOPICFACETS ";
				else sql += " FROM Facets"; 
				
				if (!whereable.equals("")) {
					whereable = whereable.trim(); 
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				 
				ResultSet rs = stmt.executeQuery(sql);
	
				//process query results
				//result: [{  "hvl": "GLUES", "count": 2908 }, { "hvl": "CarBioCial", "count": 151 }]
				result = "[";
				while (rs.next()) { 
					for (int i = 0; i < countables.length; i++) {
						if (i > 0) result += ",";
						result += "{ \"" + resultCode + "\": \"" + countables[i] + "\", \"count\":" + rs.getString(i+1) + " }";									 
					} 
				}
				result += "]"; 
				rs.close(); //close result set 
				
			//create sql query for findAllIds	
			} else if (query.equals(Constants.findAllIds)) { 
				sql = "SELECT * FROM " + Constants.findAllIds;
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + rs.getString(3) + ": " + rs.getString(2) + "\" },";
				result = result.substring(0, result.length()-1) + "]"; 
				rs.close(); //close result set 
				
			//create sql query for findAllBoundingBoxes		
			} else if (query.equals(Constants.findAllBBox)) { 
				sql = "SELECT * FROM " + Constants.findAllBBox;
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[";
				while (rs.next())   
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"geographicboundingbox\": \"" + rs.getString(2) + "\" },";
				result = result.substring(0, result.length()-1);
				result += "]"; 
				rs.close();  
				
			//querying a single entry by id	
			} else if (query.equals(Constants.findOne)) {
				sql = "SELECT GMF_ID, title, description, "
							+ "GROUP_CONCAT (Topics.topiccategory ORDER BY Topics.topiccategory ASC SEPARATOR ';'), "
							+ "GROUP_CONCAT (Relatedds.relateddataset ORDER BY Relatedds.relateddataset ASC SEPARATOR ';'), "
							+ "datatype, organization, hierarchylevelname, scenario, "
							+ "temporalextentbeginposition, temporalextentendposition, "
							+ "relatedservice, relatedserviceid, relatedlayer " 
						+ "FROM Details "
						+ "LEFT JOIN Facets ON Details.GMF_ID = Facets.GMF_ID "
						+ "LEFT JOIN Relateds ON Details.GMF_ID = Relateds.GMF_ID "
						+ "LEFT JOIN Topics ON Details.GMF_ID = Topics.GMF_ID "
						+ "LEFT JOIN Relatedds ON Details.GMF_ID = Relatedds.GMF_ID "
						+ "WHERE GMF_ID ='" + id + "' " 
						+ "GROUP BY GMF_ID, title, description, datatype, organization, scenario, hierarchylevelname, temporalextentbeginposition, temporalextentendposition, relatedservice, relatedserviceid, relatedlayer "; 
				 
				ResultSet rs = stmt.executeQuery(sql);
				result = ""; 
				while (rs.next()) {   
					result += "{ "
							+ "\"id\":\"" + rs.getInt("GMF_ID") + "\","
							+ "\"label\":\"" + rs.getString("title") + "\","
							+ "\"description\":\"" + rs.getString("description") + "\","
							+ "\"datatype\":\"" + rs.getString("datatype") + "\","
							+ "\"scenario\":\"" + rs.getString("scenario") + "\","
							+ "\"organization\":\"" + rs.getString("organization") + "\","
							+ "\"hierarchylevelname\":\"" + rs.getString("hierarchylevelname") + "\","
							+ "\"temporalextentbeginposition\":\"" + rs.getString("temporalextentbeginposition") + "\","
							+ "\"temporalextentendposition\":\"" + rs.getString("temporalextentendposition") + "\","
							+ "\"related service\":\"" + rs.getString("relatedservice") + "\","
							+ "\"related service id\":\"" + rs.getString("relatedserviceid") + "\","
							+ "\"related layer\":\"" + rs.getString("relatedlayer") + "\",";
					
					String topicsString = rs.getString(4); 
					if (topicsString != null) {
						String[] topicsArray = topicsString.split(";");
						topicsString = "\"topiccategory\": [";
						for (int i=0; i < topicsArray.length; i++) 
							topicsString += "\"" + topicsArray[i] + "\",";
						 
						topicsString = topicsString.substring(0, topicsString.length() - 1) + "]"; 
						result += topicsString + ",";
					}    
					result = result.substring(0, result.length()-1) + " }"; 
				} 
				rs.close(); //close result set 
				
			} else if (query.equals(Constants.findPublicationByDsId)) {	 
				sql = "SELECT GMF_ID, title "  
					+ "FROM Details JOIN Relatedpub ON Details.GMF_ID = Relatedpub.pubid " 
					+ "WHERE Relatedpub.GMF_ID='" + id + "'" ;
			 
				ResultSet rs = stmt.executeQuery(sql);
				result = "["; 
				while (rs.next())    
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + rs.getString(2) + "\" }";
				result += "]";
				rs.close(); 
			} else if (query.equals(Constants.findByMixed)) {	
				sql = "SELECT DISTINCT GMF_ID, title, datatype ";

				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";	
				
				if (topic != "-" || query.equals(Constants.findAllTopics)) sql += " FROM Facets JOIN Topics ON Facets.GMF_ID = Topics.GMF_ID JOIN Details ON Facets.GMF_ID = Details.GMF_ID ";
				 
				else sql += " FROM Facets JOIN Details ON Facets.GMF_ID = Details.GMF_ID "; 
				
				if (!whereable.equals("")) {
					whereable = whereable.trim();
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				 
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + rs.getString(3) + ": " + rs.getString(2) + "\" },"; 
				result = result.substring(0, result.length()-1);
				result += " ]"; 
				rs.close(); //close result set
				
			} else if (query.equals(Constants.findMixedBox)) {	
				sql = "SELECT DISTINCT GMF_ID, geographicboundingbox ";

				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='"); 
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + scen + "' AND "; 	
				
				if (topic != "-" || query.equals(Constants.findAllTopics)) sql += " FROM Facets JOIN Topics ON Facets.GMF_ID = Topics.GMF_ID JOIN Details ON Facets.GMF_ID = Details.GMF_ID ";
				else sql += " FROM Facets JOIN Details ON Facets.GMF_ID = Details.GMF_ID "; 
				 
				if (!whereable.equals("")) {
					whereable = whereable.trim();
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				 
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"geographicboundingbox\": \"" + rs.getString(2) + "\" },"; 
				result = result.substring(0, result.length()-1);
				result += " ]"; 
				rs.close(); 	
			
			} else if (query.equals(Constants.findGrandParent)) { 
				sql = "WITH RECURSIVE hierarchy_tree AS ( " 
					+ " SELECT GMF_ID, parent "
					+ " FROM Hierarchy "
					+ " WHERE GMF_ID = '" + id +"' "
					+ " UNION ALL "
					+ " SELECT h.GMF_ID, h.parent "
					+ " FROM Hierarchy h "
					+ " JOIN hierarchy_tree ht ON ht.parent = h.GMF_ID "
					+ ")" 
					+ " SELECT hiert.parent, details.title "
					+ " FROM hierarchy_tree hiert JOIN Details ON hiert.parent = Details.GMF_ID ";  
				 
					ResultSet rs = stmt.executeQuery(sql); 
					ArrayList <String> pathList = new ArrayList<String>();
					String grandParentTitle = "";
					
					pathList.add(id);
					while (rs.next()) {   
						pathList.add(rs.getString(1));
						grandParentTitle = rs.getString(2);
					} 
					
					//building result string
					result += "{ " + "\"id\":\"" + pathList.get(pathList.size()-1) + "\",";				
					result += "\"label\":\"" + grandParentTitle + "\",";
					
					//pathToChild
					result += "\"pathToChild\": [";
					for (int i = pathList.size()-1; i >= 0; i--) {
						result += "\"" + pathList.get(i) + "\"";
						if (i > 0) result += ",";
					}
					result += "], "; 
					rs.close();  
					
					//query children
					sql = "SELECT GMF_ID FROM Hierarchy WHERE Parent ='" + pathList.get(pathList.size()-1) + "'";
					ResultSet rs2 = stmt.executeQuery(sql); 
					
					result += "\"children\": [ ";
					while (rs2.next())   
						result += "\"" + rs2.getInt(1) + "\",";  
					result = result.substring(0,result.length()-1);
					result += " ] }"; 
					rs2.close(); //close second result set
			
			} else if (query.equals(Constants.findTree)) { 
				sql = "WITH RECURSIVE hierarchy_tree AS ( " 
					+ " SELECT GMF_ID, parent "
					+ " FROM Hierarchy " 
					+ " WHERE parent = '" + id +"' "
					+ " UNION ALL "
					+ " SELECT h.GMF_ID, h.parent "
					+ " FROM Hierarchy h " 
					+ " JOIN hierarchy_tree ht ON ht.GMF_ID = h.parent " 
					+ ")" 
					+ " SELECT hiert.parent, de.title, d.GMF_ID, d.title "  
					+ " FROM hierarchy_tree hiert JOIN Details d ON hiert.GMF_ID = d.GMF_ID "
					+ " JOIN Details de ON hiert.parent = de.GMF_ID "
					+ " GROUP BY hiert.parent, de.title, d.GMF_ID, d.title";  
					 
					//query grandparent + path
					ResultSet rs = stmt.executeQuery(sql); 
					Map<String, ArrayList<String>> relations = new HashMap<String, ArrayList<String>>(); //parent id, children id
					Map<String, String> idTitle = new HashMap<String, String>(); 
					
					while (rs.next()) {   
						if (relations.get(rs.getString(1)) != null) {
							relations.get(rs.getString(1)).add(rs.getString(3));	 
							idTitle.put(rs.getString(3), rs.getString(4));
						} else {
							ArrayList<String> children = new ArrayList<String>();
							children.add(rs.getString(3));
							relations.put(rs.getString(1), children); 
							idTitle.put(rs.getString(1), rs.getString(2));
							idTitle.put(rs.getString(3), rs.getString(4));
						}  
					} 
					
					//building result string
					result += "{ " + "\"id\":\"" + id + "\"," + "\"label\":\"" + idTitle.get(id) + "\" ";			
					ArrayList<String> gpChildren = relations.get(id);
					result += traverseChildren(idTitle, relations, gpChildren, "");
					result += " }"; 
					rs.close();  
					
			} else if (query.equals(Constants.findSimilarLimited)) {
				sql = "SELECT DISTINCT GMF_ID, title, datatype, description ";

				hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
				dt = dt.replaceAll(";", "' OR Datatype ='");
				topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
				scen = scen.replaceAll(";", "' OR Scenario='");
				bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
				
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + scen + "' AND ";
				if (!bbox.equals("-") && !bbox.equals("")) whereable += " Geographicboundingbox = '" + bbox + "' ";	
				
				if (topic != "-") sql += " FROM DETAILSTOPICFACET ";
				else sql += " FROM Facets JOIN Details ON Facets.GMF_ID = Details.GMF_ID "; 
				
				if (!whereable.equals("")) {
					whereable = whereable.trim();
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable + " AND "; 
				} else
					sql += " WHERE ";
				
				sql += "UPPER(title) LIKE UPPER('%" + id + "%')";
				 
				ResultSet rs = stmt.executeQuery(sql); 
				
				result = "[ ";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + rs.getString(2) + "\", \"datatype\": \"" + rs.getString(3) + "\", \"description\":\"" + rs.getString(4) + "\" },"; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();
				
			} else if (query.equals(Constants.findSimilarScenarioValues)) {
				
				sql = "SELECT DISTINCT SCENARIO FROM FACETS WHERE SCENARIO LIKE '%" + id + "%'";
				ResultSet rs = stmt.executeQuery(sql); 
				 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();
				
			} else if (query.equals(Constants.findSimilarDatatypeValues)) {
				
				sql = "SELECT DISTINCT DATATYPE FROM FACETS WHERE UPPER(DATATYPE) LIKE UPPER('%" + id + "%')";
				ResultSet rs = stmt.executeQuery(sql); 
				 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();
			
			} else if (query.equals(Constants.findSimilarHierarchylevelnameValues)) {
				
				sql = "SELECT DISTINCT HIERARCHYLEVELNAME FROM FACETS WHERE UPPER(HIERARCHYLEVELNAME) LIKE UPPER('%" + id + "%')";
				ResultSet rs = stmt.executeQuery(sql); 
				 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();
			
			} else if (query.equals(Constants.findSimilarOrganizationValues)) {
				
				sql = "SELECT DISTINCT ORGANIZATION FROM FACETS WHERE UPPER(ORGANIZATION) LIKE UPPER('%" + id + "%')";
				ResultSet rs = stmt.executeQuery(sql); 
				 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();
				
			} else if (query.equals(Constants.findSimilarTopiccategoryValues)) {
				
				sql = "SELECT DISTINCT TOPICCATEGORY FROM TOPICS WHERE UPPER(TOPICCATEGORY) LIKE UPPER('%" + id + "%')";
				ResultSet rs = stmt.executeQuery(sql); 
				 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();	
				
			//create sql query for findAlls	
			} else {
				sql = "SELECT DISTINCT " + selectable;  
				if (topic != "-" || query.equals(Constants.findAllTopics))  
					//sql += " FROM Facets JOIN Topics ON Facets.GMF_ID = Topics.GMF_ID ";
					sql += " FROM TOPICFACETS ";
				else sql += " FROM Facets";  
				
				if (!whereable.equals("")) {
					whereable = whereable.trim();
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				  
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next()) { 
					if (!rs.getString(1).equals(""))
						result += "\"" + rs.getString(1) + "\","; 
				}
				result = result.substring(0, result.length()-1);
				result += " ]";   
				
				rs.close();
			}
			
			System.out.println("RESULT: " + result);
			result = result.trim(); 
			stmt.close(); 	 
			return result;
		} catch (SQLException e) { e.printStackTrace(); } finally {
			if (con != null) 
				try { con.close(); } catch (SQLException e) { e.printStackTrace(); } 
		}
		return null;
	}
	
	public String traverseChildren(Map<String, String> idTitle, Map<String, ArrayList<String>> relations, ArrayList<String> children, String result) {
		String childrenString = ""; 
		if (children != null) {
			for (int i = 0; i < children.size(); i++) {
				childrenString += 
					"{ \"id\":\"" + children.get(i) + "\", \"label\":\"" + idTitle.get(children.get(i)) + "\"" +
							traverseChildren(idTitle, relations, relations.get(children.get(i)), result) +
					 " }";
				if (i < children.size()-1) 
					childrenString += ",";
			}
		}
		
		if (children != null && children.size() >= 1) 
			result += ", \"treeChildren\": [" + childrenString + "]";
		return result;
	}
	 
}