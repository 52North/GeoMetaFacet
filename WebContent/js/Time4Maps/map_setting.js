/**
 * This javascript file contains source code for initalizing the OpenLayers map and legend.
 * The general params, such as wms name, layer name ... will be added to the gui element.
 * Time information is checked and appropriate methods to generate time slider or time combobox are called.
 * 
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 */

//OL map, list of available layer
var map, wms_layer, layer_Array;
//number of actually visible layer
var vis_layer_number = 0; 

/**
 * This method will be called from index.jsp/start.jsp to initialize the content filling.
 * Choosen layer are added to the map and click events on the map are registered here.
 */
function initializeMapping() {   
	//getting objects from the json store
	
    var service_JSON, layer_JSON, time_JSON, period_JSON;
    wmsDescription_Store.fetchItemByIdentity({
        identity: "layerDescriptionParam", 
        onItem: function(item, request) {  
        	layer_JSON = item; }        
    });
    
    wmsDescription_Store.fetchItemByIdentity({ 
        identity: "serviceDescriptionParam", 
        onItem: function(item, request) {service_JSON = item; }
    });
      
    wmsDescription_Store.fetchItemByIdentity({
       identity: "timeParam",
       onItem: function(item, request) { time_JSON = item; }        
    });
    
    wmsDescription_Store.fetchItemByIdentity({
       identity: "periodParam",
       onItem: function(item, request) { period_JSON = item; }
    });
    
    map = new OpenLayers.Map('map', { controls: [] });
    
    layer = new OpenLayers.Layer.WMS( "OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0",
            {layers: 'basic'},{ displayInLayerSwitcher: false} );
    
    layer2 = new OpenLayers.Layer.WMS( "GLUES gtopo 30",
            "http://services1.glues.geo.tu-dresden.de:8080/geoserver/glues/wms",
            {layers: 'glues:gtopo30'},{ displayInLayerSwitcher: true} );
    
    layer3 = new OpenLayers.Layer.WMS( "GLUES world borders",
            "http://services1.glues.geo.tu-dresden.de:8080/geoserver/glues/wms",
            {layers: 'glues:TM_WORLD_BORDERS'},{ displayInLayerSwitcher: true} );
    
    layer.title = "OpenLayers WMS";
    map.addLayer(layer);
    layer2.title = "GLUES gtopo 30";
    //map.addLayer(layer2);
    layer3.title = "GLUES world borders";
    //map.addLayer(layer3);
    
    layer_Array = new Array(layer_JSON.name.length);
  
    //parse all layers and decide whether there should be loaded time gui (slider, combobox) or not
    for (var i=0; i<layer_JSON.name.length; i++) {
    	
    	//layer is time-variate
        if (time_JSON != null && time_JSON.def[i] != null && time_JSON.start[i] != null && period_JSON.year[i] != null && period_JSON.month[i] != null && period_JSON.day[i] != null){
            //avoiding OpenLayers problems with tiff format
        	if (service_JSON.format === "image/tiff" || service_JSON.format == "image/tiff" ) {
 
        		wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url, 
        	                  { layers: layer_JSON.name[i],      
        	                	format: "image/png", 
        	                	transparent: true,
        	                	time: cutDate(new Date(time_JSON.def[i])) },
        	                  { isBaseLayer: false, visibility: true, projection: "EPSG:4326",'reproject': true, //singleTile: true, 
        	                		ratio: 1, transitionEffect: 'resize' }                 
        					  );
        		wms_layer.title = layer_JSON.title[i];
        		wms_layer.opacity = 1;
        	
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;  
            } else { 
                wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
				  { layers: layer_JSON.name[i],      
                	format: service_JSON.format,  
					  transparent: true,
					  time: cutDate(new Date(time_JSON.def[i])) },
					  { isBaseLayer: false, visibility: true, projection: "EPSG:4326",'reproject': true, //singleTile: true, 
						  ratio: 1, transitionEffect: 'resize' }                 
				  );
                wms_layer.opacity = 1;
                wms_layer.title = layer_JSON.title[i]; 
                map.addLayer(wms_layer); 
                layer_Array[i] = wms_layer;   
            } 
         
        //layer is not time-variate	
        } else {
            if(service_JSON.format === "image/tiff") {			 
                wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
                    { layers: layer_JSON.name[i],      
                    format: "image/png", 
                    transparent: true },
                    { isBaseLayer: false, visibility: true, projection: "EPSG:4326",'reproject': true, //singleTile: true, 
                    	ratio: 1, transitionEffect: 'resize' }                 
                );
                wms_layer.opacity = 1;
                wms_layer.title = layer_JSON.title[i];
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer; 		  
            } else {			  
                wms_layer = new OpenLayers.Layer.WMS(layer_JSON.title[i], service_JSON.url,
                    { layers: layer_JSON.name[i],      
                    format: service_JSON.format, 
                    transparent: true },
                    { isBaseLayer: false, visibility: true, projection: "EPSG:4326",'reproject': true, //singleTile: true, 
                    	ratio: 1, transitionEffect: 'resize' }                 
                );
                wms_layer.opacity = 1;
                wms_layer.title = layer_JSON.title[i];
                map.addLayer(wms_layer);
                layer_Array[i] = wms_layer;    
            }	         
        }          
    }
 
    //initialize map params 
    setLegendValues(0);
    map.zoomToMaxExtent(); 
    map.zoomIn(); 
    
    //adapt style of layer switcher (remove blue lines)
