/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/**
 * @requires OpenLayers/Control.js
 */

/**
 * Class: OpenLayers.Control.LayerSwitcher
 * 
 * Inherits from: - <OpenLayers.Control>
 */
OpenLayers.Control.AntiresistLayerSwitcher = OpenLayers.Class(OpenLayers.Control.LayerSwitcher, {
    
    /**
	 * Property: activeColor {String}
	 */
    activeColor : "white",
    
    /**
	 * Property: layerStates {Array(Object)} Basically a copy of the "state" of
	 * the map's layers the last time the control was drawn. We have this in
	 * order to avoid unnecessarily redrawing the control.
	 */
    layerStates : null,
    
    /**
	 * Property: useLegendGraphics
	 */
    useLegendGraphics : false,
    
    // DOM Elements
    
    /**
	 * Property: layersDiv {DOMElement}
	 */
    layersDiv : null,
    
    /**
	 * Property: baseLayersDiv {DOMElement}
	 */
    baseLayersDiv : null,
    
    /**
	 * Property: baseLayers {Array(<OpenLayers.Layer>)}
	 */
    baseLayers : null,
    
    /**
	 * Property: dataLayersDiv {DOMElement}
	 */
    dataLayersDiv : null,
    
    /**
	 * Property: dataLayers {Array(<OpenLayers.Layer>)}
	 */
    dataLayers : null,
    
    /**
	 * Property: activeLayer
	 */
    activeLayer : null,
    
    /**
	 * Property: minimizeDiv {DOMElement}
	 */
    minimizeDiv : null,
    
    /**
	 * Property: maximizeDiv {DOMElement}
	 */
    maximizeDiv : null,
    
    /**
	 * APIProperty: ascending {Boolean}
	 */
    ascending : true,
    
    /**
	 * Constructor: OpenLayers.Control.LayerSwitcher
	 * 
	 * Parameters: options - {Object}
	 */
    initialize : function(options) {
	    OpenLayers.Control.prototype.initialize.apply(this, arguments);
	    this.layerStates = [];
    },
    
    /**
	 * APIMethod: destroy
	 */
    destroy : function() {
	    
	    OpenLayers.Event.stopObservingElement(this.div);
	    OpenLayers.Event.stopObservingElement(this.minimizeDiv);
	    OpenLayers.Event.stopObservingElement(this.maximizeDiv);
	    
	    // clear out layers info and unregister their events
	    this.clearLayersArray("base");
	    this.clearLayersArray("data");
	     
	    this.map.events.un({
	        "addlayer" : this.redraw,
	        "changelayer" : this.redraw,
	        "removelayer" : this.redraw,
	        "changebaselayer" : this.redraw,
	        scope : this
	    });
	    
	    OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    
    /**
	 * Method: setMap
	 * 
	 * Properties: map - {<OpenLayers.Map>}
	 */
    setMap : function(map) {
	    OpenLayers.Control.prototype.setMap.apply(this, arguments);
	    
	    this.map.events.on({
	        "addlayer" : this.redraw,
	        "changelayer" : this.redraw,
	        "removelayer" : this.redraw,
	        "changebaselayer" : this.redraw,
	        scope : this
	    });
    },
    
    /**
	 * Method: draw
	 * 
	 * Returns: {DOMElement} A reference to the DIV DOMElement containing the
	 * switcher tabs.
	 */
    draw : function() {
	    OpenLayers.Control.prototype.draw.apply(this);
	    
	    // create layout divs
	    this.loadContents();
	    
	    // set mode to minimize
	    if (!this.outsideViewport) {
		    this.minimizeControl();
	    }
	    
	    // populate div with current info
	    this.redraw();
	    
	    return this.div;
    },
    
    /**
	 * Method: clearLayersArray User specifies either "base" or "data". we then
	 * clear all the corresponding listeners, the div, and reinitialize a new
	 * array.
	 * 
	 * Parameters: layersType - {String}
	 */
    clearLayersArray : function(layersType) {
	    var layers = this[layersType + "Layers"];
	    if (layers) {
		    for ( var i = 0, len = layers.length; i < len; i++) {
			    var layer = layers[i];
			    OpenLayers.Event.stopObservingElement(layer.inputElem);
			    OpenLayers.Event.stopObservingElement(layer.labelSpan);
		    }
	    }
	    this[layersType + "LayersDiv"].innerHTML = "";
	    this[layersType + "Layers"] = [];
    },
    
    /**
	 * Method: checkRedraw Checks if the layer state has changed since the last
	 * redraw() call.
	 * 
	 * Returns: {Boolean} The layer state changed since the last redraw() call.
	 */
    checkRedraw : function() {
	    var redraw = false;
	    if (!this.layerStates.length || (this.map.layers.length != this.layerStates.length)) {
		    redraw = true;
	    } else {
		    for ( var i = 0, len = this.layerStates.length; i < len; i++) {
			    var layerState = this.layerStates[i];
			    var layer = this.map.layers[i];
			    if ((layerState.name != layer.name) || (layerState.inRange != layer.inRange) || (layerState.id != layer.id) || (layerState.visibility != layer.visibility)
			        || (layerState.description != layer.description)) {
				    // when add new property here, that property needs to be
				    // added in redraw function (this.layerStates[i] = {...
				    redraw = true;
				    break;
			    }
		    }
	    }
	    return redraw;
    },
    
    /**
	 * Method: redraw Goes through and takes the current state of the Map and
	 * rebuilds the control to display that state. Groups base layers into a
	 * radio-button group and lists each data layer with a checkbox.
	 * 
	 * Returns: {DOMElement} A reference to the DIV DOMElement containing the
	 * control
	 */
    redraw : function() {
	    // if the state hasn't changed since last redraw, no need
	    // to do anything. Just return the existing div.
	    
	    if (!this.checkRedraw()) {
		    return this.div;
	    }
	    
	    // clear out previous layers
	    this.clearLayersArray("base");
	    this.clearLayersArray("data");
	    
	    var containsOverlays = false;
	    var containsBaseLayers = false;
	    
	    // Save state -- for checking layer if the map state changed.
	    // We save this before redrawing, because in the process of redrawing
	    // we will trigger more visibility changes, and we want to not redraw
	    // and enter an infinite loop.
	    var len = this.map.layers.length;
	    this.layerStates = new Array(len);
	    for ( var i = 0; i < len; i++) {
	    	//console.log(layer);
	    	
		    var layer = this.map.layers[i];
		    this.layerStates[i] = {
		        'name' : layer.name,
		        'visibility' : layer.visibility,
		        'inRange' : layer.inRange,
		        'id' : layer.id,
		        'description' : layer.description
		    };
	    } 
	    var layers = this.map.layers.slice();
	    if (!this.ascending) {
		    layers.reverse();
	    }
	    for ( var i = 0, len = layers.length; i < len; i++) {
		    
		    var layer = layers[i];
		    var baseLayer = layer.isBaseLayer;
		    
		    // FIXME: adding the second AND-statement (necessary for displaying
		    // the cholera cases as a wfs in the layer switcher) leads to
		    // a not-working selectLatitude feature, and i don't know why
//		    if (layer.displayInLayerSwitcher && !layer.isVector) {
		    if (layer.displayInLayerSwitcher) {
			    
			    if (baseLayer) {
				    containsBaseLayers = true; 
			    } else {
				    containsOverlays = true;
			    }
			    
			    // only check a baselayer if it is *the* baselayer, check data
			    // layers if they are visible
			    var checked = (baseLayer) ? (layer == this.map.baseLayer) : layer.getVisibility();
			    
			    var layerWrapper = document.createElement("div");
			    // layerWrapper.style.margin = "8px 0px 8px 4px";
			    layerWrapper.style.margin = "2px 0px 15px 1px";
			    layerWrapper.id = "layer_" + layer.id;
			    
			    // create input element
			    var inputElem = document.createElement("input");
			    inputElem.id = this.id + "_input_" + layer.name;
			    inputElem.name = (baseLayer) ? "baseLayers" : layer.name;
			    inputElem.type = (baseLayer) ? "radio" : "checkbox";
			    inputElem.value = layer.name;
			    inputElem.checked = checked;
			    inputElem.defaultChecked = checked;
			    if (checked == true) {
				    inputElem.alt = "Hide layer";
				    inputElem.title = "Hide layer";
			    } else {
				    inputElem.alt = "Show layer";
				    inputElem.title = "Show layer";
			    }
			    
			    if (!baseLayer && !layer.inRange) {
				    inputElem.disabled = true;
			    }
			    
			    // create the label span
			    var labelSpan = document.createElement("div");
			    if (!baseLayer && !layer.inRange) {
				    labelSpan.style.color = "gray";
			    }
			    
			    if (layer.queryable) {
				    labelSpan.style.cursor = "pointer";
			    }
			     
				labelSpan.innerHTML = layer.name; 
			    labelSpan.style.display = "block";
			    labelSpan.style.width = "99%"; 
			    labelSpan.style.verticalAlign = (baseLayer) ? "bottom" : "baseline";
			     		    
			    // create the title div
			    var titleDiv = document.createElement("div");
			    titleDiv.id = "title_" + layer.id;
			    
			    if (this.activeLayer == layer.id) {
				    titleDiv.style.backgroundColor = "#999";
				    //titleDiv.style.border = "solid 1px #999";
			    } else { 
				    titleDiv.style.backgroundColor = "#fff";
				    if (layer.options.displayInLayerSwitcher == false)
                    	titleDiv.style.backgroundColor = "#ffe1e1";
				    if (layer.layerType == 'antibiotica') {
					    titleDiv.style.border = "solid 1px #7F0000";
				    } else if (layer.layerType == 'socioeconomic') {
					    titleDiv.style.border = "solid 1px #007F0E";
				    } else if (layer.layerType == 'administrative') {
					    titleDiv.style.border = "solid 1px #00007F";
				    } else {
					    //titleDiv.style.border = "solid 1px #808080";
				    }
				    
			    }
			    
			    titleDiv.style.width = "99%";
			    titleDiv.style.padding = "2px";
			    titleDiv.style.position = "relative";
			    
			    // create the layer operation panel
			    var buttonSpan = document.createElement("span");
			    buttonSpan.style.padding = "3px 3px 3px 0";
			     
			    // layer order controls
			    var upButton = document.createElement("img");
			    upButton.src = OpenLayers.Util.getImagesLocation() + "layerswitcher/moveup.png";
			    upButton.style.cursor = "pointer";
			    upButton.alt = "Move up";
			    upButton.title = "Move up";
			    upButton.style.paddingLeft = "5px";
			    upButton.style.paddingRight = "5px";
			    
			    var downButton = document.createElement("img");
			    downButton.src = OpenLayers.Util.getImagesLocation() + "layerswitcher/movedown.png";
			    downButton.style.cursor = "pointer";
			    downButton.alt = "Move down";
			    downButton.title = "Move down";
			    downButton.style.paddingLeft = "5px";
			    downButton.style.paddingRight = "5px";
			    
			    // set the default opacity
			    layer.setOpacity(layer.opacity);
			    
			    var opacitySlider = document.createElement("div");
			    opacitySlider.setAttribute("id", "slider_" + layer.id);
			    opacitySlider.style.width = "50px";
			    opacitySlider.style.display = "inline-block";
			    opacitySlider.style.cursor = "pointer";
			    opacitySlider.alt = "Change transparency";
			    opacitySlider.title = "Change transparency";
			    
			    if (heatmap) { //@see heatmap.js
					addClickListener2(upButton, "T4M");
					addClickListener2(downButton, "T4M"); 
					addClickListener2(opacitySlider, "T4M"); 
					//addClickListener2(inputElem, "T4M"); 
			    }
			    
			    var prefABButton = document.createElement("img");
			    prefABButton.setAttribute("id", "prefABButton_" + layer.id);
			    prefABButton.src = OpenLayers.Util.getImagesLocation() + "layerswitcher/gear.png";
			    prefABButton.style.cursor = "pointer";
			    // prefABButton.style.position = "absolute";
			    prefABButton.style.paddingLeft = "30px";
			    prefABButton.style.paddingRight = "5px";
			    prefABButton.alt = "weitere Einstellungen";
			    prefABButton.title = "weitere Einstellungen";
			    
			    var abstractButton = document.createElement("img");
			    abstractButton.setAttribute("id", "abstractButton_" + layer.id);
			    abstractButton.src = OpenLayers.Util.getImagesLocation() + "layerswitcher/bloc_closed.png";
			    abstractButton.style.cursor = "pointer";
			    abstractButton.style.position = "absolute";
			    abstractButton.style.top = "0";
			    abstractButton.style.right = "0";
			    abstractButton.alt = "Details betrachten";
			    abstractButton.title = "Details betrachten";
			    
			    var context = {
			        'layer' : layer,
			        'inputElem' : inputElem,
			        'titleDiv' : titleDiv,
			        'layerSwitcher' : this
			    };
			    
			    OpenLayers.Event.observe(inputElem, "mouseup", OpenLayers.Function.bindAsEventListener(this.onInputClick, context));
			    OpenLayers.Event.observe(upButton, "click", OpenLayers.Function.bindAsEventListener(this.onUpClick, context));
			    OpenLayers.Event.observe(downButton, "click", OpenLayers.Function.bindAsEventListener(this.onDownClick, context));
			    
			    /*
				 * OpenLayers.Event.observe(removeButton, "click",
				 * OpenLayers.Function.bindAsEventListener(this.onRemoveClick,
				 * context) );
				 */

			    var abstractContext = {
			        'layer' : layer,
			        'button' : abstractButton
			    };
			    OpenLayers.Event.observe(abstractButton, "mouseup", OpenLayers.Function.bindAsEventListener(this.toggleAbstract, abstractContext));
			    
			    var prefABContext = {
			        'layer' : layer,
			        'button' : prefABButton
			    };
			    OpenLayers.Event.observe(prefABButton, "click", OpenLayers.Function.bindAsEventListener(this.togglePrefs, prefABContext));
			    
			    var groupArray = (baseLayer) ? this.baseLayers : this.dataLayers;
			    groupArray.push({
			        'layer' : layer,
			        'inputElem' : inputElem,
			        'titleDiv' : titleDiv,
			        'labelSpan' : labelSpan
			    });
			    
			    var groupDiv = (baseLayer) ? this.baseLayersDiv : this.dataLayersDiv;
			    
			    groupDiv.appendChild(layerWrapper);
			    layerWrapper.appendChild(titleDiv);
			    
			    titleDiv.appendChild(labelSpan);
			    titleDiv.appendChild(inputElem);
			    titleDiv.appendChild(buttonSpan);
			    
			    // if (baseLayer){
			    buttonSpan.appendChild(upButton);
			    buttonSpan.appendChild(downButton); 
			    buttonSpan.appendChild(opacitySlider); 
			     
		    }
	    }
	     
		    for ( var i = map.layers.length - 1; i > 0; i--) {
			    if (!map.layers[i].isVector) { 
				    if (dijit.byId("opacityImg_" + map.layers[i].id))
				    	dijit.byId("opacityImg_" + map.layers[i].id).destroy();
				 
				    require(["dijit/form/HorizontalSlider"], function( Slider ) {
				    	
					    var slider = new Slider({ 
				            name: "opacityImg_" + map.layers[i].id,
				            id: "opacityImg_" + map.layers[i].id,
				            value: map.layers[i].opacity * 100,
				            minimum: 0,
				            maximum: 100,
				            intermediateChanges: true,
				            style: "float:left;",
				            onChange: function(value){
				            	var idLayer = this.id.substring(this.id.indexOf('_') + 1, this.id.length);
					            map.getLayer(idLayer).setOpacity(value / 100); 
				            }
				        }, 'slider_' + map.layers[i].id); 
				    
				    });
			    }   
		    }
  
		    var firstFound = false;
		    for (var i = 0; i < this.dataLayers.length; i++) { 
		    	if (this.dataLayers[i].layer.visibility == true) { 
		    		for (var j = 0; j < layer_Array.length; j++) { 
		    			if (!firstFound && this.dataLayers[i].layer.name == layer_Array[j].name) {
		    				vis_layer_number = j;
		    				firstFound = true;
		    			}
		    		}  		
		    	} 
		    } 
		    
		    setLegendValues(vis_layer_number);
		    
	    return this.div;
	    
    },
    
    displayLegend : function(layer) {
	    var display = OpenLayers.Util.getElement("legend");
	    var legendExist = OpenLayers.Util.getElement("legend_" + layer.id);
	    if (display && !legendExist) {
		    display.innerHTML += "<div id=\"legend_" + layer.id + "\" style=\"border-top:dashed 2px;\">" + layer.title + "<br><img style=\"display:none\" src=\"" + layer.legendURL
		        + "\" onload=\"this.style.display = 'inline'\" alt=\"\" onerror=\"this.src='" + OpenLayers.Util.getImagesLocation() + "blank.gif" + "'\" /><br></div>";
	    }
    },
    
    /**
	 * Method: A label has been clicked, check or uncheck its corresponding
	 * input
	 * 
	 * Parameters: e - {Event}
	 * 
	 * Context: - {DOMElement} inputElem - {<OpenLayers.Control.LayerSwitcher>}
	 * layerSwitcher - {<OpenLayers.Layer>} layer
	 */
    
    onInputClick : function(e) {
    	if (heatmap)
    		addCheckboxClick(e);
    	
	    if (!this.inputElem.disabled) {
		    if (this.inputElem.type == "radio") {
			    this.inputElem.checked = true;
			    this.layer.map.setBaseLayer(this.layer);
			    
		    } else {
			    this.inputElem.checked = !this.inputElem.checked;
			    
			    layerSwitcherLayerClick = true;
			    this.layerSwitcher.updateMap();
			    updateServicesLayersConfigUserClick(this.layer);
			    
		    }
	    }
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    /**
	 * Method: onRemoveClick Remove the layer from the map Parameters: e -
	 * {Event}
	 */
    onRemoveClick : function(e) {
	    map.removeLayer(this.layer);
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    /**
	 * Method: onDownClick Set the layer position down one level
	 * 
	 * Parameters: e - {Event}
	 */
    onDownClick : function(e) {
	    map.raiseLayer(this.layer, -1);
	    setLegendValues(vis_layer_number);
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    /**
	 * Method: onUpClick Set the layer position up one level
	 * 
	 * Parameters: e - {Event}
	 */
    onUpClick : function(e) {
	    map.raiseLayer(this.layer, 1);
	    setLegendValues(vis_layer_number);
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    /**
	 * Method: onTitleClick Set the active layer
	 * 
	 * Parameters: e - {Event}
	 */
    onTitleClick : function(e) {
	    var id = this.layer.id;
	    
	    layerSwitcher.activeLayer = id;
	    
	    for ( var i = 0; i < map.layers.length; i++) {
		    var layer = map.layers[i];
		    
		    if (id == layer.id) {
			    this.titleDiv.style.backgroundColor = "#999"; 
		    } else {
			    var div = OpenLayers.Util.getElement("title_" + layer.id);
			    
			    if (div) {
				    div.style.backgroundColor = "#e1e1e1"; 
			    }
		    }
	    }
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    toggleAbstract : function(e) {
	    var span = OpenLayers.Util.getElement("abstract_" + this.layer.id);
	    var button = this.button;
	    
	    if (span && button) {
		    var display = span.style.display;
		    
		    if (display == "block") {
			    span.style.display = "none";
			    button.src = OpenLayers.Util.getImagesLocation() + "layerswitcher/bloc_closed.png";
			    button.alt = "Details betrachten";
			    button.title = "Details betrachten";
		    } else {
			    span.style.display = "block";
			    button.src = OpenLayers.Util.getImagesLocation() + "layerswitcher/bloc_opened.png";
			    button.alt = "Details verstecken";
			    button.title = "Details verstecken";
		    }
	    }
	    
    },
    
    togglePrefs : function(e) {
	    prefWindow.show();
    },
    
    /**
	 * Method: onDataUrlClick Open new window and redirect to URL.
	 * 
	 * Parameters: e - {Event}
	 * 
	 * Context: - {string} url to redirect to
	 */
    onDataUrlClick : function(e) {
	    window.open(this.url, "data", "width=550,height=350,status=yes,scrollbars=yes,resizable=yes");
    },
    
    /**
	 * Method: onMetadataUrlClick Open new window and redirect to URL.
	 * 
	 * Parameters: e - {Event}
	 * 
	 * Context: - {string} url to redirect to
	 */
    onMetadataUrlClick : function(e) {
	    window.open(this.url, "metadata", "width=550,height=350,status=yes,scrollbars=yes,resizable=yes");
    },
    
    /**
	 * Method: onLayerClick Need to update the map accordingly whenever user
	 * clicks in either of the layers.
	 * 
	 * Parameters: e - {Event}
	 */
    onLayerClick : function(e) {
	    this.updateMap();
    },
    
    /**
	 * Method: changeLayerOpacity Changes opacity of a given layer for a given
	 * delta
	 * 
	 * Parameters: e - {Event}
	 * 
	 * Context: - {string} amount to increase or decrease opacity value - {<OpenLayers.Layer>}
	 * layer - {<OpenLayers.Control.LayerSwitcher>} layerSwitcher
	 */
    changeLayerOpacity : function(e) {
	    var maxOpacity = 1.0;
	    var minOpacity = 0.1;
	    var opacity = (this.layer.opacity != null) ? this.layer.opacity : 1.0;
	    var i = parseFloat(this.byOpacity);
	    var opacityElement = "opacity_" + this.layer.id;
	    var opacityImg = "opacityImg_" + this.layer.id;
	    var newOpacity = (parseFloat(opacity + i)).toFixed(1);
	    
	    newOpacity = Math.min(maxOpacity, Math.max(minOpacity, newOpacity));
	    
	    OpenLayers.Util.getElement(opacityElement).value = newOpacity;
	    OpenLayers.Util.getElement(opacityImg).width = (newOpacity * 23).toFixed(0);
	    
	    this.layer.setOpacity(newOpacity);
    },
    
    /**
	 * Method: updateMap Cycles through the loaded data and base layer input
	 * arrays and makes the necessary calls to the Map object such that that the
	 * map's visual state corresponds to what the user has selected in the
	 * control.
	 */
    updateMap : function() {
	    // set the newly selected base layer
	    for ( var i = 0, len = this.baseLayers.length; i < len; i++) {
		    var layerEntry = this.baseLayers[i];
		    if (layerEntry.inputElem.checked) {
			    this.map.setBaseLayer(layerEntry.layer, false);
		    }
	    }
	    
	    // set the correct visibilities for the overlays
	    for ( var i = 0, len = this.dataLayers.length; i < len; i++) { 
		    var layerEntry = this.dataLayers[i];
		    layerEntry.layer.setVisibility(layerEntry.inputElem.checked);
	    }
    },
    
    /**
	 * Method: maximizeControl Set up the labels and divs for the control
	 * 
	 * Parameters: e - {Event}
	 */
    maximizeControl : function(e) {
    	this.div.style.backgroundColor = "white";
    	this.div.style.width = "300px";
	    this.div.style.height = "400px;"; 
	    
	    if (e.explicitOriginalTarget.baseURI.indexOf("index.jsp?") > -1) {
	    	this.div.style.left = "511px";
	    } else {
	    	this.div.style.left = "599px";	
	    }
	    
	    this.showControls(false);
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    /**
	 * Method: minimizeControl Hide all the contents of the control, shrink the
	 * size, add the maximize icon
	 * 
	 * Parameters: e - {Event}
	 */
    minimizeControl : function(e) { 
    	if (e.explicitOriginalTarget.baseURI.indexOf("index.jsp?") > -1) {	    
    		this.div.style.left = "793px";
    	} else {
    		this.div.style.left = "881px";
    	}
    	
    	this.div.style.width = "20px";
    	this.div.style.backgroundColor = "transparent"; 
	    this.div.style.borderLeft = "none";
    	
	    this.showControls(true);
	    
	    if (e != null) {
		    OpenLayers.Event.stop(e);
	    }
    },
    
    /**
	 * Method: showControls Hide/Show all LayerSwitcher controls depending on
	 * whether we are minimized or not
	 * 
	 * Parameters: minimize - {Boolean}
	 */
    showControls : function(minimize) {
	    
	    this.maximizeDiv.style.display = minimize ? "" : "none";
	    this.minimizeDiv.style.display = minimize ? "none" : "";
	    
	    this.layersDiv.style.display = minimize ? "none" : "";
    },
    
    /**
	 * Method: loadContents Set up the labels and divs for the control
	 */
    loadContents : function() {
	     
	    this.div.style.fontFamily = "sans-serif";
	    this.div.style.fontWeight = "bold";
	    this.div.style.fontSize = "11px";
	    this.div.style.color = "#333";
	    
	    // layers list div
	    this.layersDiv = document.createElement("div"); 
	    this.layersDiv.id = this.id + "_layersDiv"; 
	    this.layersDiv.style.position = "relative";  
	    this.layersDiv.style.width = "99%";
	    
	    this.layersDiv.style.fontSize = "11px";
	    
	    // ignore any mousewheel events
	    OpenLayers.Event.observe(this.layersDiv, "mousewheel", this.ignoreEvent);
	    
	    // had to set width/height to get transparency in IE to work.
	    this.baseLayersDiv = document.createElement("div"); 
	    this.dataLayersDiv = document.createElement("div"); 
	    this.layersDiv.appendChild(this.baseLayersDiv); 
	    this.layersDiv.appendChild(this.dataLayersDiv);
	    
	    this.div.appendChild(this.layersDiv);
    },
    
    /**
	 * Method: ignoreEvent
	 * 
	 * Parameters: evt - {Event}
	 */
    ignoreEvent : function(evt) {
	    OpenLayers.Event.stop(evt);
    },
    
    /**
	 * Method: mouseDown Register a local 'mouseDown' flag so that we'll know
	 * whether or not to ignore a mouseUp event
	 * 
	 * Parameters: evt - {Event}
	 */
    mouseDown : function(evt) {
	    this.isMouseDown = true;
	    this.ignoreEvent(evt);
    },
    
    /**
	 * Method: mouseUp If the 'isMouseDown' flag has been set, that means that
	 * the drag was started from within the LayerSwitcher control, and thus we
	 * can ignore the mouseup. Otherwise, let the Event continue.
	 * 
	 * Parameters: evt - {Event}
	 */
    mouseUp : function(evt) {
	    if (this.isMouseDown) {
		    this.isMouseDown = false;
		    this.ignoreEvent(evt);
	    }
    },
    
    CLASS_NAME : "OpenLayers.Control.AntiresistLayerSwitcher"
});
