/**
 * Executes searching.
 */
function Search() {}

var searchTable, mapTable;

/**
 * Executes requests to db with search text written by the user.
 * Search requests include selected facet values.
 */
Search.execute = function(searchText) {
		
	//check selected facet value @see exhibitOutputFunctions.js
    var selectedTopics = getTopicSelection(); 
    var selectedDatatypes = getDatatypeSelection(); 
    var selectedOrganizations = getOrganizationSelection();
    var selectedScenarios = getScenarioSelection();
    var selectedHierarchylevelnames = getHierarchylevelnameSelection();
    var selectedBoundingboxes = getBoundingboxSelection(); 
     
    //push all selections into one array
    var selectionCluster = [];
    selectionCluster.push(selectedHierarchylevelnames);
    selectionCluster.push(selectedScenarios);
    selectionCluster.push(selectedTopics);
    selectionCluster.push(selectedDatatypes);
    selectionCluster.push(selectedOrganizations);
    selectionCluster.push(selectedBoundingboxes);
       
    //get results in consideration of user facet selection  
    var resultEntries = httpGet(findSimilarLimited + "/" + searchText + "/" + selectedHierarchylevelnames + "/" + selectedTopics + "/" + selectedDatatypes + "/" + selectedOrganizations + "/" + selectedScenarios);
    var resultScenarios = httpGet(findSimilarScenarioValues + "/" + searchText + "/" + selectedHierarchylevelnames + "/" + selectedTopics + "/" + selectedDatatypes + "/" + selectedOrganizations);
    var resultHvls = httpGet(findSimilarHierarchylevelnameValues + "/" + searchText + "/" + selectedScenarios + "/" + selectedTopics + "/" + selectedDatatypes + "/" + selectedOrganizations);
    var resultTopics = httpGet(findSimilarTopiccategoryValues + "/" + searchText + "/" + selectedScenarios + "/" + selectedHierarchylevelnames + "/" + selectedDatatypes + "/" + selectedOrganizations);
    var resultDatatypes = httpGet(findSimilarDatatypeValues + "/" + searchText + "/" + selectedScenarios + "/" + selectedHierarchylevelnames + "/" + selectedTopics + "/" + selectedOrganizations);
    var resultOrganizations = httpGet(findSimilarOrganizationValues + "/" + searchText + "/" + selectedScenarios + "/" + selectedHierarchylevelnames + "/" + selectedTopics + "/" + selectedDatatypes);
    
    //push all results into one array
    var resultCluster = [];
    resultCluster.push(resultHvls);
    resultCluster.push(resultScenarios);
    resultCluster.push(resultTopics);
    resultCluster.push(resultDatatypes);
    resultCluster.push(resultOrganizations);
    resultCluster.push(resultEntries);
    
    //get results without consideration of user facet selection
    var resultWSEntries = httpGet(findSimilarLimited + "/" + searchText + "/-/-/-/-/-");
    var resultWSScenarios = httpGet(findSimilarScenarioValues + "/" + searchText + "/-/-/-/-");
    var resultWSHvls = httpGet(findSimilarHierarchylevelnameValues + "/" + searchText + "/-/-/-/-");
    var resultWSTopics = httpGet(findSimilarTopiccategoryValues + "/" + searchText + "/-/-/-/-");
    var resultWSDatatypes = httpGet(findSimilarDatatypeValues + "/" + searchText + "/-/-/-/-");
    var resultWSOrganizations = httpGet(findSimilarOrganizationValues + "/" + searchText + "/-/-/-/-");
      
    //push all results into one array
    var resultWSCluster = [];
    resultWSCluster.push(resultWSHvls);
    resultWSCluster.push(resultWSScenarios);
    resultWSCluster.push(resultWSTopics);
    resultWSCluster.push(resultWSDatatypes);
    resultWSCluster.push(resultWSOrganizations);
    resultWSCluster.push(resultWSEntries);

    //display results
    displayResultOverview(resultCluster, resultWSCluster, selectionCluster, searchText); 
};

function displayResultOverview(data, dataWS, selectionCluster, searchText) {
	require(["dojo/dom-construct", "dijit/form/Button", "dijit/layout/TabContainer", "dijit/layout/ContentPane", "dojo/domReady!"], function(domConstruct, Button, TabContainer, ContentPane) {
		
		//Body + Header ---------------------------------------------------------------------
		var globalBody = domConstruct.create("div", {
			id: "Dialog_body",
			style: "width: 100%;"
		});

		domConstruct.create("div", {
			innerHTML: "Choose the preferred result",
			style: "width: 100%; margin-bottom: 20px;font-size: 14px; color: #007C95; text-align: center;"
		}, globalBody);
		 
		var bodyWS = domConstruct.create("div", {
			id: "innerBodyWS",
			style: "width: 100%;"
		}, globalBody);
		 
	    //-----------------------------------------------------------------------------------
//	    createTable(data, selectionCluster, body, domConstruct, Button, searchText);
	    createTable(dataWS, null, bodyWS, domConstruct, Button, searchText);
	    
		darkDarkerDarkest(globalBody);
	});
}