//    var OLSwitcher = new OpenLayers.Control.LayerSwitcher(true, "transparent", true);
//    OLSwitcher.roundedCornerColor = "transparent";
//    if (layer_Array.length >= 2) {
//        map.addControl(OLSwitcher);
//        OLSwitcher.maximizeControl();
//    }
      
    var OLSwitcher = new OpenLayers.Control.AntiresistLayerSwitcher({
	    'div' : OpenLayers.Util.getElement('layerSwitcherCustom'),
	    'ascending' : false
	});
	map.addControl(OLSwitcher);
      
	if (markers != null) {  
		markers = null; 
    }
  
	var panZoomBar = new OpenLayers.Control.PanZoomBar();
    panZoomBar.zoomWorldIcon = true;
    var mousePosition = new OpenLayers.Control.MousePosition();
    var touchNavigation = new OpenLayers.Control.TouchNavigation();
    map.addControl(touchNavigation);
    map.addControl(mousePosition);
    map.addControl(panZoomBar);
    
    if (heatmap) { //@see heatmap.js
    	addClickListener(panZoomBar.id, "T4M");
    	addClickListener2(OLSwitcher, "T4M");
    } 
    
    //register change layer event
    //to update time information, legend and feature info response
    //map.events.register('changebaselayer', null, function(evt) {
    map.events.register('changelayer', null, function(evt) { 
    	if (evt.property == "visibility" || evt.property == "order") {   	
	    	for (var i = 0; i < evt.layer.map.layers.length; i++) { 
	    		if (evt.layer.map.layers[i].visibility == true && evt.layer.map.layers[i].isBaseLayer == false) {
	    			for (var j = 0; j < layer_Array.length; j++) {   
	    				if (layer_Array[j].name == evt.layer.map.layers[i].name) {
	    					vis_layer_number = j;
	    					setLegendValues(vis_layer_number);
	    			    	updateTimeValues();
	    	    			if (markers != null) {
	        	    		   infoControls.click.handler.click(last_event);	 
	    	                } else { 
	    	                	if (dojo.byId('feature_label')) dojo.byId('feature_label').innerHTML = "Click on the map to get feature information.";
	    	                }
	    				} 
	    			}
	    		}
	    	}
    	}
    });
}

/**
 * The method is called, if the visibility of a layer is changed.
 * 
 * @param pos_Array - the position of the legend url in the array of all legends to all loaded layer
 */
function setLegendValues(pos_Array) {
  var legend_JSON;  
  wmsDescription_Store.fetchItemByIdentity({ 
	  identity: "legendParam", onItem: function(item, request) { legend_JSON = item; }
  });
  
  //Hannes 11.02.2013
  if (legend_JSON.url === null || legend_JSON.url == "" || legend_JSON.url === undefined || legend_JSON.url[pos_Array] === "null" || legend_JSON.url[pos_Array] === null || legend_JSON.url[pos_Array] === undefined) {  
	  hideLegend();
  } else { 
	  
	  //get height, width for the legend image
	  if (legend_JSON.width[pos_Array] > 170) {
		  var map_width_string = dojo.byId('map').style.width.substring(0,dojo.byId('map').style.width.length-2);
		  var total_width_int = parseInt(map_width_string) + parseInt(legend_JSON.width[pos_Array]) + parseInt(50); 
		  var width_string = total_width_int + 'px';         
       } 
        
	  //set visibility for legend image
	  showLegend();
	  
	  //Hannes 20.02.2013 
	  dojo.byId('legend_frame').src = legend_JSON.url[pos_Array] + "&height=" + legend_JSON.height[pos_Array] + "&width=" + legend_JSON.width[pos_Array];
  } 
}

/**
 * This method hides the image frame for the legend.
 */
function hideLegend(){
  dojo.byId('legend_frame').style.visibility = 'hidden';
}

/**
 * This method shows the image frame for the legend.
 */
function showLegend(){
  dojo.byId('legend_frame').style.visibility = 'visible';
}

