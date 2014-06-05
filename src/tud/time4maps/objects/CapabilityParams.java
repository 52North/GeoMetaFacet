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

package tud.time4maps.objects;
   
/** 
 * This class helps to store capability params.
 *   
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 *       
 */ 
public class CapabilityParams {  
 
	String url; 			//url of wms without ending getcap., e.g. "http://141.30.100.162:8080/ncWMS/wms?"
	String version;			//version of service, e.g. "1.1.1"
	String[] layers;		//titles of layer, which should be displayed, e.g. "Total Cloud Fraction" ... given via parameterized call of t4m

	/**
	 * Constructor - used when layer names are set by user
	 * 
	 * @param url - url of wms
	 * @param version - version of wms
	 * @param layers - layer, that should be displayed in the map
	 */
	public CapabilityParams(String url, String version, String[] layers) {
		this.url = url;
		this.version = version;
		this.layers = layers;
	}
	
	/**
	 * Constructor - used when layer names are not set
	 * 
	 * @param url - url of wms
	 * @param version - version of wms 
	 */
	public CapabilityParams(String url, String version) {
		this.url = url; 
		this.version = version;
	}

	/* generated getter and setter */
	
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String[] getLayers() {
		return layers;
	}

	public void setLayer(String[] layers) {
		this.layers = layers;
	}
	
}
