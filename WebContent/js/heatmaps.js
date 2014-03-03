var normalHMStore, mapHMStore, T4MHMStore, MVIHMStore, INFHMStore, seaHMStore; //storing click information
var facetScroll = {}, listScroll = {}, tabMDScroll = {}, tabTreeScroll = {}, middleScroll = {}; //getting scroll information
var facetMiddleSplitter = {}, listDetailSplitter = {}, mapFInfoSplitter = {}, mapTimeSplitter = {}, mapListDetailSplitter = {};
var infoMode = false, searchMode = false, metaVizMode = false, time4MapsMode = false; //getting modes for middle frame
var timeStamps = {};
var taskTimes = {}, taskCounter = 1, taskOn = false;

window.onload = function() {
	if (heatmap) {	
		normalHMStore = h337.create({"element":document.getElementById("heatmapArea"), "radius":25, "visible":true});	 
		mapHMStore = h337.create({"element":document.getElementById("MAP_heatmapArea"), "radius":25, "visible":true});		
		T4MHMStore = h337.create({"element":document.getElementById("T4M_heatmapArea"), "radius":25, "visible":true});		
		MVIHMStore = h337.create({"element":document.getElementById("MVI_heatmapArea"), "radius":25, "visible":true});		
		INFHMStore = h337.create({"element":document.getElementById("INF_heatmapArea"), "radius":25, "visible":true});		
		seaHMStore = h337.create({"element":document.getElementById("SEA_heatmapArea"), "radius":25, "visible":true});		
		
		document.getElementById("appTitle").onclick = function(e) {
			if (taskOn) {
				taskTimes[taskCounter + "_off"] = Date.now();				
				alert("data of task " + taskCounter + " recorded.");
				taskOn = false;
				taskCounter++;
			} else {  
				taskTimes[taskCounter + "_on"] = Date.now();
				taskOn = true; 
				alert("start recording data of task " + taskCounter + ".");
			}
		};
		
		document.getElementById("gmf_body").onclick = function(e) { 	 
			timeStamps[Date.now()] = [ e.x, e.y ];
			normalHMStore.store.addDataPoint(e.x, e.y); 
			
			//clicking on search results list window
			if (searchMode) {
				seaHMStore.store.addDataPoint(e.x, e.y);
				
			//clicking on time4maps frame
			//} else if (time4MapsMode) {
				
			//clicking on metaviz frame 	
			} else if (metaVizMode) {
				MVIHMStore.store.addDataPoint(e.x, e.y);
				
			//clicking on one of the info windows
			} else if (infoMode) {
				INFHMStore.store.addDataPoint(e.x, e.y);
				
			//clicking on the boundingbox maps, controls or a boundingbox itself	
			} else if (e.toElement.id.indexOf("OpenLayers") >= 0) {
				mapHMStore.store.addDataPoint(e.x, e.y); 
			//clicking on the info button	
			} else if (e.toElement.id == "info") {
				infoMode = true;
				INFHMStore.store.addDataPoint(e.x, e.y); 
			}
		};
		
		document.getElementById("layerChooser").onclick = function(e) {
			timeStamps[Date.now()] = [ e.x, e.y ];
			normalHMStore.store.addDataPoint(e.x, e.y);
			T4MHMStore.store.addDataPoint(e.x, e.y);
		};
		
		document.getElementById("time4mapsMap").onclick = function(e) {
			timeStamps[Date.now()] = [ e.x, e.y ];
			normalHMStore.store.addDataPoint(e.x, e.y);
			T4MHMStore.store.addDataPoint(e.x, e.y);
		};
		
		document.getElementById("logo").onclick = function(e) {
			
			console.log(JSON.stringify(normalHMStore.store.exportDataSet()));
		    console.log(JSON.stringify(mapHMStore.store.exportDataSet()));
		    console.log(JSON.stringify(T4MHMStore.store.exportDataSet()));
		    console.log(JSON.stringify(MVIHMStore.store.exportDataSet()));
		    console.log(JSON.stringify(INFHMStore.store.exportDataSet()));
		    console.log(JSON.stringify(seaHMStore.store.exportDataSet()));
		    
		    console.log(JSON.stringify(facetScroll));
		    console.log(JSON.stringify(listScroll));
		    console.log(JSON.stringify(tabMDScroll));
		    console.log(JSON.stringify(tabTreeScroll));
		    console.log(JSON.stringify(middleScroll));
		    
		    console.log(JSON.stringify(facetMiddleSplitter));
		    console.log(JSON.stringify(listDetailSplitter));
		    console.log(JSON.stringify(mapFInfoSplitter));
		    console.log(JSON.stringify(mapTimeSplitter));
		    console.log(JSON.stringify(mapListDetailSplitter));
		    
		    console.log(JSON.stringify(taskTimes));
		    console.log(JSON.stringify(timeStamps));
		    
			$.ajax({
				"url" : 'HeatmapController',
				"type" : 'POST',
				"data" : {
					"normal" : JSON.stringify(normalHMStore.store.exportDataSet()),
					"map" : JSON.stringify(mapHMStore.store.exportDataSet()),
					"t4m" : JSON.stringify(T4MHMStore.store.exportDataSet()),
					"mvi" : JSON.stringify(MVIHMStore.store.exportDataSet()),
					"inf" : JSON.stringify(INFHMStore.store.exportDataSet()),
					"sea" : JSON.stringify(seaHMStore.store.exportDataSet()),

					"facetScroll" : JSON.stringify(facetScroll),
					"listScroll" : JSON.stringify(listScroll),
					"tabMDScroll" : JSON.stringify(tabMDScroll),
					"tabTreeScroll" : JSON.stringify(tabTreeScroll),
					"middleScroll" : JSON.stringify(middleScroll),
					 
					"facetMiddleSplitter" : JSON.stringify(facetMiddleSplitter),
					"listDetailSplitter" : JSON.stringify(listDetailSplitter),
					"mapFInfoSplitter" : JSON.stringify(mapFInfoSplitter),
					"mapTimeSplitter" : JSON.stringify(mapTimeSplitter),
					"mapListDetailSplitter" : JSON.stringify(mapListDetailSplitter),
					
					"taskTimes" : JSON.stringify(taskTimes),
					"times" : JSON.stringify(timeStamps)
				}
//					, "success" : function(data, status) { 
//					alert(data);
//					document.getElementById("heatmapArea").style.visibility = "visible";
//				}
			}).done(function( msg ) {
			    alert("heatmap data saved."); 
			    document.getElementById("heatmapArea").style.visibility = "visible";
			  });;
		};
		
		facetPanel.onscroll = function (e) {
			facetScroll[Date.now()] = [ $(facetPanel).scrollTop() ]; 
		};
		listPanel.onscroll = function (e) {
			console.log("list " + $(listPanel).scrollTop());
			listScroll[Date.now()] = [ $(listPanel).scrollTop() ]; 
		};
		document.getElementById("tabMetaData").onscroll = function (e) {
			console.log("tab md " + $(document.getElementById("tabMetaData")).scrollTop());
			tabMDScroll[Date.now()] = [ $(document.getElementById("tabMetaData")).scrollTop() ]; 
		};
		document.getElementById("myTree").onscroll = function (e) {
			console.log("tab tree " + $(document.getElementById("myTree")).scrollTop());
			tabTreeScroll[Date.now()] = [ $(document.getElementById("tabTree")).scrollTop() ]; 
		};
		document.getElementById("map_contentPane").onscroll = function (e) {
			console.log("middle " + $(document.getElementById("map_contentPane")).scrollTop());
			middleScroll[Date.now()] = [ $(document.getElementById("map_contentPane")).scrollTop() ]; 
		};
	}
}; 

