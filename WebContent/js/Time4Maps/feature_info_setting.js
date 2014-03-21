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

var markers;  
var service_url, service_version, service_srs;

/**
 * This method is used to register an event listener that sets the marker on the map, when the user has clicked into the map.
 * Further, the feature info response is initialized and embedded.
 * 
 * @param time_info - string param that is set to "time", if the service is time enabled and empty if not.
 */
var infoControls;
function bindFeatureControls(time_info) {
	//getting general information of web service
	var service_JSON;
	wmsDescription_Store.fetchItemByIdentity({
		identity : "serviceDescriptionParam",
		onItem : function(item, request) {
			service_JSON = item;
		} 
	}); 
	service_url = wmsDescription_Store.getValue(service_JSON, "url");
	service_version = wmsDescription_Store
			.getValue(service_JSON, "version");
	service_srs = wmsDescription_Store.getValue(service_JSON, "srs");
	
	//decide which time gui should be loaded
	//and which listener should be added to request feature info 
	//(with time changes -> calling time gui methods, or without)

	if (time_info == "time" && combo == false) { //with time -> TIME SLIDER
		infoControls = { click : new OpenLayers.Control.WMSGetFeatureInfo({
			url : service_url, 
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',
			layers : [ layer_Array[vis_layer_number].params.LAYERS ],
			//layers : [ layer_Array[vis_layer_number].name ],
			queryVisible : true,
			vendorParams : {
				time : cutDate(dijit.byId('time_slider').get('value'))
			}, 
			//register an event lister for clicks on the map
			eventListeners : {
				beforegetfeatureinfo : function(event) {
					last_event = event;
					
					//add time information to the OpenLayers map params
					this.vendorParams = {
						time : cutDate(dijit.byId('time_slider').get('value'))
					};
					
					//add a marker and destroy old one, if there is one
					if (markers != null) { 
						markers.clearMarkers();
					} else {
						markers = new OpenLayers.Layer.Markers( "Markers");
						map.addLayer(markers);
					}
					var size = new OpenLayers.Size(21, 25);
					var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size, offset);
					markers.addMarker(new OpenLayers.Marker(map.getLonLatFromPixel(event.xy), icon));
                                        
					//fill feature info panel below the map
					dojo.byId("featureInfo_frame").src = "featureInfo.jsp?url="
						+ service_url + "?"
						+ "request=GetFeatureInfo&service=WMS"
						+ "&version=" + service_version
						
						+ "&query_layers=" + layer_Array[vis_layer_number].params.LAYERS
						//+ "&query_layers=" + layer_Array[vis_layer_number].name
						+ "&crs=" + service_srs
						+ "&bbox=" + map.getExtent().toBBOX()
						+ "&width=800&height=470"
						+ "&I=" + event.xy.x
						+ "&J=" + event.xy.y
						+ "&time=" + cutDate(dijit.byId('time_slider').get('value'));
					//SH
//					$.ajax({
//						"url" : 'FeatureInfoRequester',
//						"type" : 'GET',
//						"data" : {
//							"url" : service_url+"?request=GetFeatureInfo&service=WMS",
//							"query_layers" : layer_Array[vis_layer_number].params.LAYERS,
//							"crc" :service_srs,
//							"bbox" : map.getExtent().toBBOX(),
//							"width":  "800",
//							"height":  "470",
//							"I" : event.xy.x,
//							"J" : event.xy.y,
//							"time": cutDate(dijit.byId('time_slider').get('value')),
//						}, "success" : function(data,status) { 
//							dojo.byId('feature_label').innerHTML = data;
//							if (dojo.byId('feature_label').innerHTML == "") dojo.byId('feature_label').innerHTML = "Click on the map to get feature information.";
//						}
//					});
					
				},

				getfeatureinfo : function(event) {
					console.log("get feature info");
				}
			}})}; 	
	} else if (time_info == "time" && combo == true) { //with time -> COMBOBOX	
		infoControls = { click : new OpenLayers.Control.WMSGetFeatureInfo( {
			url : service_url,
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',
			
			layers : [ layer_Array[vis_layer_number].params.LAYERS ],
			//layers : [ layer_Array[vis_layer_number].name ],
			
			queryVisible : true,
			vendorParams : {
				time : dijit.byId('stateSelect').get('value')
			},
			eventListeners : {
				beforegetfeatureinfo : function(event) {
					last_event = event;
					this.vendorParams = {
						time : dijit.byId('stateSelect').get('value')
					};
					if (markers != null) { 
						markers.clearMarkers();
					} else {
						markers = new OpenLayers.Layer.Markers( "Markers");
						map.addLayer(markers);
					}
					var size = new OpenLayers.Size(21, 25);
					var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
					var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',
							size, offset);
					markers.addMarker(new OpenLayers.Marker(map.getLonLatFromPixel(event.xy), icon));
					dojo.byId("featureInfo_frame").src = "featureInfo.jsp?url="
						+ service_url + "?"
						+ "request=GetFeatureInfo&service=WMS"
						+ "&version=" + service_version
						
						+ "&query_layers=" + layer_Array[vis_layer_number].params.LAYERS
						//+ "&query_layers=" + layer_Array[vis_layer_number].name
						
						+ "&crs=" + service_srs
						+ "&bbox=" + map.getExtent().toBBOX()
						+ "&width=800&height=470"
						+ "&I=" + event.xy.x
						+ "&J=" + event.xy.y
						+ "&time=" + dijit.byId('stateSelect').get('value');
					//SH
//					$.ajax({
//						"url" : 'FeatureInfoRequester',
//						"type" : 'GET',
//						"data" : {
//							"url" : service_url+"?request=GetFeatureInfo&service=WMS",
//							"query_layers" : layer_Array[vis_layer_number].params.LAYERS,
//							"crc" :service_srs,
//							"bbox" : map.getExtent().toBBOX(),
//							"width":  "800",
//							"height":  "470",
//							"I" : event.xy.x,
//							"J" : event.xy.y,
//							"time": dijit.byId('stateSelect').get('value'),
//						}, "success" : function(data,status) { 
//							dojo.byId('feature_label').innerHTML = data;
//							if (dojo.byId('feature_label').innerHTML == "") dojo.byId('feature_label').innerHTML = "Click on the map to get feature information.";
//						}
//					});
				},
				getfeatureinfo : function(event) {
					console.log("get feature info");
				}}})}; 	
	} else { //without time
		infoControls = { click : new OpenLayers.Control.WMSGetFeatureInfo( {
			url : service_url, 
			infoFormat : 'text/xml',
			title : 'Identify features by clicking',

			layers : [ layer_Array[vis_layer_number].params.LAYERS ],
			//layers : [ layer_Array[vis_layer_number].name ],
			
			queryVisible : true,
			eventListeners : {
				beforegetfeatureinfo : function(event) {
					last_event = event;
					if (markers != null) { 
						markers.clearMarkers();
					} else {
						markers = new OpenLayers.Layer.Markers( "Markers");
						map.addLayer(markers);
					}
					var size = new OpenLayers.Size(21, 25);
					var offset = new OpenLayers.Pixel( -(size.w / 2), -size.h);
					var icon = new OpenLayers.Icon(
						'http://www.openlayers.org/dev/img/marker.png',
						size, offset);
					markers.addMarker(new OpenLayers.Marker(map.getLonLatFromPixel(event.xy), icon));
					dojo.byId("featureInfo_frame").src = "featureInfo.jsp?url="
						+ service_url + "?"
						+ "request=GetFeatureInfo&service=WMS"
						+ "&version=" + service_version
						
						+ "&query_layers=" + layer_Array[vis_layer_number].params.LAYERS
						//+ "&query_layers=" + layer_Array[vis_layer_number].name
						
						+ "&crs=" + service_srs
						+ "&bbox=" + map.getExtent().toBBOX()
						+ "&width=800&height=470"
						+ "&I=" + event.xy.x
						+ "&J=" + event.xy.y
						+ "&info_format=text/xml" + "&time=x";
					//SH
//					$.ajax({
//						"url" : 'FeatureInfoRequester',
//						"type" : 'GET',
//						"data" : {
//							"url" : service_url+"?request=GetFeatureInfo&service=WMS",
//							"query_layers" : layer_Array[vis_layer_number].params.LAYERS,
//							"crc" :service_srs,
//							"bbox" : map.getExtent().toBBOX(),
//							"width":  "800",
//							"height":  "470",
//							"I" : event.xy.x,
//							"J" : event.xy.y,
//							"time": x,
//						}, "success" : function(data,status) { 
//							dojo.byId('feature_label').innerHTML = data;
//							if (dojo.byId('feature_label').innerHTML == "") dojo.byId('feature_label').innerHTML = "Click on the map to get feature information.";
//						}
//					});
					
				},
				getfeatureinfo : function(event) {
					console.log("get feature info");
				}
			}
		})
		};
	}
	
	//adding the controls to the map
	for ( var i in infoControls) {
		map.addControl(infoControls[i]);
	}
	infoControls.click.activate();
}