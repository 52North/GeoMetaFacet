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

package tud.metaviz.connection.db;
 
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map; 

import org.apache.xpath.NodeSet;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList; 
 
import tud.metaviz.connection.Connection;  
import tud.metaviz.evaluating.common.EvaluatingCommon;
import tud.metaviz.evaluating.common.EvaluatingLineage;
import tud.metaviz.evaluating.common.EvaluatingSourcesModels;
import tud.geometafacet.xpath.EvaluatingXPath;
import tud.geometafacet.helper.Constants;
import tud.geometafacet.helper.INTERN;
import tud.geometafacet.helper.HelpMethods; 
import tud.geometafacet.helper.FileDocumentMethods;
import tud.geometafacet.json.JsonObjectBuilder;

/**
 * 
 * This class handles lineage requests to the CSW database.
 * This class can be used to evaluate data faster, but it is dependent 
 * to the database scheme of the terra.catalog.
 * Functionality is same as @see FileConnection (using File), CSWConnection (using CSW)
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class JDBCConnection implements Connection {
 
	static EvaluatingXPath xpe = new EvaluatingXPath(); 
	static java.sql.Connection dbConnection;
	static EvaluatingSourcesModels esm;
	static Map<String,Object> mappingIdsUuids = new HashMap<String, Object>();
	static Map<String, Object> datasetList = new HashMap<String, Object>();
	static String[] ids;
	
	private static JDBCConnection jdbcConnection;
	
	/**
	 * Singleton implementation
	 * @return JDBCConnection
	 */
	public static JDBCConnection getInstance() {
		if (jdbcConnection == null) jdbcConnection = new JDBCConnection();
		return jdbcConnection;
	}
	
	/**
	 * Private constructor.
	 */
	private JDBCConnection() {}
	
	
	/**
	 * This method initializes db connection.
	 */
	public static void initConnection() {
		try {
			Class.forName("org.postgresql.Driver");	
			dbConnection = DriverManager.getConnection(
					INTERN.jdbcURL, 
					INTERN.dbUser, 
					INTERN.dbPasswd);
		} catch (ClassNotFoundException e) { e.printStackTrace(); 
		} catch (SQLException e) { e.printStackTrace(); }
	}
	
	/**
	 * This method closes db connection.
	 */
	public static void closeConnection() {
		try {
			dbConnection.close();
		} catch (SQLException e) { e.printStackTrace(); }
	}
	
	/**
	 * This method requests and evaluates all data from the CSW.
	 */
	public String getRecordNames() {	
		initConnection();
		String records = getAllRecords();
		closeConnection();
		return records;	
	}
	
	/**
	 * This method request a certain metadata entry by its id
	 * and returns processed data as string.
	 */
	public String getRecordDetails(String id) {	
		initConnection();
		String recordDetails = buildRecordMaps(id);  
		closeConnection();
		return recordDetails;
	}
	
	/**
	 * This method evaluates an xml node and stores ids for lineage sources (data sets).
	 * 
	 * @param resultNode - an xml sub node of metadata entry
	 * @return string array with source ids
	 */
	public static String[] getSourceCodes(NodeList resultNode) { 
		NodeList linSources = (NodeList) xpe.getXPathResult(Constants.xPathSource, new NodeSet(), resultNode);              
        String[] sourceIds = new String[linSources.getLength()];
       
        for (int i = 0; i < linSources.getLength(); i++) 
        	sourceIds[i] = (String) xpe.getXPathResult(Constants.xPathSourceIdentifier, new String(), linSources.item(i).getChildNodes());   		
        return sourceIds;
	}

	/**
	 * This method request details for source ids.
	 * 
	 * @param detailResultNode - sub xml node of metadata entry
	 * @param linUs - string to differentiate lineage/usage sources
	 * @return Map <String, Object> with source ids (String) and full details (Object)
	 */
	public static Map<String, Object> getSources(NodeList detailResultNode, String linUs) {
		datasetList.put("paramName", "datasets");
		ids = getSourceCodes(detailResultNode);  
		
		for (int i = 0; i < ids.length; i++) {		
			try {  	
				Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
				ResultSet result = stmt.executeQuery(
					"SELECT tc_md.profilefull " +
					"FROM tc30.tc_md, tc30.tc_resourceidentifier " +
					"WHERE tc_resourceidentifier.resourceidentifier='" + ids[i] + "' " +
					"AND tc_md.idmd=tc_resourceidentifier.idmdresid;");
				
				while (result.next()) {				 
					NodeList resultNode = FileDocumentMethods.createDocument(result.getString(1)).getChildNodes();
					String id = (String) xpe.getXPathResult(Constants.xPathIdentifier, new String(), resultNode);
					Map<String, Object> detailContent = EvaluatingCommon.getBaseDetailsTo(id, id, "lineage");
					mappingIdsUuids.put("lineage_dataset_"+i, (String) detailContent.get("paramName"));
					datasetList.put((String) detailContent.get("paramName"), detailContent);       	       
				}		
			} catch (SQLException e) { e.printStackTrace(); }
		} //end for
		return datasetList;
	}
		
	/**
	 * This method request usage of a data set. (where is data set referenced in lineage of
	 * other data sets.
	 *  
	 * @param code - source id
	 * @return Map<String, Object> usage_models (ids, names) and usage data sets (ids, names)
	 */
	public static Map<String, Object> getUsage(String code) {
		Map<String,Object> usage_detail = new HashMap<String,Object>();
		usage_detail.put("paramName", "usage");
		
		Map<String,Object> models = new HashMap<String,Object>();
		models.put("paramName", "usage_models");
		String[] modelIds = new String[0];
		models.put("usage_model_ids", modelIds);
		//TODO:fill 
			
		Map<String,Object> mod_ds_relations = new HashMap<String,Object>();
		mod_ds_relations.put("paramName", "mod_ds_relations");
		//TODO: fill
	  
		try {  	
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT DISTINCT tc_md.profilefull " +
				"FROM tc30.tc_md, tc30.tc_source " +
				"WHERE tc_source.sourcecode='" + code + "' " +
				"AND tc_md.idmd=tc_source.idmdsource " +
				"AND tc_md.parentidentifier is NULL;");
			
			int i = 0;
			while (result.next()) { 
				NodeList resultNode = FileDocumentMethods.createDocument(result.getString(1)).getChildNodes();
				String id = (String) xpe.getXPathResult(Constants.xPathIdentifier, new String(), resultNode);
				Map<String, Object> detailContent = EvaluatingCommon.getBaseDetailsTo(id, id, "usage");//new HashMap<String, Object>();
	
				String[] dsArr = new String[1];
				dsArr[0] = id;
				
				esm.getModels(resultNode, id, "usage", dsArr);
	 
				if (i == 0) {
					String[] mo = new String[1];
					mo[0] = "usage_model_0";
					models.put("usage_model_ids", mo);	 
					
	                Map<String, Object> map0 = new HashMap<String, Object>();
	                map0.put("paramName", "usage_models_0"); 
	                map0.put("dataset_ids", dsArr);
	                mod_ds_relations.put("map0", map0);
					mod_ds_relations.put("usage_model_0", "model_0");
				}  
				if (i == 1) {
					String[] mo = new String[2];
					mo[0] = "usage_model_0";
					mo[1] = "usage_model_1"; 
					models.remove("usage_model_ids");
					models.put("usage_model_ids", mo);	 
	                Map<String, Object> map1 = new HashMap<String, Object>();
	                map1.put("paramName", "usage_models_1"); 
	                map1.put("dataset_ids", dsArr);
	                mod_ds_relations.put("map1",map1);
					mod_ds_relations.put("usage_model_1", "model_1");
					mappingIdsUuids.put("usage_model_1", "model_0");
					mappingIdsUuids.put("usage_model_0", "model_1");
				}			
				
				mappingIdsUuids.put("usage_dataset_"+i, (String) detailContent.get("paramName"));
				datasetList.put((String) detailContent.get("paramName"), detailContent);       	       
	        	i++;
			} //end while
			 
			usage_detail.put("models", models);
			usage_detail.put("mod_ds_relations", mod_ds_relations);
			return usage_detail;	
		} catch (SQLException e) { e.printStackTrace(); }
		return null;
	}
 
	/**
	 * This methods calls all other methods of this class, and builds the response
	 * object with lineage, usage and detail data for a certain data set (id)
	 * 
	 * @param id - id of data set
	 * @return result string of requests
	 */
	public static String buildRecordMaps(String id) {
		mappingIdsUuids = new HashMap<String, Object>();
		datasetList = new HashMap<String, Object>();
		 
		try { 	
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT tc_md.profilefull " +
				"FROM tc30.tc_md " +
				"WHERE tc_md.identifier = '" + id + "';");
		
			//BUILDING JSON //CREATING MAPS
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
			
			while (result.next()) {		
				esm = new EvaluatingSourcesModels(mappingIdsUuids);
				Document doc = FileDocumentMethods.createDocument(result.getString(1));
				NodeList resultNode = doc.getChildNodes();
	
				//SETTING DATASET DATA 
				getSources(resultNode, "lineage");
				
				String dsCode = (String) xpe.getXPathResult(Constants.xPathRSIdentifier, new String(), resultNode);
				usage_detail = getUsage(dsCode);
				
				dataset_data.putAll(datasetList); 
				//SETTING LINEAGE DETAIL
				EvaluatingLineage el = new EvaluatingLineage();
				lineage_detail = el.getLineage(resultNode);
 
				//SETTING MODEL DATA 
				esm.getModels(resultNode, id, "lineage", ids);
				//TODO: always call getUsage() first!
				model_data.putAll(esm.getAllModels()); 
	
				detail_data.put("paramName", "detail"); 
				 
				Map<String, Object> detail = new HashMap<String, Object>();
				detail.put("paramName", "detail");
				detail.put(id, EvaluatingCommon.getBaseDetailsTo(id, id, ""));	
				all_data.put("detail_data", detail); 
				detail_data = detail; 
				
				mappingIdsUuids.put("detail_0", id); 
			}
			
			//ADDING MAPS TO all_data
			all_data.put("lineage_detail", lineage_detail);
			all_data.put("dataset_data", dataset_data);
			all_data.put("model_data", model_data);
			all_data.put("detail_data", detail_data);
			all_data.put("mapping_ids_uuids", mappingIdsUuids); 
			all_data.put("usage", usage_detail);
			 
			return (String) JsonObjectBuilder.buildLayer(all_data, "string");			
		} catch (SQLException e) { e.printStackTrace(); }
		return "";
	}
	
	/**
	 * This method evaluates all csw database data and processes this.
	 * Returns result string with all data as JSON string.
	 * 
	 * @return results as JSON string
	 */
	public String getAllRecords() { 
		try { 
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT tc_md.identifier, tc_md.title, tc_md.abstract, tc_organisationname.organisationname " +
				"FROM tc30.tc_md, tc30.tc_organisationname " +
				"WHERE tc_md.idmd = tc_organisationname.idmdorgname AND tc_md.type='dataset';");
			
			//BUILDING JSON
			Map<String, Object> allData = new HashMap<String, Object>(); 
			ArrayList<Object> elementlist = new ArrayList<Object>();
			HashMap <String, String> ids = new HashMap <String, String>(); //help map to avoid double ids
			
			while (result.next()) {
				if (!result.getString(1).equals("79d2629b-9519-4f9c-b8ff-92538f777f03") 
				&& !ids.containsKey(result.getString(1))) {
					
					ids.put(result.getString(1), result.getString(1));
					
					Map<String, String> element = new HashMap<String, String>();
					element.put("paramName", result.getString(1)); 
					element.put("organisation", result.getString(4));
					element.put("name", result.getString(2));
					
					String abstracttext = result.getString(3);
					if (abstracttext != null && abstracttext.length() > 200)
						abstracttext = abstracttext.substring(0,200) + " ...";
					element.put("abstracttext", abstracttext);
					element.put("type", "dataset");
					
					elementlist.add(element);		
				}
			}
			
			allData.put("paramName", "data"); 
			allData.put("elementlist", HelpMethods.fillArray(elementlist)); 
 
			return (String) JsonObjectBuilder.buildLayer(allData, "string");
		} catch (SQLException e) { e.printStackTrace(); }
		
		return "";
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
		try { 
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT tc_md.profilefull " +
				"FROM tc30.tc_md, tc30.tc_operateson " +
				"WHERE tc_operateson.operateson='" + codeSpace + "#" + code + "' " +
				"AND tc_md.idmd=tc_operateson.idmdservice;");
			
			while (result.next())  
				return (String) xpe.getXPathResult(Constants.xPathUrnLink, new String(), FileDocumentMethods.createDocument(result.getString(1)).getChildNodes());					
		} catch (SQLException e) { e.printStackTrace(); }
		
		return "";
	}
	
	/**
	 * This method requests a single metadata entry based on a given metadata id.
	 * 
	 * @param id - of metadata entry
	 * @return result string as JSON
	 */
	public static Document doRecordRequest(String id) {
		try { 
			
			initConnection();
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT tc_md.profilefull " +
				"FROM tc30.tc_md " +
				"WHERE tc_md.identifier = '" + id + "';");
			
			while (result.next()) 
				return FileDocumentMethods.createDocument(result.getString(1));
			
			closeConnection();
		} catch (SQLException e) { e.printStackTrace(); }
		return null;
	}

	/**
	 * Help method to call the open database connection from other classes.
	 * @return connection
	 */
	public static java.sql.Connection getConnection() {
		return dbConnection;
	}
	
}
