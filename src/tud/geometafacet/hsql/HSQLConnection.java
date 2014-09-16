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
import tud.geometafacet.json.JsonObjectBuilder;
import tud.geometafacet.start.Container;


/**
 * This class handles all database requests. Incoming requests (from servlet) will be prepared and results 
 * evaluated and send back to the frontend.
 * 
 * Extended example
 * http://www.itblogging.de/java/java-hsqldb-tutorial/
 *
 *@author Christin Henzen, Bernd Grafe. Professorship of Geoinformation Systems
 *
 */
public class HSQLConnection {
	
	Map<String,Object> mappingIdsUuids = new HashMap<String, Object>();
	Map<String, Object> datasetList = new HashMap<String, Object>();
	Map<String, Object> models = new HashMap<String, Object>();
	String[] ids;
	String[]  modelIds;
	int numberModels = 0;
 
	/**
	 * Constructor initializing jdbc driver
	 */
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

		//first page call - get saved Strings from Container
		if(Container.first)return Container.getResult(query);
		
		Connection con = null;
		String sql = "";
		try { 
			//get connection from Container instead of creating new connections for every request
			if (Container.conn!=null)con = Container.conn;
			else
			con = DriverManager.getConnection("jdbc:hsqldb:file:"+Constants.dbFilePath2 +"; shutdown=true", "root", ""); //path in Constants   //if changed, change path in lineage method
			
			Statement stmt = con.createStatement();

			String[] countables = null;
			String selectable = "", whereable = "";
			String resultCode = "", result = "";
			Boolean countAll = false;
			
			if (!query.equals(Constants.countAllScenarios)) scen = scen.replaceAll(";", "' OR Scenario ='");
			if (!query.equals(Constants.countAllOrganizations)) orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
			if (!query.equals(Constants.countAllTopiccategories)) topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
			if (!query.equals(Constants.countAllDatatypes)) dt = dt.replaceAll(";", "' OR Datatype ='");
			if (!query.equals(Constants.countAllBoundingboxes)) bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
			if (!query.equals(Constants.countAllHierarchylevelnames)) hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
		 
			//countAlls
			if (query.equals(Constants.countAllHierarchylevelnames)) {
				countables = hvl.split(";");
				selectable = "Hierarchylevelname"; 
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
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";	
				
			} else if (query.equals(Constants.findAllOrganizations)) {
				selectable = "Organization";  
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";					
			
			} else if (query.equals(Constants.findAllTopics)) {
				selectable = "Topiccategory"; 
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";				
			} 
			
//			scen = scen.replaceAll(";", "' OR Scenario ='");
//			orga = orga.replaceAll("\\.\\.", "' OR Organization ='");
//			topic = topic.replaceAll("\\.\\.", "' OR Topiccategory ='");
//			dt = dt.replaceAll(";", "' OR Datatype ='");
//			bbox = bbox.replaceAll("<", "' OR Geographicboundingbox ='");
//			hvl = hvl.replaceAll(";", "' OR Hierarchylevelname ='");
			
			//create sql query for countAlls
			if (countAll) {	
				sql = "SELECT"; 
				for (int i = 0; i < countables.length; i++) {
					if (i > 0) sql += ", ";
					String as = countables[i].replaceAll(" ", "").replaceAll("-", "").replaceAll(";", "").replaceAll("&#", "").replaceAll("\\.", "").replaceAll("-", "").replaceAll("#", "");
					sql += " count(case when " + selectable + " = '" + countables[i].trim() + "' then 1 else null end) as " + "a" + as;				  
				} 

				if (!topic.equals("-")) sql += " FROM TOPICFACETS ";
				else sql += " FROM Facets"; 
				
				if (!whereable.equals("")) {
					whereable = whereable.trim(); 
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				
				//System.out.println(sql);
				
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
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + rs.getString(3) + ": " + HelpMethods.reReplaceString(rs.getString(2)) + "\" },";
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
				if (id.contains(":") || id.contains("-")) {
					sql = "SELECT GMF_ID, id, title, description, "
							+ "GROUP_CONCAT (Topics.topiccategory ORDER BY Topics.topiccategory ASC SEPARATOR ';'), "
							+ "GROUP_CONCAT (Relatedds.relateddataset ORDER BY Relatedds.relateddataset ASC SEPARATOR ';'), "
							+ "datatype, organization, hierarchylevelname, scenario, "
							+ "temporalextentbeginposition, temporalextentendposition, "
							+ "relatedservice, relatedserviceid, relatedlayer, geographicboundingbox " 
						+ "FROM Details "
						+ "LEFT JOIN Facets ON Details.GMF_ID = Facets.GMF_ID "
						+ "LEFT JOIN Relateds ON Details.GMF_ID = Relateds.GMF_ID "
						+ "LEFT JOIN Topics ON Details.GMF_ID = Topics.GMF_ID "
						+ "LEFT JOIN Relatedds ON Details.GMF_ID = Relatedds.GMF_ID "
						+ "WHERE id ='" + id + "' " 
						+ "GROUP BY GMF_ID, title, description, datatype, organization, scenario, hierarchylevelname, temporalextentbeginposition, temporalextentendposition, relatedservice, relatedserviceid, relatedlayer, geographicboundingbox "; 
				} else {
					sql = "SELECT GMF_ID, id, title, description, "
							+ "GROUP_CONCAT (Topics.topiccategory ORDER BY Topics.topiccategory ASC SEPARATOR ';'), "
							+ "GROUP_CONCAT (Relatedds.relateddataset ORDER BY Relatedds.relateddataset ASC SEPARATOR ';'), "
							+ "datatype, organization, hierarchylevelname, scenario, "
							+ "temporalextentbeginposition, temporalextentendposition, "
							+ "relatedservice, relatedserviceid, relatedlayer, geographicboundingbox " 
						+ "FROM Details "
						+ "LEFT JOIN Facets ON Details.GMF_ID = Facets.GMF_ID "
						+ "LEFT JOIN Relateds ON Details.GMF_ID = Relateds.GMF_ID "
						+ "LEFT JOIN Topics ON Details.GMF_ID = Topics.GMF_ID "
						+ "LEFT JOIN Relatedds ON Details.GMF_ID = Relatedds.GMF_ID "
						+ "WHERE GMF_ID ='" + id + "' " 
						+ "GROUP BY GMF_ID, title, description, datatype, organization, scenario, hierarchylevelname, temporalextentbeginposition, temporalextentendposition, relatedservice, relatedserviceid, relatedlayer, geographicboundingbox "; 
				}
				//System.out.println(sql);
				
				ResultSet rs = stmt.executeQuery(sql); 
				result = ""; 
				while (rs.next()) { 
					
					//parsing gmf_id of related service
					String serviceid = "";
					if (rs.getString("relatedserviceid") != "" && rs.getString("relatedserviceid") != "NULL") {
						String sql2 = "SELECT GMF_ID "
									+ "FROM DETAILS "
									+ "WHERE ID ='" + rs.getString("relatedserviceid") + "'";
						ResultSet rs2 = stmt.executeQuery(sql2); 
						
						while (rs2.next()) {  
							serviceid = String.valueOf(rs2.getInt("GMF_ID"));
						}
					}
					
					//TODO: related dataset ...
//					if (rs.getString("datatype").equals("service")) {
//						String sql3 = "SELECT FACETS.GMF_ID, DETAILS.TITLE, FACETS.DATATYPE "
//								+ "FROM RELATEDS, FACETS "
//								+ "WHERE RELATEDSERVICEID ='" + rs.getString("relatedserviceid") + "' "
//								+ "AND RELATEDS.GMF_ID = FACETS.GMF_ID " + 
//								+ "AND RELATEDS.GMF_ID = = DETAILS.GMF_ID";
//					}
					
					String relatedDS = "";
					if (rs.getString("datatype").equals("publication")) { 
						String sql4 = "SELECT DETAILS.GMF_ID, DETAILS.TITLE "
								+ "FROM DETAILS JOIN RELATEDPUB ON DETAILS.GMF_ID = RELATEDPUB.GMF_ID "
								+ "WHERE PUBID= " + id;
						
						ResultSet rs4 = stmt.executeQuery(sql4); 
						
						relatedDS = "\"related datasets\": [ ";  
						while(rs4.next()) {
							relatedDS += "\"" + rs4.getInt("GMF_ID") +  "+" + HelpMethods.reReplaceString(rs4.getString("TITLE")) + "\", "; 
						}
						
						rs4.close();
						if (relatedDS.equals("related datasets: [ ")) relatedDS = "";
						else relatedDS = relatedDS.substring(0, relatedDS.length()-2) + " ], ";
					}
					
					result += "{ "
							+ "\"id\":\"" + rs.getInt("GMF_ID") + "\","
							+ "\"label\":\"" + HelpMethods.reReplaceString(rs.getString("title")) + "\","
							+ "\"description\":\"" + HelpMethods.reReplaceString((HelpMethods.replaceSpaces(rs.getString("description")))) + "\","
							+ "\"datatype\":\"" + rs.getString("datatype") + "\"," 
							+ "\"scenario\":\"" + rs.getString("scenario") + "\","
							+ "\"organization\":\"" + HelpMethods.reReplaceString(rs.getString("organization")) + "\","
							+ "\"hierarchylevelname\":\"" + rs.getString("hierarchylevelname") + "\","
							+ "\"temporalextentbeginposition\":\"" + rs.getString("temporalextentbeginposition") + "\","
							+ "\"temporalextentendposition\":\"" + rs.getString("temporalextentendposition") + "\","
							+ "\"related service\":\"" + rs.getString("relatedservice") + "\","
							+ "\"related service id\":\"" + serviceid + "\","
							+ "\"related layer\":\"" + rs.getString("relatedlayer") + "\"," 
							+ "\"uuid\":\"" + rs.getString("id") + "\","
							+ "\"geographicboundingbox\":\"" + rs.getString("geographicboundingbox") + "\","
							+ relatedDS;			
					
					String topicsString = null;
					if (rs.getString(5) != null) 
						topicsString = HelpMethods.reReplaceString(rs.getString(5)); 
					if (topicsString != null) {
						String[] topicsArray = topicsString.split(";");
						topicsString = "\"topiccategory\": [";
						for (int i=0; i < topicsArray.length; i++) 
							topicsString += "\"" + HelpMethods.reReplaceString(topicsArray[i]) + "\",";
						 
						topicsString = topicsString.substring(0, topicsString.length() - 1) + "]"; 
						result += topicsString + ",";
					}    
					result = result.substring(0, result.length()-1) + " }"; 
					
					//System.out.println("FINDONE: " + result);
				} 
				rs.close(); //close result set 
				
			} else if (query.equals(Constants.findPublicationByDsId)) {	 
				sql = "SELECT GMF_ID, title "  
					+ "FROM Details JOIN Relatedpub ON Details.GMF_ID = Relatedpub.pubid " 
					+ "WHERE Relatedpub.GMF_ID='" + id + "'" ;
			 
				ResultSet rs = stmt.executeQuery(sql);
				result = "["; 
				while (rs.next())    
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + HelpMethods.reReplaceString(rs.getString(2)) + "\" },";
				if (!result.equals("[")) result = result.substring(0, result.length()-1);
				result += "]";
				rs.close(); 
				
				//System.out.println(result);
			} else if (query.equals(Constants.findByMixed)) {	
				sql = "SELECT DISTINCT GMF_ID, title, datatype "; 
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + orga + "' AND ";
				if (!bbox.equals("-")) whereable += " Geographicboundingbox = '" + bbox + "' ";	
				
				if (topic != "-" || query.equals(Constants.findAllTopics)) { 
					sql += " FROM Details LEFT JOIN Facets ON Facets.GMF_ID = Details.GMF_ID LEFT JOIN Topics ON Facets.GMF_ID = Topics.GMF_ID ";					
				} else { 
					sql += " FROM Details LEFT JOIN Facets ON Details.GMF_ID = Facets.GMF_ID "; 
				}
			 
				if (!whereable.equals("")) {
					whereable = whereable.trim();
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				 
				//System.out.println("FINDBYMIXED: " + sql);
				
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"label\": \"" + rs.getString(3) + ": " + HelpMethods.reReplaceString(rs.getString(2)) + "\" },"; 
				result = result.substring(0, result.length()-1);
				result += " ]"; 
				rs.close(); //close result set
				
			} else if (query.equals(Constants.findMixedBox)) {	
				sql = "SELECT DISTINCT GMF_ID, geographicboundingbox "; 
				if (!hvl.equals("-")) whereable = " Hierarchylevelname = '" + hvl + "' AND ";
				if (!dt.equals("-")) whereable += " Datatype = '" + dt + "' AND "; 
				if (!topic.equals("-")) whereable += " Topiccategory = '" + topic + "' AND ";
				if (!scen.equals("-")) whereable += " Scenario = '" + scen + "' AND ";
				if (!orga.equals("-")) whereable += " Organization = '" + scen + "' AND "; 	
				
				//if (topic != "-" || query.equals(Constants.findAllTopics)) sql += " FROM Facets JOIN Topics ON Facets.GMF_ID = Topics.GMF_ID JOIN Details ON Facets.GMF_ID = Details.GMF_ID ";
				if (topic != "-" || query.equals(Constants.findAllTopics)) sql += " FROM Details JOIN Facets ON Details.GMF_ID = Facets.GMF_ID LEFT JOIN Topics ON Details.GMF_ID = Topics.GMF_ID ";
				else sql += " FROM Facets JOIN Details ON Facets.GMF_ID = Details.GMF_ID "; 
				 
				if (!whereable.equals("")) {
					whereable = whereable.trim();
					if (whereable.lastIndexOf("AND") + 3 == whereable.length())
						whereable = whereable.substring(0, whereable.length()-3);
					sql += " WHERE " + whereable; 
				}
				 
				//System.out.println("FINDMIXEDBOX: " + sql);
				
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", \"geographicboundingbox\": \"" + rs.getString(2) + "\" },"; 
				result = result.substring(0, result.length()-1);
				result += " ]"; 
				rs.close(); 	
			
			} else if (query.equals(Constants.findGrandParent)) { 
				result = findGrandParent(id, stmt);
			
			} else if (query.equals(Constants.findTree)) { 
				result = findTree(id, stmt);
				
			//Find Similarities - SearchBox		
			} else if (query.equals(Constants.findSimilarLimited)) {
				sql = "SELECT DISTINCT GMF_ID, title, datatype, description ";  
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
				sql = checkSQL(sql,id);
				ResultSet rs = stmt.executeQuery(sql); 			
				result = "[ ";
				while (rs.next()) 
					result += "{ \"id\": \"" + rs.getInt(1) + "\", "
							+ "\"label\": \"" + HelpMethods.reReplaceString(rs.getString(2)) + "\", "
							+ "\"datatype\": \"" + rs.getString(3) + "\", "
							+ "\"description\":\"" + HelpMethods.reReplaceString(rs.getString(4)) + "\" },"; 
				result = result.substring(0,result.length()-1);
				result += " ]"; 		
				rs.close();
				
			} else if (query.equals(Constants.findSimilarScenarioValues)) {
				
				sql = "SELECT DISTINCT SCENARIO FROM FACETS WHERE SCENARIO LIKE '%" + id + "%'";
				sql = checkSQL(sql,id);
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1) + " ]"; 		
				rs.close();
				
			} else if (query.equals(Constants.findSimilarDatatypeValues)) {
				
				sql = "SELECT DISTINCT DATATYPE FROM FACETS WHERE UPPER(DATATYPE) LIKE UPPER('%" + id + "%')";
				sql = checkSQL(sql,id);
				ResultSet rs = stmt.executeQuery(sql);  
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1) + " ]"; 		
				rs.close();
			
			} else if (query.equals(Constants.findSimilarHierarchylevelnameValues)) {
				
				sql = "SELECT DISTINCT HIERARCHYLEVELNAME FROM FACETS WHERE UPPER(HIERARCHYLEVELNAME) LIKE UPPER('%" + id + "%')";
				sql = checkSQL(sql,id);
				ResultSet rs = stmt.executeQuery(sql); 
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1) + " ]"; 		
				rs.close();
			
			} else if (query.equals(Constants.findSimilarOrganizationValues)) {
				
				sql = "SELECT DISTINCT ORGANIZATION FROM FACETS WHERE UPPER(ORGANIZATION) LIKE UPPER('%" + id + "%')";
				sql = checkSQL(sql,id);
				ResultSet rs = stmt.executeQuery(sql);  
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1) + " ]"; 		
				rs.close();
				
			} else if (query.equals(Constants.findSimilarTopiccategoryValues)) {
				
				sql = "SELECT DISTINCT TOPICCATEGORY FROM TOPICS WHERE UPPER(TOPICCATEGORY) LIKE UPPER('%" + id + "%')";
				sql = checkSQL(sql,id);
				ResultSet rs = stmt.executeQuery(sql);  
				result = "[ ";
				while (rs.next())     
					result += "\"" + rs.getString(1) + "\","; 
				result = result.substring(0,result.length()-1) + " ]"; 		
				rs.close();	
				
			} else if (query.equals(Constants.findInternId)) {
				
				sql = "SELECT GMF_ID FROM DETAILS WHERE ID='" + id + "'";
				ResultSet rs = stmt.executeQuery(sql);  
				while (rs.next())     
					result = "{ \"id\": \"" + rs.getInt("GMF_ID") + "\" } ";
				//System.out.println("RESULT: " + result);
				rs.close();	
				
			//create sql query for findAlls	
			} else {
				sql = "SELECT DISTINCT " + selectable;  
				if (topic != "-" || query.equals(Constants.findAllTopics))   
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
					if (rs.getString(1) != null && !rs.getString(1).equals(""))
						result += "\"" + rs.getString(1) + "\","; 
				}
				result = result.substring(0, result.length()-1);
				result += " ]";   
				
				rs.close();
			}
			 
			result = result.trim(); 
			stmt.close(); 	 
			return result;
		} catch (SQLException e) { e.printStackTrace(); } finally {
//			if (con != null) 
//				try { con.close(); } catch (SQLException e) { e.printStackTrace(); } 
		}
		return null;
	}
	
	/**
	 * This method requests grandparent of a given data set (id) and 
	 * further requests all children of this grand parent.
	 * Grandparent means data set on top of the data hierarchy (maybe great grandparent).
	 * A parent-child tree is generated.
	 * 
	 * @param id - id of data set
	 * @param stmt - statement
	 * @return hierarchy tree as JSON string (ids and titles of the data sets)
	 * @throws SQLException
	 */
	public String findTree(String id, Statement stmt) throws SQLException {
		String sql = "WITH RECURSIVE hierarchy_tree AS ( " 
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
		
		String result = "";
		if (idTitle.get(id) != null) {
			//building result string
			result = "{ " + "\"id\":\"" + id + "\"," + "\"label\":\"" + HelpMethods.reReplaceString(idTitle.get(id)) + "\" ";			
			ArrayList<String> gpChildren = relations.get(id);
			result += traverseChildren(idTitle, relations, gpChildren, "") + " }"; 
			rs.close();
		}
		return result;  
	}
	
	/**
	 * This method request the grandparent of a given data set (id).
	 * Grandparent means data set on top of the data hierarchy (maybe great grandparent).
	 * 
	 * @param id - id of data set
	 * @param stmt - statement
	 * @return id of grandparent, path from grandparent to data set and (direct) children of parent
	 * @throws SQLException
	 */
	public String findGrandParent(String id, Statement stmt) throws SQLException {
		String sql = "WITH RECURSIVE hierarchy_tree AS ( " 
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
		String result = "{ " + "\"id\":\"" + pathList.get(pathList.size()-1) + "\",";				
		result += "\"label\":\"" + HelpMethods.reReplaceString(grandParentTitle) + "\",";
		
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
		result = result.substring(0,result.length()-1) + " ] }"; 
		rs2.close(); //close second result set
		
		return result;
	}
	
	/**
	 * This help method traverse through the children tree and builds a string of them.
	 * 
	 * @param idTitle - name of data set
	 * @param relations - siblings, children (hierarchy)
	 * @param children - direct children
	 * @param result - database result
	 * @return children as JSON string
	 */
	public String traverseChildren(Map<String, String> idTitle, Map<String, ArrayList<String>> relations, ArrayList<String> children, String result) {
		String childrenString = ""; 
		if (children != null) {
			for (int i = 0; i < children.size(); i++) {
				childrenString += 
					"{ \"id\":\"" + children.get(i) + "\", \"label\":\"" + HelpMethods.reReplaceString(idTitle.get(children.get(i))) + "\"" +
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

	/**
	 * This method returns all lineage information needed for metaviz graph
	 * 
	 * @param externID - id of data set
	 * @return json string
	 * @throws SQLException
	 */
	public String lineageForID(String externID) throws SQLException{
		mappingIdsUuids = new HashMap<String, Object>();
		datasetList = new HashMap<String, Object>();
		
		//CREATING MAPS
		Map<String,Object> model_data = new HashMap<String, Object>();
		Map<String,Object> dataset_data = new HashMap<String, Object>();
		Map<String,Object> detail_data = new HashMap<String, Object>(); 
		Map<String,Object> all_data = new HashMap<String,Object>();	
		Map<String,Object> lineage_detail = new HashMap<String,Object>();	
		Map<String,Object> usage_detail = new HashMap<String,Object>();	
		
		//SETTING MAP IDs
		mappingIdsUuids.put("paramName", "mapping_ids_uuids");
		model_data.put("paramName", "models");
		dataset_data.put("paramName", "datasets");
		detail_data.put("paramName", "detail"); 
		all_data.put("paramName", "metaViz_data");
		
		//connection
		Connection con = null;
		//get connection from Container instead of creating new connections for every request
		if (Container.conn!=null)con = Container.conn;
		else
		con = DriverManager.getConnection("jdbc:hsqldb:file:"+Constants.dbFilePath2 +"; shutdown=true", "root", ""); //if changed, change path in query statement method
		Statement stmt = con.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);

		models.put("paramName", "models");
		//Sources - 	
		getSources(stmt, externID);
		//Usage
		usage_detail = getUsage(stmt, externID);
		//set dataset data
		dataset_data.putAll(datasetList); 
		//lineage details
		lineage_detail = getLineage(stmt, externID);
		//Models
		getModels(stmt, externID, "lineage", externID);
		model_data.putAll(models);
		detail_data.put("paramName", "detail");
		Map<String, Object> detail = new HashMap<String, Object>();
		detail.put("paramName", "detail");
		detail.put(externID, getDetailsTo(stmt, externID, externID, ""));
		all_data.put("detail_data", detail); 
		detail_data = detail; 
		mappingIdsUuids.put("detail_0", externID); 
		
		//ADDING MAPS TO all_data
		all_data.put("lineage_detail", lineage_detail);
		all_data.put("dataset_data", dataset_data);
		all_data.put("model_data", model_data);
		all_data.put("detail_data", detail_data);
		all_data.put("mapping_ids_uuids", mappingIdsUuids); 
		all_data.put("usage", usage_detail);

		//close connection
//		if (con != null) 
//			try { con.close(); } catch (SQLException e) { e.printStackTrace(); } 

		String json = (String) JsonObjectBuilder.buildLayer(all_data, "string");
		System.out.println(json);
		return json;	
	}
	
	
	/**
	 * This method returns all lineage information (process steps, statement etc)
	 * 
	 * @param stmt - Statement from connection
	 * @param externID - id of dataset
	 * @return Map<String, Object> with lineage information
	 * @throws SQLException
	 */
	private Map<String, Object> getLineage(Statement stmt,String externID) throws SQLException {
		String sql = 	 
				"SELECT Processsteps.Description, Processsteps.Datetime, Processsteps.Rationale, Processsteps.Processor,  "
				+ " Processinfos.Identifier, Processinfos.Runtimeparameter, Lineage.Description "
				+ "FROM Details "
				+ "LEFT JOIN Lineage ON Details.GMF_ID = Lineage.GMF_ID "
				+ "LEFT JOIN Processsteps ON Lineage.LID = Processsteps.LID "
				+ "LEFT JOIN Processinfos ON Processsteps.PSID = Processinfos.PSID "
				+ "WHERE id ='" + externID + "' " ;
		ResultSet rs = stmt.executeQuery(sql); 
		
		Map<String, Object> lineage = new HashMap<String, Object>();
		lineage.put("paramName", "lineage_detail");
		//process steps
		Map<String, Object> pSteps = new HashMap<String, Object>();
		Map<String, Object> statement = new HashMap<String, Object>();
		pSteps.put("paramName", "process_steps");
		int i = 0;

		while (rs.next()) { //TODO: if there are more steps, more processinfos - change would be  needed
			Map<String, Object> pStep = new HashMap<String, Object>();
			pStep.put("paramName", "process_step_"+i);
			pStep.put("description", rs.getString(1));
        	pStep.put("dateTime", rs.getString(2));
        	pStep.put("rationale", rs.getString(3));
        	pStep.put("processor", rs.getString(4));
        	
        	Map<String, Object> processingList = new HashMap<String, Object>();
        	processingList.put("paramName", "processingList");
        	Map<String, Object> processing = new HashMap<String, Object>();
    		processing.put("paramName", "processing_"+i);
    		processing.put("identifier", rs.getString(5));
    		processing.put("runTimeParams", rs.getString(6));
    		//software ref - there is no such thing in xml or db(profilefull)
    		Map<String, Object> swRefs = new HashMap<String, Object>();
			swRefs.put("paramName", "sw_refs_"+i);
			for (int j = 0; j < 1; j++) {
				//TODO: is swRefs info needed - if yes-> new table
			} 
			processing.put("sw_refs", swRefs);
        	
			//documentations
			Map<String, Object> docs = new HashMap<String, Object>();
			docs.put("paramName", "docs_"+i);
			docs.putAll(getDocs(stmt,externID));
			processing.put("docs", docs);
			processingList.put("processing_"+i, processing);
			pStep.put("processing_list", processingList);
        	pSteps.put("process_step_"+i, pStep); 
			
        	//statement
    		statement.put("paramName", "statement");
    		statement.put("description", rs.getString(7));

			i++;
		}
		lineage.put("process_steps", pSteps); 
		lineage.put("statement", statement); 		
		return lineage;
	}

	/**
	 * This method returns all related documents
	 * 
	 * @param stmt - Statement from connection
	 * @param externID - id of data set
	 * @return Map<String, Object> with document information
	 * @throws SQLException
	 */
	private Map<String, Object> getDocs(Statement stmt, String externID) throws SQLException {
		String sql = "SELECT B.Title, B.TEMPORALEXTENTBEGINPOSITION, B.Description " 
				+ "FROM Details "
				+ "LEFT JOIN Relatedpub ON Details.GMF_ID = Relatedpub.GMF_ID "
				+ "LEFT JOIN Details B ON Relatedpub.PUBID = B.GMF_ID "
				+ "WHERE id ='" + externID + "' " ;
		ResultSet rs = stmt.executeQuery(sql);
		
		int k = 0;
		Map<String, Object> citation = new HashMap<String, Object>();
		Map<String, Object> docs = new HashMap<String, Object>();
		while (rs.next()) {
			citation = new HashMap<String, Object>();
			citation.put("paramName", "doc_"+k); 	
			citation.put("title", rs.getString(1));
		    citation.put("alternateTitle", ""); //no xPathCiAltTitle/alt title in hsql db
		    citation.put("date", rs.getString(2));
		    citation.put("id", ""); //no xPathCiIdentifier/identidier in hsql db
		    citation.put("others", rs.getString(3));
		    docs.put("doc_"+k, citation);
			k++;
		}
		docs.put("size", k);
		return docs;
	}
	
	/**
	 * This method returns all models for lineage or usage type
	 * 
	 * @param stmt - Statement from connection
	 * @param modelID - id of data set
	 * @param type - lineage or usage
	 * @return Map<String, Object> with lineage/usage model information
	 * @throws SQLException
	 */
	private Map<String, Object> getModels(Statement stmt, String modelID, String type, String mainID) throws SQLException {
		String sql = "SELECT Identifier, Description, Datetime, Processor "
				+ "FROM Details "
				+ "LEFT JOIN Lineage ON Details.GMF_ID = Lineage.GMF_ID "
				+ "LEFT JOIN Processsteps ON Lineage.LID = Processsteps.LID "
				+ "LEFT JOIN Processinfos ON Processsteps.PSID = Processinfos.PSID "
				+ "WHERE id ='" + modelID + "' " ;
		ResultSet rs = stmt.executeQuery(sql); 
		
		Integer i = 0;
		rs.last();
		modelIds = new String[rs.getRow()];
	
		rs.beforeFirst();
		while (rs.next()) {
			Map<String, Object> model = new HashMap<String, Object>();
			model.put("paramName", "model_" + numberModels);
			if (rs.getString(1) != null)
				model.put("title", rs.getString(1));
			else
				model.put("title", "");
			if (rs.getString(2) != null)
				model.put("description", rs.getString(2));
			else
				model.put("description", "");
			if (rs.getString(3) != null) {
				if (!rs.getString(3).equals(""))
					model.put("dateTime", rs.getString(3));
			} else
				model.put("dateTime", "");
			if (rs.getString(4) != null)
				model.put("organisation", rs.getString(4));
			else
				model.put("organisation", "");
        	model.put("type", type);
        	model.put("info", ""); 
        	if (type.equals("usage")) {
        		String[] idArr = getInputforModel(stmt,modelID, mainID);
        		model.put("input_datasets", idArr); 
        	} else{
        		model.put("input_datasets", ids);
        	}
        	String[] ds = new String[1];
        	ds[0] = modelID;
        	model.put("output_datasets", ds); 
        	
        	//check if usage dataset is the same as input for model(lineage)
        	/*for (int j=0; j<ids.length;j++) {
        		if (ids[j].equals(modelID)) {
        			model.put("linked_2_modelInput", 1);
        			break;
        		}
        		 else model.put("linked_2_modelInput", 0);
        	}*/ //now in get DetailsTo()
        	
         	models.put("model_" + numberModels, model);
        	modelIds[i] = (String) models.get("paramName");
			if (type.equals("usage")) {
				mappingIdsUuids.put(type + "_model_" + numberModels, (String) model.get("paramName"));
				numberModels++;
			} else
				mappingIdsUuids.put(type + "_model_" + i,
						(String) model.get("paramName"));
        	//TODO: . why usagemodel1=model0 and usagemodel0=model1 - wrong vis with i=numberModel
			
			i++;
		}
		return models;
	}
	
	
	/**
	 * This method returns all source information / data sets
	 * 
	 * @param stmt - Statement from connection
	 * @param externID - id of data set
	 * @return Map<String, Object> with source information
	 * @throws SQLException
	 */
	private Map<String, Object> getSources(Statement stmt, String externID) throws SQLException {
		String sql = "SELECT B.ID, B.TITLE, B.Description, Facets.ORGANIZATION, B.Keywords, "
				+ "Url.Url, Url.Safe, Url.Info, B.TEMPORALEXTENTBEGINPOSITION, B.TEMPORALEXTENTENDPOSITION, Facets.GEOGRAPHICBOUNDINGBOX, Relationlineagesource.CODE "
				+ "FROM Details "
				+ "LEFT JOIN Lineage ON Details.GMF_ID = Lineage.GMF_ID "
				+ "LEFT JOIN Processsteps ON Lineage.LID = Processsteps.LID "
				+ "LEFT JOIN Processinfos ON Processsteps.PSID = Processinfos.PSID "
				+ "LEFT JOIN Relationlineagesource On Processsteps.PSID = Relationlineagesource.PSID "
				+ "LEFT JOIN Details B On Relationlineagesource.ID = B.ID "
				+ "LEFT JOIN Facets ON B.GMF_ID = Facets.GMF_ID "
				+ "LEFT JOIN Url ON B.GMF_ID = URL.GMF_ID "
				+ "WHERE id ='" + externID + "' " 
				+ "AND Relationlineagesource.ID IS NOT NULL" ;
		ResultSet rs = stmt.executeQuery(sql); 
		
		rs.last();
		ids = new String[rs.getRow()];
		rs.beforeFirst();
		int i = 0;
		while (rs.next()) {
			if (rs.getString(1) != null) {
				Map<String, Object> detailContent = new HashMap<String, Object>();
				detailContent.put("paramName", rs.getString(1));
				detailContent.put("title", rs.getString(2));
				detailContent.put("description", rs.getString(3));
				detailContent.put("organisation", rs.getString(4));
				detailContent.put("keywords", rs.getString(5));
				detailContent.put("type", "lineage");
				detailContent.put("save", rs.getString(7));
				detailContent.put("info", rs.getString(8));
				detailContent.put("view", rs.getString(6));

				if (!rs.getString(9).equals(""))
					detailContent.put("time", rs.getString(9) + "-" + rs.getString(10));
				else
					detailContent.put("time", "");

				detailContent.put("extent", rs.getString(11));
				detailContent.put("vector", "false");
				detailContent.put("relations_csw", " "); // TODO:get from db
				mappingIdsUuids.put("lineage_dataset_" + i, (String) detailContent.get("paramName"));
				datasetList.put((String) detailContent.get("paramName"), detailContent);
				ids[i] = rs.getString(1);
				i++;
			}
		}
		return datasetList;	
	}
	
	/**
	 * This method returns details/general information
	 * 
	 * @param stmt - Statement from connection
	 * @param id - id of data set
	 * @param paramName - unique param name for json string
	 * @param type - lineage or usage
	 * @return Map<String, Object> general information about data set
	 * @throws SQLException
	 */
	private Map<String,Object> getDetailsTo(Statement stmt, String id, String paramName, String type) throws SQLException {
		Map<String, Object> detailContent = new HashMap<String, Object>();
		String sql = "SELECT Details.TITLE, Details.Description, Facets.ORGANIZATION, Details.Keywords, "
				+ "Url.Url, Url.Safe, Url.Info, Details.TEMPORALEXTENTBEGINPOSITION, Details.TEMPORALEXTENTENDPOSITION, Facets.GEOGRAPHICBOUNDINGBOX "
				+ "FROM Details "
				+ "LEFT JOIN Facets ON Details.GMF_ID = Facets.GMF_ID "
				+ "LEFT JOIN Url ON Details.GMF_ID = URL.GMF_ID "
				+ "WHERE id ='" + id + "' " ;
		ResultSet rs = stmt.executeQuery(sql); 

		while(rs.next()) {
			detailContent.put("paramName", paramName);
			detailContent.put("title",  rs.getString(1));
			detailContent.put("description",  rs.getString(2));
			detailContent.put("organisation",  rs.getString(3));
			detailContent.put("keywords",  rs.getString(4));
			detailContent.put("type",  type);
			detailContent.put("save",  rs.getString(6));
			detailContent.put("info",  rs.getString(7));
			detailContent.put("view",  rs.getString(5));
			if (!rs.getString(8).equals("")) 
				detailContent.put("time",  rs.getString(8)+"-"+rs.getString(9));
			else
				detailContent.put("time", "");
			
			detailContent.put("extent",  rs.getString(10));
			detailContent.put("vector", "false");	  
			detailContent.put("relations_csw",  ""); //TODO: get from db
			 
			for (int j = 0; j < ids.length; j++) {
				if (ids[j] != null) {
					if (ids[j].equals(id)) {
						detailContent.put("linked_2_modelInput", 1);
						break;
					} else
						detailContent.put("linked_2_modelInput", 0);
				}
			} 
		}
		return detailContent; 
	}
	
	/**
	 * This method returns usage information / references
	 * 
	 * @param stmt - Statement from connection
	 * @param code - id of dataset / source code
	 * @return Map<String, Object> usage information
	 * @throws SQLException
	 */
	private Map<String, Object> getUsage(Statement stmt,String code) throws SQLException {
		Map<String,Object> usage_detail = new HashMap<String,Object>();
		usage_detail.put("paramName", "usage");
		Map<String,Object> modelsLoc = new HashMap<String,Object>();
		modelsLoc.put("paramName", "usage_models");
		String[] modelIdsL = new String[0];
		modelsLoc.put("usage_model_ids", modelIdsL);	
		Map<String,Object> mod_ds_relations = new HashMap<String,Object>();
		mod_ds_relations.put("paramName", "mod_ds_relations");

		//search for models
		String sql = "SELECT RELATIONMODELS.ID "
				+ "FROM Details "
				+ "LEFT JOIN Lineage ON Details.GMF_ID = Lineage.GMF_ID "
				+ "LEFT JOIN RELATIONMODELS ON Lineage.LID = RELATIONMODELS.LID "
				+ "WHERE id ='" + code + "' " 
				+ "AND RELATIONMODELS.ID IS NOT NULL" ;
		ResultSet rs = stmt.executeQuery(sql); 
		
		int i = 0;
		while (rs.next()) { 
			String id = rs.getString(1);
			Map<String, Object> detailContent = getDetailsTo(stmt, id, id, "usage");
			String[] dsArr = new String[1];
			dsArr[0] = id;
			getModels(stmt, id, "usage", code);
 
			if (i == 0) {
				String[] mo = new String[1];
				mo[0] = "usage_model_0";
				modelsLoc.put("usage_model_ids", mo);	 
				
                Map<String, Object> map0 = new HashMap<String, Object>();
                map0.put("paramName", "usage_models_0"); 
                map0.put("dataset_ids", dsArr);
                mod_ds_relations.put("map0", map0);
				mod_ds_relations.put("usage_model_0", "model_0");
			}  
			if (i > 0) {
				String[] mo = new String[i+1];
				for (int j = 0; j < mo.length; j++) {
					mo[j] = "usage_model_" + j;
				} 
				modelsLoc.remove("usage_model_ids");
				modelsLoc.put("usage_model_ids", mo);
				Map<String, Object> map1 = new HashMap<String, Object>();
				map1.put("paramName", "usage_models_" + i);
				map1.put("dataset_ids", dsArr);
				mod_ds_relations.put("map" + i, map1);
				mod_ds_relations.put("usage_model_" + i, "model_" + i);
			}			
			
			mappingIdsUuids.put("usage_dataset_"+i, (String) detailContent.get("paramName"));
			datasetList.put((String) detailContent.get("paramName"), detailContent);       	       
        	i++;
		}
		usage_detail.put("models", modelsLoc);
		usage_detail.put("mod_ds_relations", mod_ds_relations);
		return usage_detail;	
	}
	
	/**
	 * converts the sql string to search for all keywords if id/keyword(s) are separated with space sign " "
	 * 
	 * @param sql - generated sql for searching
	 * @param id - search words for id
	 * @return new sql if id has several keywords
	 */
	private String checkSQL (String sql, String id) {
		String newSQL ="";	
		if (id.split(" ").length < 2) {
			return sql;
		} else {
			String [] keywords = id.split(" ");	
			String [] sqlSplit = sql.split("WHERE");
			String rightHandStatement = sqlSplit[1].replace(id, "whatAPlaceHolder"); 
		
			newSQL = sqlSplit[0]; //saves the left handed statement 
			newSQL += " WHERE " + rightHandStatement.replace("whatAPlaceHolder", keywords[0]); //adds first keyword to the right handed statement 
			//add "AND" keywords 
			for (int i = 1; i < keywords.length; i++) {
				newSQL += " AND " + rightHandStatement.replace("whatAPlaceHolder", keywords[i]);	
			}	
		} 
		return newSQL;
	}
	
	/**
	 * returns list of input id's for given usage model and adds input datasets to datasat_data
	 * 
	 * @param stmt
	 * @param modelID
	 * @return
	 * @throws SQLException
	 */
	private String[] getInputforModel (Statement stmt,  String modelID, String mainID) throws SQLException{
		
		String sql = "SELECT B.ID "
				+ "FROM Details "
				+ "LEFT JOIN Lineage ON Details.GMF_ID = Lineage.GMF_ID "
				+ "LEFT JOIN Processsteps ON Lineage.LID = Processsteps.LID "
				+ "LEFT JOIN Processinfos ON Processsteps.PSID = Processinfos.PSID "
				+ "LEFT JOIN Relationlineagesource On Processsteps.PSID = Relationlineagesource.PSID "
				+ "LEFT JOIN Details B On Relationlineagesource.ID = B.ID "
				+ "WHERE id ='" + modelID + "' " 
				+ "AND Relationlineagesource.ID IS NOT NULL" ;

		ResultSet rs = stmt.executeQuery(sql); 
		rs.last();
		String [] inputIds = new String[rs.getRow()];
		rs.beforeFirst();
		int i = 0;
		while (rs.next()) {
			inputIds[i] = rs.getString(1);
			if (!rs.getString(1).equals(mainID)) {
				Map<String, Object> detailContent = getDetailsTo(stmt, rs.getString(1), rs.getString(1), "usage_input");// usage_dataset_"+numberModels+"_input
				datasetList.put((String) detailContent.get("paramName"), detailContent);
			} 
			i++;
		}
		return inputIds;
	}
}