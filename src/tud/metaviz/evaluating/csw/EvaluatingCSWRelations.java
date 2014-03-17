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

package tud.metaviz.evaluating.csw;

import java.util.HashMap;
import java.util.Map;

import org.apache.xpath.NodeSet; 
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import tud.geometafacet.xpath.EvaluatingXPath;
import tud.geometafacet.helper.Constants;
 
/**
 * 
 * This class parses and handles parent-child relations.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class EvaluatingCSWRelations {
 
	static EvaluatingXPath xpe = new EvaluatingXPath();
	
	/**
	 * This method returns the csw relations (parent-child).
	 * 
	 * @param resultNode - xml metadata as node
	 * @param allData - node with further details, results should be appended to allData 
	 * @return Map<String,Object> with relation information
	 */
	public static Map<String,Object> getRelations(NodeList resultNode, Node allData) {
		String id = (String) xpe.getXPathResult(Constants.xPathIdentifier, new String(), resultNode);
		Map<String,Object> relations = new HashMap<String,Object>();
		relations.put("paramName", "relations_csw_"+id);  
		relations.put("parent",getParent(id, resultNode, allData)); 
		relations.put("children", getChildren(id, allData));
		return relations; 
	}
	
	/**
	 * This method parses parent ids from a given metadata xml.
	 * 
	 * @param uuid - id of the data set to get the parent for
	 * @param resultNode - xml metadata as node
	 * @param allData - contains all previously processed information
	 * @return Map<String,Object> with parent information
	 */
	public static Map<String,Object> getParent(String uuid, NodeList resultNode, Node allData) {
		String parentID = (String) xpe.getXPathResult(Constants.xPathParent, new String(), resultNode);
		String xPathParentTitle = "//gmd:MD_Metadata[gmd:fileIdentifier/gco:CharacterString='"+parentID+"']/gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString/text()";
		String parentTitle = (String) xpe.getXPathResult(xPathParentTitle, new String(), allData.getChildNodes());
		
		Map<String,Object> parent = new HashMap<String,Object>();
		parent.put("paramName", "parent_"+uuid);
		parent.put("id", parentID);
		parent.put("title", parentTitle); 
		return parent;
	}
	
	/**
	 * This method parses children ids from a given metadata xml.
	 * 
	 * @param uuid - id of the data set to get the parent for
	 * @param allData - contains all previously processed information
	 * @return Map<String,Object> with children information
	 */
	public static Map<String,Object> getChildren(String uuid, Node allData) { 
		Map<String,Object> children = new HashMap<String,Object>(); 
		children.put("paramName","children_"+uuid);
		String xPathChilds = "//gmd:MD_Metadata[gmd:parentIdentifier/gco:CharacterString='" + uuid + "']"; 
		NodeList childs = (NodeList) xpe.getXPathResult(xPathChilds, new NodeSet(), allData.getChildNodes());
		for (int i = 0; i < childs.getLength(); i++) {
			Map<String, Object> child = new HashMap<String,Object>();
			child.put("paramName", "child_"+uuid+"_"+i);
			child.put("title", (String) xpe.getXPathResult(Constants.xPathChildTitle, new String(), childs.item(i).getChildNodes()));
			child.put("id", (String) xpe.getXPathResult(Constants.xPathId, new String(), childs.item(i).getChildNodes()));
			children.put("child_"+i, child);
		}
		children.put("size",childs.getLength());
		return children;
	}
	
}