/**
 * This method adapts time information of OpenLayers layer param to change the map based on new chosen time stamp. 
 * 
 * @param date_JSDate - the time stamp choosen by the user
 */
var lastDate;

function setMapTime(date_JSDate) { 
  for (var i = 0; i < layer_Array.length; i++) {  	  
	if (combo == false) {
		var newD = cutDate(date_JSDate);  
		if (newD != "0NaN-NaN" && newD != "0NaN") {
			layer_Array[i].mergeNewParams({ 'time':newD });
			lastDate = newD;
		} else { 
			//CH 2013-04-09 Mozilla verschluckt sich am Datum 
			newD = cutDate(lastDate);
			layer_Array[i].mergeNewParams({ 'time': newD });
			//layer_Array[i].mergeNewParams({ 'time': date_JSDate }); 
		}
	} else { 
		layer_Array[i].mergeNewParams({'time': date_JSDate}); 
	}
  } 
}

function updateServicesLayersConfigUserClick(layer) {
	layer.visibilityUser = layer.visibility;
}

function setEventHandlerResizeMap() {
	require(["dojo/parser", "dojo/ready", "dijit/registry", "dojo/dom", "dojo/dom-style", "dojo/aspect",
		"dijit/form/CheckBox", "dojo/cookie", "dijit/layout/BorderContainer", "dijit/layout/TabContainer", "dijit/layout/ContentPane"
	    ], function(parser, ready, registry, dom, domStyle, aspect) {
		
		var splitter_left = registry.byId("time4mapsMap").getSplitter("left");
		var splitter_top = registry.byId("time4mapsMap_Left").getSplitter("top");
		var splitter_base = registry.byId("base_borderContainer").getSplitter("left");
		var splitter_middle = registry.byId("middle_borderContainer").getSplitter("top");
		var splitter_bottom = registry.byId("bottom_borderContainer").getSplitter("left");
		
        var moveHandle_left = null;
        var moveHandle_top = null;
        var moveHandle_base = null;
        var moveHandle_middle = null;
        var moveHandle_bottom = null;
        
        //split: list - detail
        aspect.after(splitter_bottom, "_startDrag", function() {
        	moveHandle_bottom = aspect.after(splitter_left.domNode, "onmousemove", function() { 
        		resizeMap();
            });
        });  
        aspect.after(splitter_bottom, "_stopDrag", function() {
        	if (heatmap) addSplitterChange("listDetailSplitter");
        	moveHandle_bottom && moveHandle_bottom.remove();       	
        });
        
        //split: map - featureInfo
        aspect.after(splitter_left, "_startDrag", function() {
        	moveHandle_left = aspect.after(splitter_left.domNode, "onmousemove", function() { 
        		resizeMap();
            });
        });  
        aspect.after(splitter_left, "_stopDrag", function() {
        	if (heatmap) addSplitterChange("mapFInfoSplitter");
        	moveHandle_left && moveHandle_left.remove();       	
        });
       
        //split facets - middle panel
        aspect.after(splitter_base, "_startDrag", function() {
        	moveHandle_base = aspect.after(splitter_base.domNode, "onmousemove", function() {
        		resizeMap();
            });
        });  
        aspect.after(splitter_base, "_stopDrag", function() {
        	if (heatmap) addSplitterChange("facetMiddleSplitter");
        	moveHandle_base && moveHandle_base.remove();
        });
        
        //splitter: map - time info
        aspect.after(splitter_top, "_startDrag", function() {
        	moveHandle_top = aspect.after(splitter_top.domNode, "onmousemove", function() {
        		resizeMap();
            });
        });  
        aspect.after(splitter_top, "_stopDrag", function() {
        	if (heatmap) addSplitterChange("mapTimeSplitter");
        	moveHandle_top && moveHandle_top.remove();
        });
     
        //splitter: details/result list - map
        aspect.after(splitter_middle, "_startDrag", function() {
        	moveHandle_middle = aspect.after(splitter_middle.domNode, "onmousemove", function() {
        		resizeMap();
            });
        });  
        aspect.after(splitter_middle, "_stopDrag", function() {
        	if (heatmap) addSplitterChange("mapListDetailSplitter");
        	moveHandle_middle && moveHandle_middle.remove();
        });		
	});
}

function resizeMap() { 
	if (map) {
    	map.updateSize(); 
    	
    	//defined in feature_info_setting_dynamic.js  
    	map_height = map.getCurrentSize().h;
    	map_width = map.getCurrentSize().w; 
    
    	for (var i = 0; i < layer_Array.length; i++)
    		layer_Array[i].redraw(); 
    }
    if (map2) { 
		map2.updateSize(); 
		vector.redraw();
	}
}