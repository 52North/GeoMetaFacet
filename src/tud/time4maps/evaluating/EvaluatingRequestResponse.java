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

package tud.time4maps.evaluating;

import java.util.HashMap; 
import java.util.Map; 

import org.apache.xpath.NodeSet;
import org.w3c.dom.Document; 
import org.w3c.dom.NodeList;

import tud.geometafacet.xpath.EvaluatingXPath;
import tud.time4maps.help.SplitTimeParams;   
import tud.time4maps.objects.CapabilityParams;
  
/**
 * This class parses capabilities documents via xpath expressions. 
 * @see EvaluatingXPath
 * 
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */ 
public class EvaluatingRequestResponse {  
    
	static EvaluatingXPath exp = new EvaluatingXPath(); 
	static SplitTimeParams stp = new SplitTimeParams();
	  
	//service params
	private static String xpServiceName = "//Service/Name/text()";
	private static String xpServiceTitle = "//Service/Title/text()";
	private static String xpServiceAbstract = "//Service/Abstract/text()";
	 
	private static String xpServiceFormat = "//Capability/Request/GetMap/Format/text()";
	private static String xpServiceCRS = "//Capability/Layer/CRS/text()";
	private static String xpServiceSRS = "//Capability/Layer/SRS/text()";
	
	//layer params
	private static String xpLayerTitle = "//Capability/Layer/Title/text()";
	private static String xpLayerName = "//Capability/Layer/Name/text()";
	private static String xpLayerAbstract = "//Capability/Layer/Abstract/text()";
	
	//gets deepest layer elem (which has no childs of type layer)
	private static String xpNestedLayerTitle = "//Layer[not(./Layer)]/Title/text()"; 
	private static String xpNestedLayerName = "//Layer[not(./Layer)]/Name/text()";
	private static String xpNestedLayerAbstract = "//Layer[not(./Layer)]/Abstract/text()";
	 
	/**
	 * This method parses xml capabilities document and returns a map of all necessary params.
	 * 
	 * @param doc - the capabilities document of the wms
	 * @param capParams - the capability param object for the wms
	 * @return a map with all params, that are needed in website
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> parseResponse(Document doc, CapabilityParams capParams) {
	  
		Map<String, Object> allData = new HashMap<String, Object>();
		Map<String, Object> layer = new HashMap<String, Object>();
		
		NodeList nl = doc.getChildNodes();	  
		if (capParams.getLayers() == null) layer.put("description", parseOneLayerDescription(nl));
		else layer.put("description", parseSpecificLayerDescription(nl, capParams.getLayers()));
		
		layer.put("paramName", "layerParam");  
		layer.put("legend", parseLegendParams(nl, (String[]) ((Map<String, Object>)layer.get("description")).get("name"))); 
        layer.put("time", parseTimeParams(nl, capParams.getVersion(), ((String[]) ((Map<String, Object>)layer.get("description")).get("name"))));
                
		allData.put("serviceDescription", parseServiceDescription(nl, capParams));
		allData.putAll(layer);
		
		return allData;
	}
	
	/**
	 * This method parses general WMS information and returns a map with these params.
	 * 
	 * @param nl - a part of the capabilities response in NodeList format
	 * @param capParams - the capabilities object
	 * @return a map with all service params, that are needed in website
	 */
	public static Map<String, Object> parseServiceDescription(NodeList nl, CapabilityParams capParams) {
		
		String serviceName = (String) exp.getXPathResult(xpServiceName, new String(), nl); 
		String serviceTitle = (String) exp.getXPathResult(xpServiceTitle, new String(), nl); 		
		String serviceAbstract = (String) exp.getXPathResult(xpServiceAbstract, new String(), nl); 

		String serviceFormat = (String) exp.getXPathResult(xpServiceFormat, new String(), nl); 		
		
		NodeList serviceFormats = (NodeList) exp.getXPathResult(xpServiceFormat, new NodeSet(), nl);
		for (int i =0; i < serviceFormats.getLength(); i++) {
			if (serviceFormats.item(i).getTextContent().equals("image/png")) {
				serviceFormat = serviceFormats.item(i).getTextContent(); 
			}
		}
		
		String serviceSRSCRS;
		if (capParams.getVersion().equals("1.3.0")) 
			serviceSRSCRS = (String) exp.getXPathResult(xpServiceCRS, new String(), nl);
		else 
			serviceSRSCRS = (String) exp.getXPathResult(xpServiceSRS, new String(), nl);
		
		//avoiding problems with geoserver responses
		if (serviceSRSCRS.equals("AUTO:42001")) serviceSRSCRS = "EPSG:4326";
		
		Map<String, Object> service = new HashMap<String, Object>();
		service.put("paramName", "serviceDescriptionParam");
		service.put("name", serviceName);
		service.put("title", serviceTitle);
		service.put("abstractText", serviceAbstract);
		
		service.put("format", serviceFormat);
		service.put("srs", serviceSRSCRS);
		
		service.put("version",capParams.getVersion());
		service.put("url", capParams.getUrl());
		
		return service;
	}
	 
