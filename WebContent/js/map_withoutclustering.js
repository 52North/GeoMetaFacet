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

// +++ deprecated +++ //
// This file contains methods to initialize a map without clustering the bounding boxes.
// Clustering @see map.js

var map2 = null; // OL Map Variable
var vector = null; // OL Layer Vector
var selectFeature = null; // OL SelectFeature Control
var lastSelectedFeature; // Last feature that was focussed/selected
var featureList = [];	//  Array that finally contains [Feature, [FeatureID], BoundingBox ]
var filterButton = 1 ; // ButtonID of the Additional Buttons on the right side of the map 
//1 == single feature Selection
//2 == box selection
//3 == viewpoint selection 	
var selectOneBox = false; 

/**
*	\details	Initialize elements of OL map and controls on index.html 
*/
function initMap() {	
	if (document.getElementById("mapII").innerHTML === "") {
		map2 = new OpenLayers.Map("mapII", {		
			projection: new OpenLayers.Projection("EPSG:900913"), 
			displayProjection: new OpenLayers.Projection("EPSG:4326"),
           	controls: []
		});
		
		var panZoomBar = new OpenLayers.Control.PanZoomBar();
		panZoomBar.zoomWorldIcon = true;	    
	    		
	    var mousePosition = new OpenLayers.Control.MousePosition();
	    var touchNavigation = new OpenLayers.Control.TouchNavigation();
	    map2.addControl(touchNavigation);
	    map2.addControl(mousePosition);
	    map2.addControl(panZoomBar);
  
	    if (heatmap) //@see heatmap.js
			addClickListener(panZoomBar.id, "MAP");
	    	    
		var osmLayer = new OpenLayers.Layer.OSM("MapQuest", 
			['http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png']
		);

		//var strategy = new OpenLayers.Strategy.Cluster();
		//strategy.distance = 2;
        //strategy.threshold = 5;
		
		vector = new OpenLayers.Layer.Vector("vector", {			 
			"select": {
				strokeColor: "#F9B200",
				strokeWidth: 2,
				strokeOpacity: 0.8
			},
			//strategies: [strategy]
		});

		//FIX 'Cross-origin image load denied by Cross-Origin Resource Sharing policy'
		osmLayer.tileOptions.crossOriginKeyword = null;

		map2.addLayers([osmLayer, vector]);
		map2.setCenter( new OpenLayers.LonLat(0, 0).transform(map2.displayProjection, map2.projection));

		loadAdditionalMapWidgets();
		setSelectFeature();
	}
}

/*
*	\details 	Create an OL Bounds from a LonLat String , e.g. '180,60;-180,60;0,0;70,-10', and return it
*
*	\param		LonLat - String , e.g. '180,60;-180,60;0,0;70,-10'
*
*	\return		bounds - OL Bounds Element 
*/
function LonLatToBounds(LonLat) {
	if (LonLat != null) {
		var bounds = new OpenLayers.Bounds();
		var latlng = LonLat.split(";");

		for (var i in latlng) {
			var coord = latlng[i].split(",");
			bounds.extend( new OpenLayers.LonLat( coord[0], coord[1]).transform(map2.displayProjection, map2.projection));
		}
		return bounds;	
	}
	return null;
}

/*
*	\details	Zoom in to an area, defined by an ol bounds element  
*
*	\param		bounds - OL Bounds element
*/
function zoomIn(bounds) {
	if (bounds != null) map2.zoomToExtent(bounds);
}

/*
*	\details 	function verifys if one of array[2] cells contains the given boundingbox
*							true  - put feature id to array[1] -> return false -> Duplicate
*							false - a new bounding box which the array not contains
*
*	\param		Array   	three-dimensional list 
*							Array[0] - feature
*							Array[1] - List of Id's which have the same boundingBox like [2]
*							Array[2] - bounding box 
*				Coordinate	bounding box, e.g. '180,60;-180,60;0,0;70,-10' 	
*
*	\return 	true 	a new bounding box which the array[2] not contains
*				false	array[2] contains bounding box 		
*/
function checkForDuplicate(Array, Coordinate) {
	for (var i = 0; i < Array.length; i++) {
		if (Array[i][2] === Coordinate.geographicboundingbox) {
			Array[i][1].push(Coordinate.id);
			return false;
		}
	}
	return true;
}