function createTable(data, selectionCluster, body, domConstruct, Button, searchText) {
    //Table with results ----------------------------------------------------------------
	var widget = domConstruct.create("table", {
		id: "SearchResults",
		style: "width: 100%;"
	}, body);
	
	searchTable = widget;
		 
	//Fill table with results -----------------------------------------------------------		
	for (var i = 0; i < data.length; i++) {
		if (i == 0) facetName = hierarchylevelnameFacet;
		else if (i == 1) facetName = scenarioFacet;
		else if (i == 2) facetName = topicFacet;
		else if (i == 3) facetName = datatypeFacet;
		else if (i == 4) facetName = organizationFacet;
		else facetName = "";
	 
		if (data[i] && data[i].length > 0) { 
			createRow(facetName, data[i], selectionCluster, domConstruct, widget, searchText);
		}
	}
	
	var mapResults = GeoNames.body;
	mapTable = mapResults.childNodes[0];
	body.appendChild(mapResults);
	
	//Buttons ---------------------------------------------------------------------------	
	var okBTN = domConstruct.create("div", {
		style: "width: 100%; height: 30px;"
	}, body);
	
	var cancelBTN = domConstruct.create("div", {
		style: "width: 100%; height: 30px;"
	}, body);
	
	new Button({
		label: "OK",
		onClick: function() {
			//Facet and details results
			for (var i = 0; i < widget.rows.length; i++) {
				var row = widget.rows[i];
				if (row.style.backgroundColor === "rgba(0, 124, 149, 0.2)") { 
					updateFacetsAndResultlist(row, selectionCluster);	 
				}
			} 
			//GeoNames results
			for (var i = 0; i < mapTable.rows.length; i++) {
				var row = mapTable.rows[i];
				if (row.style.backgroundColor === "rgba(0, 124, 149, 0.2)") {
					
					var LatLongFcode = row.cells[0].id.split(":"); 
					map2.setCenter(new OpenLayers.LonLat(Number(LatLongFcode[1]), Number(LatLongFcode[0])).transform(map2.displayProjection, map2.projection), manageLevelOfZoom(LatLongFcode[2]));
					
				}
			}

			require(["dijit/registry"], function(registry) {
				var dialog = registry.byId("SearchResultOverview");
				dialog.hide();
			});  
		} 
	}, okBTN);

	new Button({
		label: "Cancel",
		onClick: function() {
			require(["dijit/registry"], function(registry) {
				var dialog = registry.byId("SearchResultOverview");
				dialog.hide();
			});
		}
	}, cancelBTN);
}

/**
 * Create a row for each facet and each result belonging to this facet.
 * 
 * Method is called for each facet (entry in selectionCluster) - one call creates 
 * all rows for one facet. 
 * 
 * @param facetName - facetName
 * @param data - result list (entries that match the query)
 * @param selectionCluster - summarizes all selected facet values ordered by facet
 * @param domConstruct - to create new dom elements, e.g. table/row
 * @param widget - to add the rows 
 */
function createRow(facetName, data, selectionCluster, domConstruct, widget, searchText) {	
	var trHead = domConstruct.create("tr", {
		style: "background-color: #FFFFFF;",
	}, widget);

	var singleResults = false; 
	if (facetName == "") { 
		singleResults = true;
	} 
	
	for (var i = 0; i < data.length; i++) {
		if (singleResults) facetName = data[i].id;
		
		var tr = domConstruct.create("tr", {
			id : facetName,
			style: "background-color: #FFFFFF;border-top:1px solid gray;",
			ondblclick: function() {  //dbl click to select
				for (var i = 0; i < widget.rows.length; i++) {
					var row = widget.rows[i];
					if (row.style.backgroundColor === "rgba(0, 124, 149, 0.2)") {						 
						updateFacetsAndResultlist(row, selectionCluster);
					}
				}

				require(["dijit/registry"], function(registry) {
					var dialog = registry.byId("SearchResultOverview");
					dialog.hide();
				});
			},

			onclick: function() { 		
				for (var i = 0; i < widget.rows.length; i++) {
					row = widget.rows[i];  
					row.style.backgroundColor = "#fff";
				} 
				
				//map results - resetting colors
				for (var i = 0; i < mapTable.rows.length; i++) {
					row = mapTable.rows[i]; 
					row.style.backgroundColor = "#fff";
				}	
				
				this.style.backgroundColor = "rgba(0,124,149,0.2)"; 
			}
		}, widget);
		  
		tr.style.backgroundColor = "#fff";
	 
		//fill the list with results
		if (facetName == scenarioFacet || facetName == hierarchylevelnameFacet || facetName == topicFacet || facetName == datatypeFacet || facetName == organizationFacet) {
			var re = new RegExp(searchText, 'ig');
			var highlighted = data[i].replace(re, "<b>" + searchText + "</b>");
			domConstruct.create("td", { id: data[i], innerHTML: highlighted + "<br>Facet: " + facetName, style: { cursor: "pointer" }  }, tr);
		} else { 
			var re = new RegExp(searchText,'ig');
			var highlighted = data[i].label.replace(re, "<b>" + searchText + "</b>");
			domConstruct.create("td", { id: data[i], innerHTML: highlighted + "<br>Data type: " + data[i].datatype + "<br>" + data[i].description, style: { cursor: "pointer" } }, tr);
		}	 
	}		 
}