	/**
	 * This method parses capabilities document and returns a map with layer params for all layers.
	 * 
	 * @param nl - a part of the capabilities response in NodeList format
	 * @return a map with all wms params, that are needed in website
	 */
	public static Map<String, Object> parseOneLayerDescription(NodeList nl) {	
		
		//first: try nested request ...
		String layerTitle = (String) exp.getXPathResult(xpNestedLayerTitle, new String(), nl); 
		String layerName = (String) exp.getXPathResult(xpNestedLayerName, new String(), nl); 
		String layerAbstract = (String) exp.getXPathResult(xpNestedLayerAbstract, new String(), nl); 
		
		//if results are empty try getting layer on first hierarchy level	
		if (layerName == "" && layerTitle == "") { 
			layerTitle = (String) exp.getXPathResult(xpLayerTitle, new String(), nl); 
			layerName = (String) exp.getXPathResult(xpLayerName, new String(), nl); 
			layerAbstract = (String) exp.getXPathResult(xpLayerAbstract, new String(), nl); 	
		}  
		
		Map<String, Object> layer = new HashMap<String, Object>();  
		layer.put("paramName", "layerDescriptionParam");
		layer.put("name", new String[] { layerName });
		layer.put("title", layerTitle);
		layer.put("abstractText", layerAbstract);
		 
		return layer;
	}
	 
	/**
	 * This method parses capabilities document and returns a map with layer params for a specific layer.
	 * * 
	 * @param nl - a part of the capabilities response in NodeList format
	 * @param layerNames - an array with layer names, that should be displayed in the map
	 * @return a map with all information for the layer
	 */
	public static Map<String, Object> parseSpecificLayerDescription(NodeList nl, String[] layerNames) {
 
		String[] layerTitles = new String[layerNames.length];
		
		for (int i=0; i < layerNames.length; i++) {
			String xpSpecLayerTitle = "//Layer[./Name='"+ layerNames[i] + "']/Title/text()";
			layerTitles[i] = (String) exp.getXPathResult(xpSpecLayerTitle, new String(), nl); 	
		}
		
		//String xpSpecLayerTitle = "//Layer[./Name='"+ layerNames[0] + "']/Title/text()";
		//String layerTitle = (String) exp.getXPathResult(xpSpecLayerTitle, new String(), nl); 
		
		String xpSpecLayerAbstract = "//Layer[./Name='"+ layerNames[0] + "']/Abstract/text()";
		String layerAbstract = (String) exp.getXPathResult(xpSpecLayerAbstract, new String(), nl); 
		
		Map<String, Object> layer = new HashMap<String, Object>(); 
		layer.put("paramName", "layerDescriptionParam");
		layer.put("name", layerNames);
		//layer.put("title", layerTitle);
		layer.put("title", layerTitles);
		layer.put("abstractText", layerAbstract);
		 
		return layer;
	}
	 
	/**
	 * This method parses capabilities document and returns a map with all temporal params.
	 * 
	 * @param nl - a part of the capabilities response in NodeList format 
	 * @param version - version of the wms
	 * @param layerName_ - an array with all layer names
	 * @return a map with all temporal information
	 */
	public static Map<String, Object> parseTimeParams(NodeList nl, String version, String[] layerName_) { 
		String timeTag;
		if (version.equals("1.3.0")) timeTag = "Dimension";
		else timeTag = "Extent"; 
                
        String[] layerDimension_ = new String[layerName_.length];
        String[] defaultTime_ = new String[layerName_.length];
        
        for (int i=0; i< layerName_.length; i++) {
            String xpLayerDimension_ = "//Layer[./Name='"+ layerName_[i] + "']/"+timeTag+"/text()";
            layerDimension_[i] = (String) exp.getXPathResult(xpLayerDimension_, new String(), nl);
            layerDimension_[i] = layerDimension_[i].trim();	
            
            String xpLayerDimensionDefault_ = "//Layer[./Name='"+ layerName_[i] + "']/"+timeTag;
            NodeList layerDimNodes_ = (NodeList) exp.getXPathResult(xpLayerDimensionDefault_, new NodeSet(), nl);
            
            defaultTime_[i] = "";
            if (layerDimNodes_.item(0) != null && layerDimNodes_.item(0).getAttributes().getNamedItem("default") != null) 
            	defaultTime_[i] = layerDimNodes_.item(0).getAttributes().getNamedItem("default").getNodeValue();
            defaultTime_[i] = defaultTime_[i].trim();
        }

        return stp.splitDimension_(layerDimension_, defaultTime_);
	}
	
