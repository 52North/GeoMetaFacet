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

import tud.geometafacet.xpath.EvaluatingXPath;
import tud.geometafacet.helper.Constants;

/**
 * 
 * This class handles lineage parsing and JSON build of the parsed information.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 * 
 */
public class EvaluatingLineage {
	 
	EvaluatingXPath xpe = new EvaluatingXPath(); 
	 
	/**
	 * Method to parses lineage (process step and statement).
	 * 
	 * @param resultNode - xml metadata as node
	 * @return Map<String,Object> with lineage information
	 */
	public Map<String, Object> getLineage(NodeList resultNode) { 
		Map<String, Object> lineage = new HashMap<String, Object>();
		lineage.put("paramName", "lineage_detail");
		lineage.put("process_steps", getProcessSteps(resultNode)); 
		lineage.put("statement", getStatement(resultNode));   
		return lineage;
	}
	 
	/**
	 * This method parses lineage statement.
	 * 
	 * @param resultNode - xml metadata as node
	 * @return Map<String,Object> with statement
	 */
	public Map<String, Object> getStatement(NodeList resultNode) {
		Map<String, Object> statement = new HashMap<String, Object>();
		statement.put("paramName", "statement");
		statement.put("description", (String) xpe.getXPathResult(Constants.xPathStatement2, new String(), resultNode));
    	return statement; 
	}
	
	/**
	 * This method parses process step (step, rationale, date, processor).
	 * 
	 * @param resultNode - xml metadata as node
	 * @return Map<String,Object> with process step information
	 */
	public Map<String, Object> getProcessSteps(NodeList resultNode) {
		Map<String, Object> pSteps = new HashMap<String, Object>();
		pSteps.put("paramName", "process_steps");
		
        NodeList processSteps = (NodeList) xpe.getXPathResult(Constants.xPathProcessSteps, new NodeSet(), resultNode);
        for (int i = 0; i < processSteps.getLength(); i++) {
        	Map<String, Object> pStep = new HashMap<String, Object>();
        	pStep.put("paramName", "process_step_"+i);
        	pStep.put("description", (String) xpe.getXPathResult(Constants.xPathPSDescription2, new String(), processSteps.item(i).getChildNodes()));
        	pStep.put("dateTime", (String) xpe.getXPathResult(Constants.xPathPSDateTime, new String(), processSteps.item(i).getChildNodes()));
        	pStep.put("rationale", (String) xpe.getXPathResult(Constants.xPathPSRationale, new String(), processSteps.item(i).getChildNodes()));
        	pStep.put("processor", (String) xpe.getXPathResult(Constants.xPathPSProcessorOrganisation, new String(), resultNode));

        	Map<String, Object> processingList = new HashMap<String, Object>();
        	processingList.put("paramName", "processingList");
        	
        	NodeList processingInfos = (NodeList) xpe.getXPathResult(Constants.xPathPInfos, new NodeSet(), resultNode);
        	for (int k = 0; k < processingInfos.getLength(); k++) {
        		Map<String, Object> processing = new HashMap<String, Object>();
        		processing.put("paramName", "processing_"+k);
        		processing.put("identifier", (String) xpe.getXPathResult(Constants.xPathPIdentifier, new String(), processingInfos.item(k).getChildNodes()));
        		processing.put("runTimeParams", (String) xpe.getXPathResult(Constants.xPathPRuntimeParams, new String(), processingInfos.item(k).getChildNodes()));
        		//processing.put("description", (String) xpe.getXPathResult(Constants.xPathPDescription, new String(), processingInfos.item(k).getChildNodes()));

        		NodeList pISWReferences = (NodeList) xpe.getXPathResult(Constants.xPathPSWReference, new NodeSet(), processingInfos.item(k).getChildNodes());
        		NodeList pIDocumentation = (NodeList) xpe.getXPathResult(Constants.xPathDocumentation, new NodeSet(), processingInfos.item(k).getChildNodes());

				Map<String, Object> swRefs = new HashMap<String, Object>();
				swRefs.put("paramName", "sw_refs_"+k);
				for (int j = 0; j < pISWReferences.getLength(); j++) {
					swRefs.put("sw_ref_"+j, getCitation(pISWReferences.item(j).getChildNodes(), "sw_ref_"+j));
				} 
				processing.put("sw_refs", swRefs);
				
				Map<String, Object> docs = new HashMap<String, Object>();
				docs.put("paramName", "docs_"+k);
				
				for (int j = 0; j < pIDocumentation.getLength(); j++) { 
					docs.put("doc_"+j, getCitation(pIDocumentation.item(j).getChildNodes(), "doc_"+j));//.put("paramName", "doc_"+j));
				}
				docs.put("size", pIDocumentation.getLength());
				processing.put("docs", docs);
				processingList.put("processing_"+k, processing);
        	}
        	pStep.put("processing_list", processingList);
        	pSteps.put("process_step_"+i, pStep); 
        }
		return pSteps;
	}
	 
	/**
	 * This method parses citation information (title, alternate title, date, ...)
	 * 
	 * @param nodes - xml metadata as node
	 * @param art - param name
	 * @return Map<String,Object> with citation information
	 */
	public Map<String, Object> getCitation(NodeList nodes, String art) {
	    Map<String, Object> citation = new HashMap<String, Object>();
	    citation.put("paramName", art); 
	    citation.put("title", (String) xpe.getXPathResult(Constants.xPathCiTitle, new String(), nodes));
	    citation.put("alternateTitle", (String) xpe.getXPathResult(Constants.xPathCiAltTitle, new String(), nodes));
	    citation.put("date", (String) xpe.getXPathResult(Constants.xPathCiDate, new String(), nodes));
	    citation.put("id", (String) xpe.getXPathResult(Constants.xPathCiIdentifier, new String(), nodes));
	    citation.put("others", (String) xpe.getXPathResult(Constants.xPathCiOtherDetails, new String(), nodes));
	    return citation;
	} 
}
