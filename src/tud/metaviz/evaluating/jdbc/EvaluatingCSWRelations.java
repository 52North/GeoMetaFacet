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

package tud.metaviz.evaluating.jdbc;
 
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map; 

import tud.metaviz.connection.db.JDBCConnection; 

/**
 * 
 * This class parses and handles parent-child relations.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class EvaluatingCSWRelations { 
	 
	public static Map<String,Object> getRelations(String id) {
		Map<String,Object> relations = new HashMap<String,Object>();
		relations.put("paramName", "relations_csw_"+id);  
		relations.put("parent",getParent(id)); 
		relations.put("children", getChildren(id));
		return relations; 
	} 
	
	static int uniqueCount = 0;
	
	/**
	 * This method returns the csw relations (parent-child).
	 * 
	 * @param resultNode - xml metadata as node
	 * @param allData - node with further details, results should be appended to allData 
	 * @return Map<String,Object> with relation information
	 */
	public static Map<String,Object> getParent(String id) {
		try {   
			Statement stmt = JDBCConnection.getConnection().createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT  md2.identifier, md2.title " +
				"FROM tc30.tc_md AS md1, tc30.tc_md AS md2 " +
				"WHERE md1.identifier='" + id + "' AND " +
					  "md1.parentidentifier = md2.identifier;");
			
			Map<String,Object> parent = new HashMap<String,Object>();		
			while (result.next()) {
				parent.put("paramName", "parent_" + uniqueCount + "_" + result.getString(1));
				parent.put("id", result.getString(1));
				parent.put("title", result.getString(2)); 
				uniqueCount++;
			}
			if (parent.size() < 1) parent.put("paramName", "parent_" + id); 
			return parent;
		} catch (SQLException e) { e.printStackTrace(); }		
		return new HashMap<String, Object>();
	}
	
	/**
	 * This method parses parent ids from a given metadata xml.
	 * 
	 * @param uuid - id of the data set to get the parent for
	 * @param resultNode - xml metadata as node
	 * @param allData - contains all previously processed information
	 * @return Map<String,Object> with parent information
	 */
	public static Map<String,Object> getChildren(String id) {	
		try { 
			Statement stmt = JDBCConnection.getConnection().createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT md2.identifier, md2.title " +
				"FROM tc30.tc_md AS md1, tc30.tc_md AS md2 " +
				"WHERE md1.identifier='" + id + "' AND md2.parentidentifier = md1.identifier;");
			
			Map<String,Object> children = new HashMap<String,Object>(); 
			children.put("paramName","children_" + id);
			
			int childs = 0;
			while (result.next()) {				
				Map<String, Object> child = new HashMap<String,Object>();
				child.put("paramName", "child_" + id + "_" + childs);
				child.put("title", result.getString(2));
				child.put("id", result.getString(1));
				children.put("child_" + childs, child);
				childs++;
			}
			children.put("size", childs); 
			return children;			
		} catch (SQLException e) { e.printStackTrace(); }
		return null;
	}
}
