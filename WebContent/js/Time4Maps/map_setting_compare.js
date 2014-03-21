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
 * This javascript file contains source code for initalizing the OpenLayers map and legend.
 * The general params, such as wms name, layer name ... will be added to the gui element.
 * Time information is checked and appropriate methods to generate time slider or time combobox are called.
 * 
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

var map, wms_layer;
var layer_Array; 
var vis_layer_number = 0; 
var map2, wms_layer2;
var layer_Array2; 
var vis_layer_number2 = 0; 

/**
 * This method will be called from index.jsp/start.jsp to initialize the content filling.
 */
function initializeMapping() {  
	var b2 = new dijit.form.DateTextBox({
		value: "01-11-2006", 
		name: "fromDate_Input",
		onChange: fromDateChanged
		}, "fromDate_Input");	
	setMapValues();   
} 

/**
 * The method adds choosen layers to the map and register several events, e.g. change visible layer.
 * It also handles the connection between the two maps.
 */
function setMapValues() {
  var service_JSON2, layer_JSON2, time_JSON2;  
  wmsDescription_Store2.fetchItemByIdentity({ identity: "serviceDescriptionParam", onItem: function(item, request) { service_JSON2 = item; }});
  wmsDescription_Store2.fetchItemByIdentity({ identity: "layerDescriptionParam", onItem: function(item, request) { layer_JSON2 = item; }});                                
  wmsDescription_Store2.fetchItemByIdentity({ identity: "timeParam", onItem: function(item, request) { time_JSON2 = item; }});
  map2 = new OpenLayers.Map( 'map2' ); 
  //adding all given layers from wms
  layer_Array2 = new Array(layer_JSON2.name.length);
  for (var i = 0; i < layer_JSON2.name.length; i++) {
	  if (time_JSON2 != null && time_JSON2.def[0] != null && time_JSON2.start[0] != null) { 	  
		  if(service_JSON2.format === "image/tiff" || service_JSON2.format == "image/tiff") { 
			  wms_layer2 = new OpenLayers.Layer.WMS(layer_JSON2.title[i], service_JSON2.url,
				  { layers:layer_JSON2.name[i],      
					  format: "image/png", //
					  transparent:false,
					  time: cutDate(time_JSON2.def[0]) },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map2.addLayer(wms_layer2);
				  layer_Array2[i] = wms_layer2; 		  
		  } else { 
			  wms_layer2 = new OpenLayers.Layer.WMS(layer_JSON2.title[i], service_JSON2.url,
				  { layers:layer_JSON2.name[i],      
					  format: service_JSON2.format, //"image/png", //
					  transparent:false,
					  time: cutDate(time_JSON2.def[0]) },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map2.addLayer(wms_layer2);
				  layer_Array2[i] = wms_layer2; 			  
		  }	 		  
	  } else {
		  if(service_JSON2.format === "image/tiff") {			 
			  wms_layer2 = new OpenLayers.Layer.WMS(layer_JSON2.title[i], service_JSON2.url,
				  { layers:layer_JSON2.name[i],      
					  format: "image/png", 
					  transparent:false },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map2.addLayer(wms_layer2);
				  layer_Array2[i] = wms_layer2; 	  
		  } else  {			  
			  wms_layer2 = new OpenLayers.Layer.WMS(layer_JSON2.title[i], service_JSON2.url,
				  { layers:layer_JSON2.name[i],      
					  format: service_JSON2.format, //"image/png", //
					  transparent:false },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map2.addLayer(wms_layer2);
				  layer_Array2[i] = wms_layer2;    
		  }	  
	  }
  } 
  setLegendValues(0,0);
  map2.zoomToMaxExtent(); 
  map2.zoomIn(); 
  //adapt style of layer switcher (remove blue lines)
  var OLSwitcher2 = new OpenLayers.Control.LayerSwitcher(true, "transparent", true);
  OLSwitcher2.roundedCornerColor = "transparent";
  if (layer_Array2.length >= 2) {
	  map2.addControl(OLSwitcher2);
	  OLSwitcher2.maximizeControl();
  }
  
  //remove new pan/zoom-control - cause it has no world-button
  var controls = map2.getControlsByClass("OpenLayers.Control.Zoom");
  map2.removeControl(controls[0]); 

  //add old pan/zoom-control
  var panZoomBar = new OpenLayers.Control.PanZoomBar();
  panZoomBar.zoomWorldIcon = true;
  map2.addControl(panZoomBar);
  
  map2.addControl(new OpenLayers.Control.MousePosition());	
  
  map2.events.register('changelayer', null, function(evt) {
	if (evt.property === "visibility") { 
      for (var i = 0; i < layer_Array2.length; i++) { 
        if (layer_Array2[i].params.LAYERS === evt.layer.params["LAYERS"]) { 
           setLegendValues(i,2);
           vis_layer_number2 = i; 
           if (markers2 != null) markers2.destroy();
           dojo.byId("featureInfo_frame").src = "featureInfo.jsp";
        }
      }
    }
  }); 
  
  var service_JSON, layer_JSON, time_JSON;  
  wmsDescription_Store.fetchItemByIdentity({ identity: "serviceDescriptionParam", onItem: function(item, request) { service_JSON = item; }});
  wmsDescription_Store.fetchItemByIdentity({ identity: "layerDescriptionParam", onItem: function(item, request) { layer_JSON = item; }});                                
  wmsDescription_Store.fetchItemByIdentity({ identity: "timeParam", onItem: function(item, request) { time_JSON = item; }});
  map = new OpenLayers.Map( 'map' ); 
  //adding all given layers from wms
  layer_Array = new Array(layer_JSON.name.length);
  for (var i = 0; i < layer_JSON.name.length; i++) {
	  if (time_JSON != null && time_JSON.def[0] != null && time_JSON.start[0] != null) { 
		  if(service_JSON.format === "image/tiff" || service_JSON.format == "image/tiff") { 
			  wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
				  { layers:layer_JSON.name[i],      
					  format: "image/png", //
					  transparent:false,
					  time: cutDate(time_JSON.def[0]) },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map.addLayer(wms_layer);
				  layer_Array[i] = wms_layer; 		  
		  } else { 
			  wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
				  { layers:layer_JSON.name[i],      
					  format: service_JSON.format, //"image/png", //
					  transparent:false,
					  time: cutDate(time_JSON.def[0]) },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map.addLayer(wms_layer);
				  layer_Array[i] = wms_layer; 			  
		  }	 		  
	  } else {
		  if(service_JSON.format === "image/tiff") {			 
			  wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
				  { layers:layer_JSON.name[i],      
					  format: "image/png", //
					  transparent:false },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map.addLayer(wms_layer);
				  layer_Array[i] = wms_layer; 
			  
		  } else  {			  
			  wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
				  { layers:layer_JSON.name[i],      
					  format: service_JSON.format, //"image/png", //
					  transparent:false },
					  { isBaseLayer: true, visibility: true, projection: "EPSG:4326",'reproject': true, singleTile: true, ratio: 1, transitionEffect: 'resize' }                 
				  );
				  map.addLayer(wms_layer);
				  layer_Array[i] = wms_layer;    
		  }	  
	  }
  } 
  setLegendValues(0,0);
  map.zoomToMaxExtent(); 
  map.zoomIn(); 
  
  //remove new pan/zoom-control - cause it has no world-button
  var controls = map.getControlsByClass("OpenLayers.Control.Zoom");
  map.removeControl(controls[0]); 

  //add old pan/zoom-control
  var panZoomBar = new OpenLayers.Control.PanZoomBar();
  panZoomBar.zoomWorldIcon = true;
  map.addControl(panZoomBar);
  
  //adapt style of layer switcher (remove blue lines)
  var OLSwitcher = new OpenLayers.Control.LayerSwitcher(true, "transparent", true);
  OLSwitcher.roundedCornerColor = "transparent";
  if (layer_Array.length >= 2) {
	  map.addControl(OLSwitcher);
	  OLSwitcher.maximizeControl();
  }
  map.addControl(new OpenLayers.Control.MousePosition());	
  map.events.register('changelayer', null, function(evt) {
	if (evt.property === "visibility") { 
      for (var i = 0; i < layer_Array.length; i++) { 
        if (layer_Array[i].params.LAYERS === evt.layer.params["LAYERS"]) { 
           setLegendValues(i,1);
           vis_layer_number = i; 
           if (markers != null) markers.destroy();
           dojo.byId("featureInfo_frame").src = "featureInfo.jsp";
        }
      }
    }
  }); 
  var event_by_map1 = false;
  var event_by_map2 = false;
  map.events.register('moveend', null, function(evt) { 
	  if (event_by_map2) { event_by_map2 = false;
	  } else {
		  event_by_map1 = true;
		  map2.setCenter(map.getCenter(), map.getZoom());
	  }
  });
  map.events.register('movestart', null, function(evt) { 
	  if (event_by_map2) {
		  //event_by_map2 = false;
	  } else {
		  event_by_map1 = true;
		  map2.setCenter(map.getCenter(), map.getZoom());
	  }
  });
  map.events.register('move', null, function(evt) { 
	  if (event_by_map2) {
		  //event_by_map2 = false;
	  } else {
		  event_by_map1 = true;
		  map2.setCenter(map.getCenter(), map.getZoom()); 
	  }
  });
  
  map2.events.register('moveend', null, function(evt) {  
	  if (event_by_map1) {
		  event_by_map1 = false;
	  } else {
		  event_by_map2 = true;
		  map.setCenter(map2.getCenter(), map2.getZoom()); 
	  } 
  });
  
  map2.events.register('movestart', null, function(evt) {  
	  if (event_by_map1) {
		  //event_by_map1 = false;
	  } else {
		  event_by_map2 = true;
		  map.setCenter(map2.getCenter(), map2.getZoom()); 
	  } 
  });
  
  map2.events.register('move', null, function(evt) {  
	  if (event_by_map1) {
		  //event_by_map1 = false;
	  } else {
		  event_by_map2 = true;
		  map.setCenter(map2.getCenter(), map2.getZoom()); 
	  } 
  });
}

var leg_1 = false;
var leg_2 = false;

/**
 * The method is called, if the visibility of a layer is changed.
 * 
 * @param pos_Array - the position of the legend url in the array of all legends to all loaded layer
 */
function setLegendValues(pos_Array, mapno) { 	
  var legend_JSON;  
  wmsDescription_Store.fetchItemByIdentity({ 
	  identity: "legendParam", onItem: function(item, request) { legend_JSON = item; }
  });
  if (legend_JSON.url === null || legend_JSON.url[pos_Array] === "null") {  
	leg_1 = false;
  } else { 
    leg_1 = true;
    if (mapno == 0 || mapno == 1) dojo.byId('legend_image').src = legend_JSON.url[pos_Array] + "&height=" + legend_JSON.height[pos_Array] + "&width=" + legend_JSON.width[pos_Array];
    if (mapno == 1) dojo.byId('description_wms_title').innerHTML = layer_Array[pos_Array].name; 
  } 
  var legend_JSON2;  
  wmsDescription_Store2.fetchItemByIdentity({ 
	  identity: "legendParam", onItem: function(item, request) { legend_JSON2 = item; }
  });
 
  if (legend_JSON2.url === null || legend_JSON2.url[pos_Array] === "null") {  
	leg_2 = false;
  } else { 
    leg_2 = true;
    if (mapno == 0 || mapno == 2) dojo.byId('legend_image2').src = legend_JSON2.url[pos_Array] + "&height=" + legend_JSON2.height[pos_Array] + "&width=" + legend_JSON2.width[pos_Array];
    if (mapno == 2) dojo.byId('description_wms_title2').innerHTML = layer_Array2[pos_Array].name; 
  } 
  showLegend();
  hideLegend();
}

/**
 * This method hides the image frames for the legends.
 */
function hideLegend(){
  if (leg_1 == false) dojo.byId('legend_image').style.visibility = 'hidden';
  if (leg_2 == false) dojo.byId('legend_image2').style.visibility = 'hidden';
}

/**
 * This method shows the image frames for the legends.
 */
function showLegend(){
  if (leg_1 == true) dojo.byId('legend_image').style.visibility = 'visible';
  if (leg_2 == true) dojo.byId('legend_image2').style.visibility = 'visible';
}

/**
 * This method adapts time information of OpenLayers layer params to change the maps based on new chosen time stamp. 
 * 
 * @param date_JSDate - the time stamp choosen by the user
 */
function setMapTime(date_JSDate) {
  for (var i = 0; i < layer_Array.length; i++) {  	  
	if (combo == false) {
		layer_Array[i].mergeNewParams({'time':cutDate(date_JSDate)}); 
		layer_Array2[i].mergeNewParams({'time':cutDate(date_JSDate)}); 
	} else {
		layer_Array[i].mergeNewParams({'time':date_JSDate});
		layer_Array2[i].mergeNewParams({'time':cutDate(date_JSDate)}); 
	}
  } 
}