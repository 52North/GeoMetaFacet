package tud.metaviz.evaluating.csw;

import java.util.HashMap;
import java.util.Map;

import org.apache.xpath.NodeSet; 
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import tud.metaviz.connection.csw.CSWConnection; 
import tud.metaviz.connection.file.FileConnection;
import tud.metaviz.controlling.RequestControlling;
import tud.metaviz.evaluating.common.EvaluatingCommon;
import tud.geometafacet.xpath.EvaluatingXPath;
import tud.geometafacet.helper.Constants;

/**
 * 
 * This class parses and handles usage information.
 * In this case, usage of a data set = lineage of its predecessor
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
public class EvaluatingUsage {
	EvaluatingXPath xpe = new EvaluatingXPath();
	int j = 0; int usage_ds_stored = 0;
	Map<String, Object> models = new HashMap<String, Object>();
	Map<String, Object> mappingUuidsIds = new HashMap<String, Object>();
	 
	/**
	 * Method to get usage information.
	 * 
	 * @param mappingIdsUuids - mapping of internal used ids 2 uuids
	 * @param uuid - id of the data set to get the parent for
	 * @param allData - contains all previously processed information
	 * @return Map<String,Object> with usage information
	 */
	public Map<String,Object> getUsage(Node allData, String uuid, Map<String,Object> mappingIdsUuids){
		
		Map<String,Object> usage = new HashMap<String,Object>();
		usage.put("paramName", "usage");
		
		Map<String,Object> models = new HashMap<String,Object>();
		models.put("paramName", "usage_models");	
		//TODO:dependencies lineageUsage solven
		models.put("usage_model_ids", getModelIds());
		usage.put("models", models);
		
		Map<String,Object> mod_ds_relations = new HashMap<String,Object>();
		mod_ds_relations.put("paramName", "mod_ds_relations");
		mod_ds_relations.putAll(getModDSRelations());
		
		usage.put("mod_ds_relations", mod_ds_relations);
		return usage;
	}
	 
	@SuppressWarnings("static-access")
	/**
	 * Method to get usage sources.
	 * 
	 * @param mappingIdsUuids - mapping of internal used ids 2 uuids
	 * @param uuid - id of the data set to get the parent for
	 * @param allData - contains all previously processed information
	 * @return Map<String,Object> with usage sources
	 */
	public Map<String, Object> getSources(Node allData, String uuid, Map<String, Object> mappingIdsUuids) {
		String[] uuidElems = uuid.split(":");
		String code = uuidElems[uuidElems.length-1];
		
		if (uuidElems.length == 1) {
			if (RequestControlling.getMode().contains("tud.metaviz.connection.csw.CSWConnection"))
				code = CSWConnection.getInstance().getURN(uuid)[0];
    		else if (RequestControlling.getMode().contains("tud.metaviz.connection.file.FileConnection"))
    			code = FileConnection.getInstance().getURN(uuid)[0];			
		}
		
		Map<String, Object> usSourceList = new HashMap<String, Object>();
		String xPathSourceID = "//gmd:MD_Metadata[gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:processStep/gmi:LE_ProcessStep/gmd:source/gmd:LI_Source/gmd:sourceCitation/gmd:CI_Citation/gmd:identifier/gmd:RS_Identifier/gmd:code/gco:CharacterString='" + code + "']";
        
		//TODO: compare CodeSpaces of result and ...
		
		NodeList usageSources = (NodeList) xpe.getXPathResult(xPathSourceID, new NodeSet(), allData.getChildNodes());       
        
        for (int i = 0; i < usageSources.getLength(); i++) {
			String id = (String) xpe.getXPathResult(Constants.xPathId, new String(), usageSources.item(i).getChildNodes());
			String parent = (String) xpe.getXPathResult(Constants.xPathParentShort, new String(), usageSources.item(i).getChildNodes());
						
			if (parent == "") {
				usSourceList.put(id, (Map<String, Object>) EvaluatingCommon.getBaseDetailsTo(id, id, "usage"));//.get(id));
				 
				mappingIdsUuids.put("usage_dataset_"+usage_ds_stored, id);
				mappingUuidsIds.put(id, "usage_dataset_"+usage_ds_stored);
				usage_ds_stored ++;
	
				//this method is not used in JDBCConnection mode
				if (RequestControlling.getMode().contains("tud.metaviz.connection.csw.CSWConnection")) 	
					setModels(CSWConnection.getInstance().doRecordRequest(id).getChildNodes(), id, mappingIdsUuids);
				if (RequestControlling.getMode().contains("tud.metaviz.connection.file.FileConnection")) 	
					setModels(FileConnection.getInstance().doRecordRequest(id).getChildNodes(), id, mappingIdsUuids);
			}
		} 
		return usSourceList;
	}   
	 
	/**
	 * Method to parse and set model information.
	 * 
	 * @param resultNode - metadata xml as node
	 * @param dsId - id of dataset
	 * @param mappingIdsUuids - mapping of internal used ids 2 uuids
	 * @return model information with input and output of the model
	 */
	public Map<String, Object> setModels(NodeList resultNode, String dsId, Map<String, Object> mappingIdsUuids) {
		
        NodeList processSteps = (NodeList) xpe.getXPathResult(Constants.xPathProcessSteps, new NodeSet(), resultNode);
        String[] modelIds = new String[processSteps.getLength()];
		
        for (int i = 0; i < processSteps.getLength(); i++) {
        	Map<String, Object> model = new HashMap<String, Object>();
        	model.put("paramName", "usage_model_"+j);
        	
        	model.put("title", (String) xpe.getXPathResult(Constants.xPathPRIdentifier, new String(), resultNode));
        	model.put("description", (String) xpe.getXPathResult(Constants.xPathPSDescription, new String(), processSteps.item(i).getChildNodes()));
        	model.put("dateTime", (String) xpe.getXPathResult(Constants.xPathPSDateTime, new String(), processSteps.item(i).getChildNodes()));
        	model.put("organisation", (String) xpe.getXPathResult(Constants.xPathPSProcessorOrganisation, new String(), resultNode));
        	model.put("type", "usage");
        	model.put("info", ""); 
        	String[] ds = new String[1];
        	ds[0] = dsId;
        	model.put("output_datasets", ds);
        	model.put("input_datasets", dsId);
        	
        	for (int k=0; k<j; k++) {
        		@SuppressWarnings("unchecked")
				Map<String, Object> m = (Map<String, Object>) models.get("usage_model_"+k);
        		if (m.get("title").equals(model.get("title")) 
        			&& m.get("description").equals(model.get("description"))
        			&& m.get("dateTime").equals(model.get("dateTime"))
        			&& m.get("organisation").equals(model.get("organisation"))) {
        			
        			String[] output_ds = (String[]) m.get("output_datasets");
        			String[] output_ds_new = new String[output_ds.length+1];
        			for (int n = 0; n < output_ds.length; n++) output_ds_new[n] = output_ds[n];
        			output_ds_new[output_ds.length] = dsId;
        			m.remove("output_datasets");
        			m.put("output_datasets", output_ds_new);
        			
        		} else {
        			models.put("usage_model_"+j, model);
        			modelIds[i] = (String) models.get("paramName");       	
                	mappingIdsUuids.put("usage_model_"+j, (String) model.get("paramName")); 
                	j++;
        		} 
        	}
        	 
        	if (j == 0) {
        		models.put("usage_model_"+j, model);
    			modelIds[i] = (String) models.get("paramName");       	
            	mappingIdsUuids.put("usage_model_"+j, (String) model.get("paramName")); 
            	j++;
        	}	
        } 
		return models;
	}
	
	/**
	 * Method to get models.
	 * 
	 * @return models
	 */
	public Map<String, Object> getModels() {
		return models;
	}
	
	/**
	 * Method to get model ids.
	 * 
	 * @return model ids
	 */
	public String[] getModelIds() {
		String[] modelIds = new String[j];
		for (int i = 0; i < j; i++) 
			modelIds[i] = "usage_model_"+i;
		return modelIds;
	}
	
	/**
	 * Method to get model - data set relations.
	 * 
	 * @return relations
	 */
	public Map<String, Object> getModDSRelations() {
		Map<String, Object> modDSRelations = new HashMap<String, Object>();
		for (int i = 0; i < j; i++) {
			@SuppressWarnings("unchecked")
			String[] ds = (String[]) ((Map<String,Object>) models.get("usage_model_"+i)).get("output_datasets");			
			String[] ds_reverse = new String[ds.length];
			
			for (int k = 0; k < ds.length; k++) 
				ds_reverse[k] = (String) mappingUuidsIds.get(ds[k]);  
	 
			modDSRelations.put("usage_model_"+i, ds_reverse);
		}
		return modDSRelations;
	}
}
