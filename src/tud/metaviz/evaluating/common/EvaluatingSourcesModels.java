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

package tud.metaviz.evaluating.common;

import java.util.HashMap;
import java.util.Map;

import org.apache.xpath.NodeSet;
import org.w3c.dom.NodeList;

import tud.metaviz.connection.csw.CSWConnection;
import tud.metaviz.connection.file.FileConnection;
import tud.metaviz.controlling.RequestControlling;
import tud.geometafacet.helper.Constants;
import tud.geometafacet.xpath.*;
 
/**
 * 
 * This class handles source and model evaluations based on XML documents.
 * (model = process description)
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
public class EvaluatingSourcesModels {

	EvaluatingXPath xpe = new EvaluatingXPath();
	Map<String,Object> mappingIdsUuids;	//TODO: setMapping callen!
	Map<String, Object> models = new HashMap<String, Object>();	
	String[] sourceIds, modelIds;
	
	int numberModels = 0;
	
	/**
	 * Constructor.
	 * @param mappingIdsUuids - map of internal ids 2 data set ids
	 */
	public EvaluatingSourcesModels (Map<String,Object> mappingIdsUuids) {
		this.mappingIdsUuids = mappingIdsUuids;
		models.put("paramName", "models");
	}
	
	/**
	 * This method parses model information (title, description, ...).
	 * In this case model is represented in XML als process step tag.
	 * 
	 * @param resultNode - xml metadata as node
	 * @param dsId - id of data set 
	 * @param linUs - unique value to distinguish between lineage and usage ids (lineage/usage will concatenated to id string)
	 * @param sourceIds - ids of source data sets for the given data set
	 * @return Map<String,Object> with model information
	 */
	public Map<String, Object> getModels(NodeList resultNode, String dsId, String linUs, String[] sourceIds) {
        NodeList processSteps = (NodeList) xpe.getXPathResult(Constants.xPathProcessSteps, new NodeSet(), resultNode);
        modelIds = new String[processSteps.getLength()];
		
        for (int i = 0; i < processSteps.getLength(); i++) {
        	Map<String, Object> model = new HashMap<String, Object>();
        	model.put("paramName", "model_" + numberModels);
        	model.put("title", (String) xpe.getXPathResult(Constants.xPathPRIdentifier, new String(), resultNode));
        	model.put("description", (String) xpe.getXPathResult(Constants.xPathPSDescription, new String(), processSteps.item(i).getChildNodes()));
        	model.put("dateTime", (String) xpe.getXPathResult(Constants.xPathPSDateTime, new String(), processSteps.item(i).getChildNodes()));
        	model.put("organisation", (String) xpe.getXPathResult(Constants.xPathPSProcessorOrganisation, new String(), resultNode));
        	model.put("type", linUs);
        	model.put("info", ""); 
        	
        	model.put("input_datasets", sourceIds); 
        	
        	String[] ds = new String[1];
        	ds[0] = dsId;
        	model.put("output_datasets", ds);   
        	models.put("model_" + numberModels, model);
        	
        	modelIds[i] = (String) models.get("paramName");       	
        	mappingIdsUuids.put(linUs + "_model_"+i, (String) model.get("paramName")); 
        	numberModels++;
        }
		return models;
	}	
	
	/**
	 * Method to return models.
	 * 
	 * @return models as Map<String,Object>
	 */
	public Map<String, Object> getAllModels() {
		return models;
	}
	
	@SuppressWarnings("static-access")
	/**
	 * Method that parses source information based on a xml node.
	 * 
	 * @param resultNode - xml metadata as node
	 * @param unique - string to distinguish lineage/usage internal ids
	 * @return Map<String,Object> with sources
	 */
	public Map<String, Object> getSources(NodeList resultNode, String unique) {
		Map<String, Object> sourceList = new HashMap<String, Object>();
        
		NodeList linSources = (NodeList) xpe.getXPathResult(Constants.xPathSource, new NodeSet(), resultNode);              
        sourceIds = new String[linSources.getLength()];
        
        sourceList.put("paramName", unique+"datasets");
        for (int i = 0; i < linSources.getLength(); i++) {
        	Map<String, Object> source = new HashMap<String, Object>(); 
        	if ((String) xpe.getXPathResult(Constants.xPathSourceIdentifier, new String(), linSources.item(i).getChildNodes()) != "") {       	
        		String code = (String) xpe.getXPathResult(Constants.xPathSourceIdentifier, new String(), linSources.item(i).getChildNodes());
        		String codeSpace = (String) xpe.getXPathResult(Constants.xPathSourceIdentifierSpace, new String(), linSources.item(i).getChildNodes());
	
        		String id = "";
        		if (RequestControlling.getMode().contains("tud.metaviz.connection.csw.CSWConnection"))
        			id = CSWConnection.getInstance().getID(code, codeSpace);
        		else if (RequestControlling.getMode().contains("tud.metaviz.connection.file.FileConnection"))
        			id = FileConnection.getInstance().getID(code, codeSpace);
        		
        		source = (Map<String, Object>) EvaluatingCommon.getBaseDetailsTo(id, unique + id, "lineage");//.get(id);
        	} else {
        		source.put("paramName", unique+"source_"+i);
        	}
        	     	 
        	sourceIds[i] = (String) source.get("paramName");
        	mappingIdsUuids.put("lineage_dataset_"+i, (String) source.get("paramName"));
      	
        	if ((String) xpe.getXPathResult(Constants.xPathSourceIdentifier, new String(), linSources.item(i).getChildNodes()) != "") {
        		sourceList.put(unique + source.get("paramName"), source);       	       
        	} else {
        		sourceList.put(unique+"source_"+i, source);
        	}
        }
		return sourceList;
	} 
	
	/**
	 * Method to return source ids
	 * @return string array with source ids
	 */
	public String[] getSourceIds() {
		return sourceIds;
	}
}