	/**
	 * This method parses capabilities document and returns a map with legend params.
	 * 
	 * @param nl - a part of the capabilities response in NodeList format 
	 * @param layerNames - an array with all layer names
	 * @return a map with all temporal information
	 */
	public static Map<String, Object> parseLegendParams(NodeList nl, String[] layerNames) {
		String[] legendURLs = new String[layerNames.length];
		Map<String, Object> legend = new HashMap<String, Object>();
		legend.put("paramName", "legendParam"); //neu
                
        //Hannes 20.02.2013
		String[] width_ = new String[layerNames.length];
		String[] height_ = new String[layerNames.length];
		String[] format_ = new String[layerNames.length];
		
		for (int i=0; i < layerNames.length; i++) {
			String xpLayerLegend = "//Layer[./Name='"+ layerNames[i] + "']/Style/LegendURL/OnlineResource"; 
			NodeList legendURLNodes = (NodeList) exp.getXPathResult(xpLayerLegend, new NodeSet(), nl);
			if (legendURLNodes != null && legendURLNodes.item(0) != null)
				legendURLs[i] = legendURLNodes.item(0).getAttributes().getNamedItem("xlink:href").getNodeValue();
			else break;
                         
			String xpLayerLegendBounds_ = "//Layer[./Name='"+ layerNames[i] + "']/Style/LegendURL"; 
         	NodeList legendFormatNodes_ = (NodeList) exp.getXPathResult(xpLayerLegendBounds_, new NodeSet() , nl);
                        
        	if (legendFormatNodes_ != null && legendFormatNodes_.item(0) != null) {
        		width_[i] = legendFormatNodes_.item(0).getAttributes().getNamedItem("width").getNodeValue();
        		height_[i] = legendFormatNodes_.item(0).getAttributes().getNamedItem("height").getNodeValue();
                        
        		String  xpLayerLegendFormat_ = "//Layer[./Name='"+ layerNames[0] + "']/Style/LegendURL/Format/text()";
              	format_[i] = (String) exp.getXPathResult(xpLayerLegendFormat_, new String(), nl);
            } else {
            	width_[i] = "";
                height_[i] = "";
                format_[i] = "";
              	legendURLs[i] = "";
           	}
                        
            legend.put("height", height_);
            legend.put("width", width_);
          	legend.put("format", format_);
            legend.put("url", legendURLs);
		}
		return legend;
	}
	
	/**
	 * This method parses capabilities document and returns a map with legend params.
	 * 
	 * @param nl
	 * @return
	 */
	public static Map<String, Object> getLayerList(NodeList nl) {
		//first: try nested request ...
		NodeList layerTitle = (NodeList) exp.getXPathResult(xpNestedLayerTitle, new NodeSet(), nl); 
		NodeList layerName = (NodeList) exp.getXPathResult(xpNestedLayerName, new NodeSet(), nl); 
		@SuppressWarnings("unused")
		NodeList layerAbstract = (NodeList) exp.getXPathResult(xpNestedLayerAbstract, new NodeSet(), nl); 
		
		//if results are empty try getting layer on first hierarchy level	
		if (layerName == null && layerTitle == null) { //TODO: optimization of if/else 
			layerTitle = (NodeList) exp.getXPathResult(xpLayerTitle, new NodeSet(), nl); 
			layerName = (NodeList) exp.getXPathResult(xpLayerName, new NodeSet(), nl); 
			layerAbstract = (NodeList) exp.getXPathResult(xpLayerAbstract, new NodeSet(), nl);  
		}   
		
		Map <String,Object> layers = new HashMap<String,Object>();
		layers.put("paramName", "layers");
		layers.put("number", layerTitle.getLength());
		for (int i = 0; i < layerTitle.getLength(); i++) {
			Map <String,Object> layer = new HashMap<String,Object>();
			layer.put("paramName", "layer_"+i);
			layer.put("name", layerName.item(i).getTextContent());
			 
			String title = layerTitle.item(i).getTextContent(); 
			
			title = title.replace("<![CDATA[","");
			layer.put("title", title); 
			layers.put("layer_"+i, layer);
		}	 
		return layers;
	}

	public static String parseFeatureInfoResponse(Document doc) {
		String html_response = "<table>";
		
		NodeList element_list = doc.getElementsByTagName("*");
		for (int i = 0; i < element_list.getLength(); i++) {
			if (element_list.item(i).getNodeName().contains("style")) {
				
			} else {
				if (element_list.item(i).getChildNodes().getLength() < 2) { 
					html_response += "<tr>";
					html_response += "<td>";
					html_response += element_list.item(i).getNodeName();
					html_response += "</td>";
					html_response += "<td>";
					html_response += element_list.item(i).getTextContent().trim();
					html_response += "</td>";
					html_response += "</tr>";
				}
			}
		}
		
		html_response += "</table>";
		return html_response;	 
	}
	
	public static String trimHTML(String html_response) {  
		html_response = html_response.split("<body>")[1];
		html_response = html_response.split("</body>")[0]; 
		html_response = html_response.replace("<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\">", "<table>");		
		html_response = html_response.replace("\'", " "); 
		html_response = html_response.replace("\"", " "); 
		html_response = html_response.replace("\n", "");
		html_response = html_response.replace("\r", ""); 
		html_response = html_response.trim(); 
		return html_response;
	}
}