function addSplitterChange(splitter) { 
	if (splitter == "facetMiddleSplitter") {
		facetMiddleSplitter[Date.now()] = [ dojo.byId("facetPanel").style.width ];
	} else if (splitter == "listDetailSplitter") {
		listDetailSplitter[Date.now()] = [ dojo.byId("listPanel").style.width ];
	} else if (splitter == "mapFInfoSplitter") {
		mapFInfoSplitter[Date.now()] = [ dojo.byId("map_contentPane").style.width ];
	} else if (splitter == "mapTimeSplitter") {
		mapTimeSplitter[Date.now()] = [ dojo.byId("border-left-top").style.height ];
	} else if (splitter == "mapListDetailSplitter") {
		mapListDetailSplitter[Date.now()] = [ dojo.byId("map_contentPane").style.height ];
	}
}

function addFacetClick(evt) { 
	timeStamps[Date.now()] = [ evt.clientX, evt.clientY ];
	normalHMStore.store.addDataPoint(evt.clientX, evt.clientY);
}

function addCheckboxClick(evt) {
	timeStamps[Date.now()] = [ evt.clientX, evt.clientY ];
	normalHMStore.store.addDataPoint(evt.clientX, evt.clientY);
	T4MHMStore.store.addDataPoint(evt.clientX, evt.clientY);
}

/**
 * Adding a heatmap listener to a html element by using its id
 * 
 * @param id of the html element that should get a listener
 * @param mode the mode, which tools is shown in the main window of GMF //T4M, MAP, MVI, ...
 */
function addClickListener(id, mode) {
	if (mode == "T4M") { 
		document.getElementById(id).onclick = function(e) {
			timeStamps[Date.now()] = [ e.x, e.y ];
			normalHMStore.store.addDataPoint(e.x, e.y);
			T4MHMStore.store.addDataPoint(e.x, e.y);
		};
	} else if (mode == "MAP") { 
		document.getElementById(id).onclick = function(e) {
			timeStamps[Date.now()] = [ e.x, e.y ];
			normalHMStore.store.addDataPoint(e.x, e.y);
			mapHMStore.store.addDataPoint(e.x, e.y);
		};
	}
}

/**
 * Adding a heatmap listener to a html element that doesn't have an id
 * 
 * @param elem the html element that should get a listener
 * @param mode the mode, which tools is shown in the main window of GMF //T4M, MAP, MVI, ...
 */
function addClickListener2(elem, mode) {
	if (mode == "T4M") {  
		elem.onclick = function(e) { 
			timeStamps[Date.now()] = [ e.x, e.y ];
			normalHMStore.store.addDataPoint(e.x, e.y);
			T4MHMStore.store.addDataPoint(e.x, e.y);
		};
	}
}

function get_url_param(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");

	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );

	if (results == null)
		return "";
	else
		return results[1];
}
 