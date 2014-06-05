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

package tud.time4maps.help;
 
import tud.time4maps.objects.CapabilityParams;
    
/** 
 * This class is a helper class to split request params.
 *     
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 *    
 */
public class SplitRequestParams {
	
	private static String url = "url=";
	private static String version = "&version=";
	private static String layer = "&layer=";
	
	/**
	 * This method parses parameterized calls and splits wms url, version and layer information.
	 * 
	 * @param wmsUrl - url of the wms
	 * @return capability param object
	 */
	public CapabilityParams parseURL(String wmsUrl) {
		
		int urlIDX = wmsUrl.indexOf(url);
		int versionIDX = wmsUrl.indexOf(version);
		int layerIDX = wmsUrl.indexOf(layer);
		
		if (urlIDX == -1 && versionIDX == -1 && layerIDX == -1) {			 
			return null; //break			
		}
		
		//parse object due to given order
		if (urlIDX < versionIDX && versionIDX < layerIDX) {			
			String urlVal = wmsUrl.substring(urlIDX+4, versionIDX);
			String versionVal = wmsUrl.substring(versionIDX+9, layerIDX);
			String layerVal = wmsUrl.substring(layerIDX+7);
				
			CapabilityParams capParams = new CapabilityParams(urlVal, versionVal, parseLayers(layerVal));
			return capParams;			
		} else {
			if (layerIDX == -1) {
				
				String urlVal = wmsUrl.substring(urlIDX+4, versionIDX);
				String versionVal = wmsUrl.substring(versionIDX+9);
				
				CapabilityParams capParams = new CapabilityParams(urlVal, versionVal); 
				return capParams;
			} else {
				//TODO: catch this case
				return null;
			}
		}		
	}
	
	/**
	 * This method splits a comma separated list of layer names and returns an array of these names.
	 * 
	 * @param layerNames - a string with comma separated layer names
	 * @return an array, that contains all layer names
	 */
	public String[] parseLayers(String layerNames) { 
		return layerNames.split(",");
	}
}
