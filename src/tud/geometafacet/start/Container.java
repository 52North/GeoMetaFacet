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
package tud.geometafacet.start;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import tud.geometafacet.helper.Constants;
import tud.geometafacet.hsql.HSQLConnection;

/**
 * saves hsql db for permanent use - no reload anymore / saves facet strings for first page call
 * @author Bernd Grafe. Professorship of Geoinformation Systems
 *
 */
public class Container {

	public static Connection conn;
	public static String countAllHierarchylevelnames;
	public static String countAllScenarios;
	public static String findAllTopiccategories;
	public static String countAllTopiccategories;
	public static String findAllDatatypes;
	public static String countAllDatatypes;
	public static String findAllOrganizations;
	public static String countAllOrganizations;
	public static String findAllIds;
	public static String findAllBBox;
	public static int counter = 0;
	public static Boolean first = false;
	
	/**
	 * create Connection - HSQLConnection.java will use this connection
	 * @throws SQLException
	 */
	public static void setConenction() throws SQLException {
		try { Class.forName("org.hsqldb.jdbcDriver"); } 
		catch (ClassNotFoundException e) { System.err.println("Driver not found!"); return; } 
		
		conn = null;
		conn = DriverManager.getConnection("jdbc:hsqldb:file:" + Constants.dbFilePath2 + "; shutdown=true", "root", ""); //path in Constants   //if changed, change path in lineage method		
	}
	
	/**
	 * creates facets string for first page call
	 */
	public static void setResults() {
		HSQLConnection hConn = new HSQLConnection();
		countAllHierarchylevelnames = hConn.queryStatement("countAllHierarchylevelnames","","Sustainable Landmanagement;GLUES;Regional Projects;LUCCi;TFO;LEGATO;KULUNDA;CarBioCial;SuMaRiO;CC-LandStraD;COMTESS;INNOVATE;SuLaMa;SASCHA;SURUMER", "-","-","-","-","-");
		countAllScenarios = hConn.queryStatement("countAllScenarios", "", "-", "Scenarios;GLUES Scenarios;Baseline;Baseline under Climate Change;No global biofuel quotas;No global biofuel quotas under Climate Change;Higher consumption of animal sourced food;Higher consumption of animal sourced food under Climate Change;Land expansion;Land expansion under Climate Change;SRES Scenarios;A1 Storyline and Scenario Family;A1;A1B;A2 Storyline and Scenario Family;A2;B1 Storyline and Scenario Family;B1;B2 Storyline and Scenario Family;B2", "-", "-", "-", "-");
		findAllTopiccategories = hConn.queryStatement("findAllTopiccategories", "", "-", "-", "-",  "", "-", "-");
		countAllTopiccategories =findAllTopiccategories.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\"", "").replaceAll(",", "..");
		countAllTopiccategories = hConn.queryStatement("countAllTopiccategories", "", "-", "-", "-", countAllTopiccategories, "-", "-");
		findAllDatatypes = hConn.queryStatement("findAllDatatypes", "", "-", "-", "-", "-", "", "-");
		countAllDatatypes = findAllDatatypes.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\"", "").replaceAll(",",";");
		countAllDatatypes= hConn.queryStatement("countAllDatatypes", "", "-", "-", "-", "-", countAllDatatypes, "-");
		findAllOrganizations = hConn.queryStatement("findAllOrganizations", "", "-", "-", "", "-", "-", "-");
		countAllOrganizations = findAllOrganizations.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\"", "").replaceAll(",", "..");
		countAllOrganizations = hConn.queryStatement("countAllOrganizations", "", "-", "-", countAllOrganizations, "-", "-", "-");
		findAllIds = hConn.queryStatement("findAllIds", "", "", "", "", "", "", "");
		findAllBBox = hConn.queryStatement("findAllBBox", "", "", "", "", "", "", "");
		first=true;
	}
	
	/**
	 * returns facet string - sets boolean first=false after all 10 requests
	 * @param query
	 * @return
	 */
	public static String getResult(String query) {
		String result = "";
		if (query.equals("countAllHierarchylevelnames")) {
			counter++;
			result = countAllHierarchylevelnames;
		} else if (query.equals("countAllScenarios")) {
			counter++;
			result = countAllScenarios;
		} else if (query.equals("findAllTopiccategories")) {
			counter++;
			result = findAllTopiccategories;
		} else if (query.equals("countAllTopiccategories")) {
			counter++;
			result = countAllTopiccategories;
		} else if (query.equals("findAllDatatypes")) {
			counter++;
			result = findAllDatatypes;
		} else if (query.equals("countAllDatatypes")) {
			counter++;
			result = countAllDatatypes;
		} else if (query.equals("findAllOrganizations")) {
			counter++;
			result = findAllOrganizations;
		} else if (query.equals("countAllOrganizations")) {
			counter++;
			result = countAllOrganizations;
		} else if (query.equals("findAllIds")) {
			counter++;
			result = findAllIds;
		} else if (query.equals("findAllBBox")) {
			counter++;
			result = findAllBBox;
		}
		if (counter == 10) first = false;
		return result;
	}
}