/*
*	\details	function takes a bounding box and convert it to an array of points
*
*	\param		item - String , e.g. '180,60;-180,60;0,0;70,-10'
*
*	\return		koord - array of points
*				null	
*/
function LonLatToPointArray(item) { 
	if (allBoxes)
		item = item.geographicboundingbox;

	if (item != null) { 
		var latlng = item.split(";");
		
		var koord = [];
		for (var i=0; i<latlng.length; i++) {
			latlngSplit = latlng[i].split(",");

			if (parseFloat(latlngSplit[1]) > 89) latlngSplit[1] = "85";
			if (parseFloat(latlngSplit[1]) < -89) latlngSplit[1] = "-85";
			koord.push(latlngSplit); 
		}
	 
		return koord; 
	} else return null;
}

/*
*	\details	convert an array containing points to an OL linestring
*
*	\param		PointArray - Array containing Points
*
*	\return		OL linestring
*				null
*/
function PointArrayToLineString(PointArray) {
	if (PointArray != null) {
		var points = [];
	
		for (var i=0; i < PointArray.length; i++){
			points.push(new OpenLayers.Geometry.Point(PointArray[i][0], PointArray[i][1]).transform(map2.displayProjection, map2.projection));
		}
		
		points.push(new OpenLayers.Geometry.Point(PointArray[0][0], PointArray[0][1]).transform(map2.displayProjection, map2.projection));
		return (new OpenLayers.Geometry.LineString(points));
	} else return null;
}

/*
*	\details	focus a single feature on the map
*
*	\param		id - feature id
*/
function showFeature(id) {
	if (!metaVizOn) {
		allBoxes = false;
		var entry = httpGet(findOne + "/" + id);
		var latLong = entry.geographicboundingbox; 
		if (latLong) { 
			map2.setCenter( new OpenLayers.LonLat(0, 0).transform(map2.displayProjection, map2.projection));
			zoomIn(LonLatToBounds(latLong));
			
			//highlighting selected feature
			for (var i=0; i < featureList.length; i++) {
				for (var j=0; j < featureList[i][1].length; j++) {
					if (featureList[i][1][j] == id) {
						if (lastSelectedFeature != null) 
							onFeatureUnSelect(lastSelectedFeature); 
						onFeatureSelect(featureList[i][0]);
						lastSelectedFeature = featureList[i][0];
					}
				}
			} 
			
		} else {
			console.log("map.js: latLong is not defined");
			map2.zoomToMaxExtent();
		}
	}
}

var allBoxes = false;

/*
*	\details	Function reads all selected metadata and create ol feature.vector from metadata bounding box.
*				Fill Array 'featureList' and add them to the map
*				featureList[0] - feature
*				featureList[1] - Id List
*				featureList[2] - Bounding Box 
*
*/
function addFeatures_() { 
	var style = {
		strokeColor: '#007C95',
		strokeOpacity: 0.8,
		strokeWidth: 2
	};
	featureList = []; 
	
	//check selected facet value @see exhibitOutputFunctions.js
    var selectedTopics = getTopicSelection(); 
    var selectedDatatypes = getDatatypeSelection(); 
    var selectedOrganizations = getOrganizationSelection();
    var selectedScenarios = getScenarioSelection();
    var selectedHierarchylevelnames = getHierarchylevelnameSelection();
    //preparing database request - order of attributes is important!
    //if no selection is made - a simple "getAll" request is done
    if (selectedTopics == "-" && selectedDatatypes == "-" && selectedOrganizations == "-" && selectedScenarios == "-" && selectedHierarchylevelnames == "-") { 
    	items = httpGet(findAllBBox);
    	allBoxes = true;
    } else { 							   
    	items = httpGet(findMixedBox + "/" + selectedHierarchylevelnames + "/" + selectedTopics + "/" + selectedDatatypes + "/" + selectedOrganizations + "/" + selectedScenarios);
    	allBoxes = true;
    }
	 
    for (var i=0; i < items.length; i++) {
		var latlong = items[i];
		if (latlong){
			if (checkForDuplicate(featureList, latlong)) {	
				var coord = LonLatToPointArray(latlong);
				if (coord != null) {
					var bbox = PointArrayToLineString(coord);
					var idList = [latlong.id];
					featureList.push([new OpenLayers.Feature.Vector(bbox, null, style), idList, latlong.geographicboundingbox]);
					featureList[featureList.length-1][0].MetaID = items[i].id;
			 
					featureList[featureList.length-1][0].box = latlong.geographicboundingbox; //neu 
				}
			}
		}
	}

    if (vector.features.length > 0) {
		vector.removeAllFeatures();
	}
	
	for (var i=0; i < featureList.length; i++) {
		vector.addFeatures(featureList[i][0]);
	}

 	var bounds = vector.getDataExtent();
	map2.addLayer(vector);

	if (bounds != null) {
		map2.zoomToExtent(bounds);
	} else {
		map2.zoomToMaxExtent();
	}
}

