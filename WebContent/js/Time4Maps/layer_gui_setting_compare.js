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

/**
 * This method sets the layer names as title of the application
 */
function initializeLayerGuiFilling() { 
  var layer;    
  wmsDescription_Store.fetchItemByIdentity({ identity: "layerDescriptionParam", onItem: function(item, request) { layer = item; }});                                
  var layer2;   
  wmsDescription_Store2.fetchItemByIdentity({ identity: "layerDescriptionParam", onItem: function(item, request) { layer2 = item; }});                                
  dojo.byId('description_wms_title').innerHTML = layer.title[0];
  dojo.byId('description_wms_title2').innerHTML = layer2.title[0];
  var serviceData;
  wmsDescription_Store2.fetchItemByIdentity({ identity: "serviceDescriptionParam", onItem: function(item, request) { serviceData = item; }});
  new dijit.Tooltip({
	    connectId: ["description_wms_title2"],
	    label: '<div class="tooltip">Abstract of this service: '+serviceData.abstractText+'</div>'
  }); 
}