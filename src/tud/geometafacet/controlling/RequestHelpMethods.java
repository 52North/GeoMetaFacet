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

package tud.geometafacet.controlling;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.xpath.NodeSet;
import org.w3c.dom.NodeList;

import tud.geometafacet.helper.Constants;
import tud.geometafacet.helper.FileDocumentMethods; 
import tud.geometafacet.helper.HelpMethods;
import tud.geometafacet.xpath.EvaluatingXPath;

/**
 * 
 * This class provides string processing methods.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class RequestHelpMethods {
	
	static EvaluatingXPath xpe = new EvaluatingXPath(); 
	
	/**
	 * This method sends an sql request to the catalogue db and
	 * requests keywords for a given metadata entry (id).
	 * 
	 * @param id - id of metadata entry
	 * @return keywords (separated with ,)
	 */
	public static String getKeywords(String id, Connection dbConnection) {
		try { 
			String keywords = new String();
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
				"SELECT tc30.tc_kw.subject " + 
				"FROM tc30.tc_kw JOIN tc30.tc_md ON tc30.tc_kw.idmdkw=tc30.tc_md.idmd " +
				"WHERE tc30.tc_md.identifier='" + id + "';");
	   
		 	while (result.next()) {
		 		if (result.getString(1) != null) {
		 			if (keywords.equals("")) keywords = result.getString(1);
		 			else keywords += "," + result.getString(1);
		 		}
		 	} 
		 	
		 	keywords = HelpMethods.prepareString(keywords);
		 	return keywords;	
		} catch (SQLException e) { e.printStackTrace(); }
		return null;
	} 
	
	/**
	 * This method sends an sql request to the catalogue db and
	 * request service and layer name of an related service.
	 * The information for this related service are stored in dataset metadata
	 * as codeSpace and code.
	 * 
	 * @param codeSpace - code space of related service, e.g. urn:glues:pik:metadata:dataset
	 * @param code - code of related service
	 * @return Array with [0] service name, [1] layer name, [2] service id
	 */
	public static String[] getRecordLink(String codeSpace, String code, Connection dbConnection) { 
		try {  					//e.g. urn:glues:pik:metadata:dataset#co2-echo-g-sresb2-bioenergydemand
			String hrefCreated = codeSpace + "#" + code; 
			
			Statement stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet result = stmt.executeQuery(
					"SELECT tc_md.profilefull " +
					"FROM tc30.tc_md, tc30.tc_operateson " +
					"WHERE tc_operateson.operateson='" + hrefCreated + "' " +
					"AND tc_md.idmd=tc_operateson.idmdservice;");
			
			String layerName = ""; String serviceId = "";
			while (result.next()) { 
				NodeList coupledResource = (NodeList) xpe.getXPathResult(Constants.xPathCoupledResource, new NodeSet(), FileDocumentMethods.createDocument(result.getString(1)).getChildNodes());
				
				for (int i = 0; i < coupledResource.getLength(); i++) {   
					NodeList nodes = coupledResource.item(i).getChildNodes(); 
					String crIdent = (String) xpe.getXPathResult(Constants.xPathCoupledResourceIdentifier, new String(), nodes);
					String scopeName = (String) xpe.getXPathResult(Constants.xPathCoupledResourceScopedName, new String(), nodes);
					 
					if (crIdent.equals(code) || crIdent.equals(hrefCreated)) {
						layerName = (String) xpe.getXPathResult("gco:ScopedName[@codeSpace='" + codeSpace + "']/text()", new String(), nodes);
						if (layerName.equals("")) layerName = scopeName;
					}	 
					serviceId = (String) xpe.getXPathResult(Constants.xPathIdentifier, new String(), FileDocumentMethods.createDocument(result.getString(1)).getChildNodes());					
				} 
				
				String[] layerAndName = new String[3];
				layerAndName[0] = (String) xpe.getXPathResult(Constants.xPathUrnLink, new String(), FileDocumentMethods.createDocument(result.getString(1)).getChildNodes());
				layerAndName[1] = layerName;
				layerAndName[2] = serviceId;
				return layerAndName;
			} 
		} catch (SQLException e) { e.printStackTrace(); } 
		return null;
	}
}