/**
 * After the user has chosen a result, this method is called.
 * It updates all facets and the result list.
 * 
 * @param row - the selected row
 */
function updateFacetsAndResultlist(row, selectionCluster) {
	if (row.id == topicFacet) { 
		selectedValue = row.cells[0].id; 
		
		var selected = new Object();
		selected[selectedValue] = true;
		
		exhibit._registry._registry.facet.f3._valueSet._count = 1;
		exhibit._registry._registry.facet.f3._valueSet._hash = selected; 
		exhibit._registry._registry.facet.f3._notifyCollection();
		
	} else if (row.id == datatypeFacet) { 
		selectedValue = row.cells[0].id; 
		
		var selected = new Object();
		selected[selectedValue] = true;
		
		exhibit._registry._registry.facet.f2._valueSet._count = 1;
		exhibit._registry._registry.facet.f2._valueSet._hash = selected; 
		exhibit._registry._registry.facet.f2._notifyCollection();
		
	} else if (row.id == organizationFacet) { 
		selectedValue = row.cells[0].id; 
		
		var selected = new Object();
		selected[selectedValue] = true;
		
		exhibit._registry._registry.facet.f4._valueSet._count = 1;
		exhibit._registry._registry.facet.f4._valueSet._hash = selected; 
		exhibit._registry._registry.facet.f4._notifyCollection();
		
	} else if (row.id == scenarioFacet) { 
		selectedValue = row.cells[0].id; 
		
		var selected = new Object();
		selected["value"] = selectedValue;
		
		exhibit._registry._registry.facet.f1._selections = [selected]; 
		exhibit._registry._registry.facet.f1._notifyCollection();

	} else if (row.id == hierarchylevelnameFacet) { 
		selectedValue = row.cells[0].id; 
		
		var selected = new Object();
		selected["value"] = selectedValue;
		
		exhibit._registry._registry.facet.f0._selections = [selected]; 
		exhibit._registry._registry.facet.f0._notifyCollection();

	} else { 
		//single entry selected
		
		//clear facet selection
		if (!selectionCluster) {
			exhibit._registry._registry.facet.f0._selections = {};
			exhibit._registry._registry.facet.f0._notifyCollection();
			
			exhibit._registry._registry.facet.f1._selections = {};
			exhibit._registry._registry.facet.f1._notifyCollection();
			
			exhibit._registry._registry.facet.f2._valueSet._count = 0;
			exhibit._registry._registry.facet.f2._valueSet._hash = {};
			exhibit._registry._registry.facet.f2._notifyCollection();
			
			exhibit._registry._registry.facet.f3._valueSet._count = 0;
			exhibit._registry._registry.facet.f3._valueSet._hash = {};
			exhibit._registry._registry.facet.f3._notifyCollection();
			
			exhibit._registry._registry.facet.f4._valueSet._count = 0;
			exhibit._registry._registry.facet.f4._valueSet._hash = {};
			exhibit._registry._registry.facet.f4._notifyCollection();
		}
		
		//fill detailed view -> general metadata and tree
		selectedValue = row.cells[0].id;    
		guiFunctions.setItemDetails(row.id);	
		 
	}	
}

/**
*\details	this method pops up a dijit dialog which display the search results in a table
*\author		Hannes Tressel
*\param		widget	content element
*/
function darkDarkerDarkest(widget) {
	require(["dijit/Dialog", "dojo/window", "dijit/registry", "dojo/on", "dojo/keys"], function(dialog, window, registry, on, keys){
		var browserSize = window.getBox();
		
		if (registry.byId("SearchResultOverview")) {
			registry.byId("SearchResultOverview").destroyRecursive();
		}

		var dialogWidget = new dialog({
			id: "SearchResultOverview",
			title: "Results",
			autofocus: false,
			style: "width:"+(browserSize.w*80)/100+"px; height:"+(browserSize.h*60)/100+"px;",
			content: widget
		});
		dialogWidget.show();
		
		if (heatmap) {
			searchMode = true;
			dialogWidget.connect(dialogWidget, "hide", function(e){			   
			    searchMode = false;
			});
		}
	});
}