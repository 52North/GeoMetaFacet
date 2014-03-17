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

package tud.time4maps.controlling;
 
import org.w3c.dom.Document;

import tud.geometafacet.json.JsonObjectBuilder;
import tud.time4maps.evaluating.EvaluatingRequestResponse; 
import tud.time4maps.objects.CapabilityParams; 
import tud.time4maps.request.CapabilitiesRequest;
 
/**
 * This class handles, distributes and organizes all requests form the JSP sites.
 * It provides methods to return json object of needed wms descriptions as well as 
 * methods to return layer information as json objects.
 * 
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 *
 */
public class RequestControlling {  
	    
	static String serviceLabel  = "SERVICE=";
	static String wms			= "WMS"; 
	static String requestLabel  = "REQUEST=";
	static String getCap 		= "GetCapabilities";
	static String versionLabel 	= "VERSION=";   
	 
	CapabilitiesRequest capRequest = new CapabilitiesRequest();  
	EvaluatingRequestResponse evalRequestResponse = new EvaluatingRequestResponse();
	 
	/**
	 * This method creates a JSON object based on incoming WMS params.
	 * 
	 * @param wmsUrl - the url of the wms (with or without request params)
	 * @param version - the version of the wms, if available
	 * @param layers - the list of comma-separated layers that should be displayed on the map, if available
	 * @return a json object that can be used to fill the website and contains all descriptions of WMS and layers
	 */
	@SuppressWarnings("static-access")
	public String initialize(String wmsUrl, String version, String layers) { 
		if (wmsUrl.contains("?")) { 
			wmsUrl = wmsUrl.substring(0, wmsUrl.indexOf("?"));
		}
		
		try {		
			CapabilityParams capParams;
			if (layers != null && layers != "")	{//layers are set 
				capParams = new CapabilityParams(wmsUrl, version, layers.split(",")); 				
			} else {								//layers are not set 
				capParams = new CapabilityParams(wmsUrl, version);
			}
			
			String url = "";
		
			if (capParams.getUrl() != null) {
				if (capParams.getUrl().contains("?")) { //don't add additional ?
					url = capParams.getUrl().substring(0, capParams.getUrl().indexOf("?"));
					url +=
						//url = capParams.getUrl() + "&" +  //but add & ... and all params
						"?" + serviceLabel + wms + "&" + 
						requestLabel + getCap + "&" + 
						versionLabel + capParams.getVersion();
				} else 	
					url = capParams.getUrl() + "?" + //adding ? to url ... and all params
						serviceLabel + wms + "&" + 
						requestLabel + getCap + "&" + 
						versionLabel + capParams.getVersion();
				 
				Document doc = capRequest.doRequest(url); 
				JsonObjectBuilder job = new JsonObjectBuilder();

				return (String) job.buildLayer(evalRequestResponse.parseResponse(doc, capParams), "string");
				//for using an object try this ...
				//JsonContainer jcoObj = (JsonContainer) job.buildLayer(evalRequestResponse.parseResponse(doc, capParams), "jsoncontainer");
			 
			}  	
		} catch (Exception e) { e.printStackTrace(); }	
		return null; 		
	}	
	
	/**
	 * This method is used to request WMS and analyze available layer information.
	 * If the parameterized call doesn't contain layer names, this method is used to 
	 * generate a layer chooser.
	 * 
	 * @param url - the url of the WMS
	 * @param version - the version of the WMS
	 * @return an array of all available layers
	 */
	@SuppressWarnings("static-access")
	public String getLayers(String url, String version) {
		Document doc;
		try { 
			if (url.contains("?")) { 
				url = url.substring(0, url.indexOf("?"));
			}
			
			url += "?" + serviceLabel + wms + "&" + 
			requestLabel + getCap + "&" + 
			versionLabel + version;

			if (version == "") url += "1.1.1"; 
			
			doc = capRequest.doRequest(url); 
			return (String) JsonObjectBuilder.buildLayer(evalRequestResponse.getLayerList(doc.getChildNodes()), "string");
		} catch (Exception e) { e.printStackTrace(); }
		return null;
	} 
	
	@SuppressWarnings("static-access")
	public String initializeFeatureInfo(String wmsUrl, String version, String layers, String srs, String bbox, String width, String height, String i, String j, String time) { 
		String response = "";
		String url = wmsUrl;
		
		if (wmsUrl.contains("?")) { 
			url = url.substring(0, url.indexOf("?")) + "?";			
		} else url += "?";
				
		url += "service=WMS&request=GetFeatureInfo";
		url += "&version=" + version;
		url += "&query_layers=" + layers;	
		
		if (version.equals("1.3.0")) {	
			url += "&I=" + i;
			url += "&J=" + j;
		} else {
			url += "&X=" + i;
			url += "&Y=" + j;
		}
		
		url += "&bbox=" + bbox;
		url += "&height=" + height;
		url += "&width=" + width;

		if (version.equals("1.3.0")) url += "&crs=" + srs;
		else url += "&srs=" + srs;
		
		if (!time.contains("x")) url += "&time=" + time;		
		String url_html = url + "&info_format=text/html";
		
		try {  
			String full_response = capRequest.getResponseString(url_html);
			response = evalRequestResponse.trimHTML(full_response);  
		} catch (Exception e) {  
			String url_xml = url + "&info_format=text/xml";
			try { 
				Document doc = capRequest.doRequest(url_xml);		
				response = evalRequestResponse.parseFeatureInfoResponse(doc); 
				if (response.contains("Exception")) { 
					String extended_url = url + "&info_format=text/plain" + "&layers=" + layers;
					response = "<table><tr><td>" + capRequest.doRequest_Plain(extended_url) + "</td></tr></table>";		
					response = response.replaceAll("'", "");
					response = response.replaceAll("\n", "<br />"); 
				} else {
					//response = "There is no feature information"; 	
				}
			} catch (Exception e1) { 
				response = "There is no feature information"; 				
			} 
		} 		
		return response;
	}
}