/*
*	\details	Function returns the first feature id of a list of feature ids from given parameter
*
*	\param 		FeatureID - Feature ID
*
*	\return 	the first feature id of a list of feature ids
*				null
*/
function getIdFromFeatureId(FeatureID) {
	for (i in featureList) {
		if (FeatureID === featureList[i][0].id) {
			return featureList[i][1][0];
		}
	}
	return null;
}

/*
*	\details	Function returns the bounding box of a featureID
*
*	\param 		id - Feature id
*
*	\return 	bounding box, a string , e.g. '180,60;-180,60;0,0;70,-10'
*/
function getBBoxById(id) {
	for (var i in featureList) {
		if (id == featureList[i][0].id){
			return featureList[i][2];
		}
	}
}

function getFeatureIDListFromFeatureID(FeatureID){
	for (var i in featureList){
		if (FeatureID === featureList[i][0].id){
			return featureList[i][1];
		}
	}
}

/*
*	\details 	Function is called when a feature (ol feature.vector) was selected.
*				Change the color and style of selected feature.
*
*	\param 		feature - the selected ol feature
*/
function onFeatureSelect(feature) {
	//selectOneBox = true;
	if (lastSelectedFeature != null) 
		onFeatureUnSelect(lastSelectedFeature);  
	var selectstyle = {
		strokeColor: "#F9B200",
		strokeWidth: 3,
		strokeOpacity: 0.8
	};

	vector.getFeatureById(feature.id).style = selectstyle;
	if (filterButton == 1) {
		vector.redraw();
	}
}

/*
*	\details	function is called when a feature (ol feature.vector) was unselected.
*				Change the color and style of selected feature.
*
*	\param 		feature - the unselected ol feature
*/
function onFeatureUnSelect(feature) { 
	var style = {
		strokeColor: '#007C95',
		strokeOpacity: 0.8,
		strokeWidth: 2
	};

	if (vector.getFeatureById(feature.id))
		vector.getFeatureById(feature.id).style = style;

	if (vector.selectedFeatures.length === 0) {
		vector.redraw();
	}
}

/*
*	\details	Create three Buttons on the right side of the map
*/
function loadAdditionalMapWidgets() {
	var btnFilter = new OpenLayers.Control.Button({
		displayClass: "btnFilter",
		title: "Set Filter",
		trigger: function() {
			filterButton = 3;
			var bounds = map2.getExtent();
			selectBox(bounds);
		}
	});

	var btnRectangle = new OpenLayers.Control.Button({
		displayClass: "btnRectangle",
		trigger: function() {
			filterButton = 2;
			selectFeature.box = true;
			selectFeature.deactivate();
			selectFeature.activate();	
		},
		title: "Use Rectangle Tool"
	});

	var btnCursor = new OpenLayers.Control.Button({
		displayClass: "btnCursor",
		trigger: function() {
			filterButton = 1;
			selectFeature.box = false;
			selectFeature.deactivate();
			selectFeature.activate();	
		},
		title: "Use Cursor Tool"
	});

	var btnCross = new OpenLayers.Control.Button({
		displayClass: "btnCross",
		trigger: function() {
			selectOneBox = false;
			selectFeature.unselectAll();

			clearAllFilter(); //@see exhibitOutputFunctions
			map2.setCenter( new OpenLayers.LonLat(0, 0).transform(map2.displayProjection, map2.projection), 1);
			
		},
		title: "Unselect All"
	});

	var panel = new OpenLayers.Control.Panel({
		displayClass: "OLpanel"
	});

	panel.addControls([btnCursor, btnRectangle, btnFilter, btnCross]);
	map2.addControl(panel);
	
	if (heatmap) //@see heatmap.js
		addClickListener(panel.id, "MAP");
}

/*
*	\details 	Function add a selectFeature Control to the map.
*				Manage all kinds of modes of selection (single, box) 
*/
function setSelectFeature() {
	selectFeature = new OpenLayers.Control.SelectFeature(vector, {
		onSelect: onFeatureSelect,
		onUnselect: onFeatureUnSelect,
		clickout: true,
		box: true,
		callbacks: {
			'over': function(feature){
				document.getElementById("mapII").style.cursor = "pointer";
			},

			'out': function(feature){
				document.getElementById("mapII").style.cursor = "default";
			}
		}
	
	});

	map2.addControl(selectFeature);
	selectFeature.box = false;
	selectFeature.activate();

	selectFeature.events.register("boxselectionstart", vector, function(evt) {
		if (selectFeature.box) {
			selectFeature.unselectAll(null);
		}
	});

	selectFeature.events.register("boxselectionend", vector, function(evt) { 
		if (selectFeature.box && this.selectedFeatures.length > 0) {
			var selectedFeatureList = []; //id, flaeche
			var bounds = new OpenLayers.Bounds();
			for (var i=0; i<this.selectedFeatures.length; i++) {
				selectedFeatureList.push(this.selectedFeatures[i].id);
				var geometry = this.selectedFeatures[i].geometry;
				bounds.extend(geometry.getBounds());
			}
			vector.redraw();
			createResultView(vector.selectedFeatures);
			map2.setCenter( new OpenLayers.LonLat(0, 0).transform(map2.displayProjection, map2.projection));
			map2.zoomToExtent(bounds);
			filterButton = 1;
			selectFeature.box = false;
			selectFeature.deactivate();
			selectFeature.activate();	
		}
	});

	selectFeature.events.register("featurehighlighted", vector, function(evt) { 
		if (!selectFeature.box && filterButton == 1) {
			var id = getIdFromFeatureId(evt.feature.id);
			if (id != null) {
				createResultView(vector.selectedFeatures);
				var geometry = evt.feature.geometry;
				var bounds = new OpenLayers.Bounds();
				bounds.extend(geometry.getBounds());
				map2.zoomToExtent(bounds);
			}
		}
	});
}

/*
*	\details	Function selects every ol feature.vector that is inside of a bounding box
*
*	\param 		bounds - ol bounds 
*/
function selectBox(bounds) {  
	var selectstyle = {
		strokeColor: "#F9B200",
		strokeWidth: 2,
		strokeOpacity: 0.8
	};

	var selectedFeatureList = [];

	if (vector.selectedFeatures.length > 0) {
		selectFeature.unselectAll(); 
	}

	for (var i=0; i<vector.features.length; i++) {
		var feature = vector.features[i];
		var geometry = feature.geometry;
		var featureBounds = geometry.getBounds();

		if (bounds.containsBounds(featureBounds, true, false)) {		
			vector.selectedFeatures.push(feature);
			vector.getFeatureById(feature.id).style = selectstyle;
			selectedFeatureList.push(feature.id);
		}
	}

	vector.redraw();
	//selectOneBox = true;
	createResultView(vector.selectedFeatures);  
	filterButton = 1;
	selectFeature.box = false;
	selectFeature.deactivate();
	selectFeature.activate();	
}

/*
*	\details 	Create a table with all selected bounding boxes
*
*	\param 		fL - FeatureList, a list containing all selected features ( bounding boxes)
*/
function createResultView(fL) { 
	guiFunctions.showPreloaderCallback().then(function() {	
		var i = 0; 	
		var boxArray = []; //neu 
		
		var counter = setInterval(function() {
			var list = [];
			list.push(getFeatureIDListFromFeatureID(fL[i].id), fL[i]);
			 
			boxArray.push(list[1].box); //neu 
			
			if (i === fL.length - 1) {  
				setBoundingboxSelection(boxArray); //neu 
				selectOneBox = false; //neu
				hidePreloader();
				clearInterval(counter);
			}
			++i;
		}, 1);	
	});	
}

/*
 * \detail		sets collected facet values to facets
 */
//var blockNotification = false;
//function setFacetValues(idsArray) { 
//	var ids = "";
//	for (var i = 0; i < idsArray.length; i++) {
//		if (i > 0) ids += ";" + idsArray[i];
//		else ids += idsArray[i];
//	}
//	
//	blockNotification = true;
//	setOrganizationSelection(httpGet(findAllOrganizationsById + "/" + ids));
//	setTopicSelection(httpGet(findAllTopicsById + "/" + ids));
//	setDatatypeSelection(httpGet(findAllDatatypesById + "/" + ids));	
//	setScenarioSelection(httpGet(findAllScenariosById + "/" + ids));
//	blockNotification = false;
//	setHierarchylevelnameSelection(httpGet(findAllHierarchylevelnamesById + "/" + ids));
//}