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

var currentTabularViewItems;
var projectLoaded = false;
var scenarioLoaded = false;

/**
 * gets current items of tabular view
 * 
 * items consist of Id and sortKey; only id is interesting
 * @param items
 */
function getItemsOfTabularView(items) {
	if (!selectOneBox)
		currentTabularViewItems = items;
}

/**
 * Method to connect noSQL database
 * 
 * @param requestDetail - metadata filter
 * @returns {String}
 */
function httpGet(requestDetail) {  
	var requestUrl = dbHost + requestDetail;
	var response = "";
	//console.log("hier: " +requestDetail);
	$.ajax({
	    type: "GET",
	    async: false,   
	    url: 'HSQLController', 
	    dataType: "json",
	    data: {
	    	data: requestDetail
	    }, 
	    success: function(msg) { 
	    	response = msg; 
	    	if (requestDetail == findAllIds) {
	    		//initial setting of no. of items and filtered items
	    		allItemsCount = response.length;	    		
	    	}	 
	    	
	    	if (requestUrl.indexOf("Box") < 0)
	    		//set no of filtered values //skip bbox request, because duplicates are eliminated
	    		filteredItemsCount = response.length;
	    },
	    error: function(err) {  
		    if (err.status == 200) {
			     
		    } else { console.log('Error:' + err.responseText + '  Status: ' + err.status); }		    
		    response = err.responseText; 
	    }
	});
	
	return response;
}

/**
 * Method to get registry files
 * 
 * @param fileUrl - link with full file name (e.g. http://myspace.de/registry.json)
 * @returns {String}
 */
function httpGetJSON(fileUrl) { 
	var response = "";
	$.ajax({
	    type: "GET",
	    async: false,
	    url: fileUrl, 
	    dataType: "json",
	    success: function(msg) { 
	    	response = msg;	    	
	    },
	    error: function(err) { 
//		    if (err.status == 200) { 
//			    console.log(err); 
//		    } else { 
//		    	console.log('Error:' + err.responseText + '  Status: ' + err.status);
//		    }
	    }
	});
	return response; 
}

/**
 * Method to get number of all metadata entries.
 * 
 * @returns {Number} number of all metadata entries in db
 */
function getAllItemsCount() {
	return allItemsCount;
}

/**
 * Method to reset all facets. (deselect everything)
 */
function clearAllFilter() {
	exhibit._registry._registry.facet.f0.clearAllRestrictions();
	exhibit._registry._registry.facet.f1.clearAllRestrictions();
	exhibit._registry._registry.facet.f2.clearAllRestrictions();
	exhibit._registry._registry.facet.f3.clearAllRestrictions();
	exhibit._registry._registry.facet.f4.clearAllRestrictions();
	exhibit._registry._registry.facet.f5.clearAllRestrictions();
}

/**
 * Method to reset hidden boundingbox facet selection, which is set by map changes.
 */
function clearBoundingBoxFilter() {
	exhibit._registry._registry.facet.f5.clearAllRestrictions();
}

/**
 * Method to get selected items of facet topic.
 * 
 * @returns {String} selected topic facet values, separated with ;
 */
function getTopicSelection() {
	var selectedTopics = ""; //topics as string, separated with ";"
	if (typeof fixedTopic != "undefined" && fixedTopic != "") {
		selectedTopics = fixedTopic;
		list = selectedTopics.split("..");
		require(["dojo/html", "dojo/dom", "dojo/domReady!"],
			function(html, dom, on) {
				text = "<div><span class='exhibit-facet-header-title'>selected Thematic categorization</span></div><table>";
				for (var i = 0; 0 < list.length; i++) {
					if (list[i] == undefined) break;
					text += "<tr><td>" + list[i] + "</td></tr>";			
				}
				text += "</table>";
			    html.set(dom.byId("f3"), text);
			});
		
		return selectedTopics;
	}
	//check selected topics
    if (exhibit._registry._registry.facet.f3 != null && exhibit._registry._registry.facet.f3._valueSet._count > 0) {
	    //list selected facet values as { value1: true, value2: true }
	    var valueObj = exhibit._registry._registry.facet.f3._valueSet._hash; 
	    for (property in valueObj) {
	    	selectedTopics += property + ";";
	    } 
	    selectedTopics = selectedTopics.substring(0, selectedTopics.length-1);	    
    } 
    if (selectedTopics == "") selectedTopics = "-"; 
    return selectedTopics;
}  

/**
 * Method to set selected values for the facet topic categories
 * 
 * @param topicArray - array of facet value that should be selected
 */
function setTopicSelection(topicArray) { 
	var selection = new Object();	
	if (exhibit._registry._registry.facet.f3 != null) {
		for (var i = 0; i < topicArray.length; i++) {
			selection[topicArray[i]] = true; 
			exhibit._registry._registry.facet.f3.setSelection(topicArray[i], true);
		}  		
		if (exhibit._registry._registry.facet.f3._valueSet._hash != null) { 
			exhibit._registry._registry.facet.f3._notifyCollection();
		}
	}
}

/**
 * Method to get selected items of facet datatype.
 * 
 * @returns {String} selected datatype facet values, separated with ;
 */
function getDatatypeSelection() {
	var selectedDatatypes = ""; //data types as string, separated with ";"
	if (typeof fixedDataType != "undefined" && fixedDataType != "") {
		selectedDatatypes = fixedDataType;
		selectedDatatypes = replaceAll( "&#45;","-",selectedDatatypes);
		list = selectedDatatypes.split("..");
		require(["dojo/html", "dojo/dom", "dojo/domReady!"],
			function(html, dom, on) {
				text = "<div><span class='exhibit-facet-header-title'>selected Resources</span></div><table>";
				for (var i = 0; 0 < list.length; i++) {
					if (list[i] == undefined) break;     
					text += "<tr><td>" + list[i] + "</td></tr>";			
				}
				text += "</table>";
			    html.set(dom.byId("f2"), text);
			});
		selectedDatatypes = replaceAll("\\.\\.",";",selectedDatatypes);
		console.log(selectedDatatypes);
		return selectedDatatypes;
	}
    //check selected data types
    if (exhibit._registry._registry.facet.f2 != null && exhibit._registry._registry.facet.f2._valueSet._count > 0) {
	    //list selected facet values as { value1: true, value2: true }
	    var valueObj = exhibit._registry._registry.facet.f2._valueSet._hash;
	    
	    for (property in valueObj) {
	    	selectedDatatypes += property + ";";
	    } 
	    selectedDatatypes = selectedDatatypes.substring(0, selectedDatatypes.length-1);	    
    } 
    if (selectedDatatypes == "") selectedDatatypes = "-";
    return selectedDatatypes;
}  

/**
 * Method to set selected values for the facet datatypes
 * 
 * @param datatypeArray - array of facet values that should be selected
 */
function setDatatypeSelection(datatypeArray) { 
	var selection = new Object();
	
	if (exhibit._registry._registry.facet.f2 != null) {
		for (var i = 0; i < datatypeArray.length; i++) {
			selection[datatypeArray[i]] = true; 
			exhibit._registry._registry.facet.f2.setSelection(datatypeArray[i], true);
		}   		
		if (exhibit._registry._registry.facet.f2._valueSet._hash != null) { 
			exhibit._registry._registry.facet.f2._notifyCollection();
		}
	}
}

/**
 * Method to get selected items of facet datatype.
 * 
 * @returns {String} selected boundingbox facet values, separated with <(!), because ; is already just in lat lon coding xx,yy;xx,yy
 */
function getBoundingboxSelection() {
	//check selected boundingboxes
    var selectedBoundingboxes = ""; //organizations as string, separated with ";"
    if (exhibit._registry._registry.facet.f5 != null && exhibit._registry._registry.facet.f5._valueSet._count > 0) {
	    //list selected facet values as { value1: true, value2: true }
	    var valueObj = exhibit._registry._registry.facet.f5._valueSet._hash; 
	    for (property in valueObj) {
	    	selectedBoundingboxes += property + "<";
	    } 
	    selectedBoundingboxes = selectedBoundingboxes.substring(0, selectedBoundingboxes.length-1);	    
    } 
    if (selectedBoundingboxes == "") selectedBoundingboxes = "-";
    return selectedBoundingboxes;
}

/**
 * Method to set selected values for the hidden facet boundingboxes
 * 
 * @param boundingboxArray - array of facet values that should be selected
 */
var blockBoxUpdate = false;
function setBoundingboxSelection(boundingboxArray) {  
	exhibit._registry._registry.facet.f5._valueSet._count = 0;
	exhibit._registry._registry.facet.f5._valueSet._hash = {};
	
	var selection = new Object();

	if (exhibit._registry._registry.facet.f5 != null) {
		blockBoxUpdate = true;
		for (var i = 0; i < boundingboxArray.length; i++) {
			selection[boundingboxArray[i]] = true;  
			exhibit._registry._registry.facet.f5.setSelection(boundingboxArray[i], true);
		} 
		
		blockBoxUpdate = false; 
		if (exhibit._registry._registry.facet.f5._valueSet._hash != null) { 
			exhibit._registry._registry.facet.f5._notifyCollection();
		} 
	}
}

/**
 * Method to get selected items of facet organization.
 * 
 * @returns {String} selected organization facet values, separated with ;
 */
function getOrganizationSelection() {
	var selectedOrganizations = ""; //organizations as string, separated with ";"
	if (typeof fixedOrganization != "undefined" && fixedOrganization!=""){
		selectedOrganizations = fixedOrganization;		
		list = selectedOrganizations.split("..");
		require(["dojo/html", "dojo/dom", "dojo/domReady!"],
			function(html, dom, on) {
				text = "<div><span class='exhibit-facet-header-title'>selected Organization</span></div><table>";
				for (var i = 0; 0 < list.length; i++) {
					if (list[i] == undefined) break;
					text += "<tr><td>" + list[i] + "</td></tr>";			
				}
				text += "</table>";
			    html.set(dom.byId("f4"), text);
			});
		return selectedOrganizations;
	} 
    //check selected organizations
    if (exhibit._registry._registry.facet.f4 != null && exhibit._registry._registry.facet.f4._valueSet._count > 0) {
	    //list selected facet values as { value1: true, value2: true }
	    var valueObj = exhibit._registry._registry.facet.f4._valueSet._hash;
	   
	    for (property in valueObj) {
	    	selectedOrganizations += property + ";";
	    } 
	    selectedOrganizations = selectedOrganizations.substring(0, selectedOrganizations.length-1);	    
    } 
    if (selectedOrganizations == "") selectedOrganizations = "-";
    return selectedOrganizations;
}

/**
 * Method to set selected values for the facet organizations
 * 
 * @param organizationArray - array of facet values that should be selected
 */
function setOrganizationSelection(organizationArray) { 
	var selection = new Object();
	if (exhibit._registry._registry.facet.f4 != null) {
		for (var i = 0; i < organizationArray.length; i++) {
			selection[organizationArray[i]] = true;  
			exhibit._registry._registry.facet.f4.setSelection(organizationArray[i], true);
		}
//		exhibit._registry._registry.facet.f4._valueSet._hash = selection;  		
//		if (exhibit._registry._registry.facet.f4._valueSet._hash != null) { 
//			exhibit._registry._registry.facet.f4._notifyCollection();
//		} 
	}
}

/**
 * Method to get selected items of facet scenarios.
 * 
 * @returns {String} selected scenario facet values, separated with ;
 */
var selectedScenarios = ""; //scenario as string, separated with ";"
function getScenarioSelection() {
	if (typeof fixedScenario != "undefined" && fixedScenario != "") {
		selectedScenarios = fixedScenario;
		list = selectedScenarios.split("..");
		require(["dojo/html", "dojo/dom", "dojo/domReady!"],
			function(html, dom, on) {
				text = "<div><span class='exhibit-facet-header-title'>selected Scenarios or storylines</span></div><table>";
				for (var i = 0; 0 < list.length; i++) {
					if (list[i] == undefined) break;     
					text += "<tr><td>" + list[i] + "</td></tr>";			
				}
				text += "</table>";
			    html.set(dom.byId("f1"), text);
			});
		selectedScenarios = replaceAll("\\.\\.",";",selectedScenarios);
		return selectedScenarios;
	}
    //check selected scenarios
    if (scenarioUpdateFlag) {
    	selectedScenarios = "";
	    if (exhibit._registry._registry.facet.f1 != null && exhibit._registry._registry.facet.f1._selections.length > 0) {
		    //list selected facet values as { value1: true, value2: true }
		    var valueObj = exhibit._registry._registry.facet.f1._selections;
		    for (var i = 0; i < valueObj.length; i++) {  
		    	childrenNames = "";
		    	selectedScenarios += getDeepestChildren(valueObj[i].value, getScenarioTree());
		    } 
		    if (selectedScenarios.charAt(selectedScenarios.length-1) == ";")
		    	selectedScenarios = selectedScenarios.substring(0, selectedScenarios.length-1);	    
	    } 
	    if (selectedScenarios == "") selectedScenarios = "-"; 
	    scenarioUpdateFlag = false;
    }
	return selectedScenarios;
}

/**
 * Method to set selected values for the facet scenarios and storylines
 * 
 * @param scenarioArray - array of facet values that should be selected
 */
function setScenarioSelection(scenarioArray) { 
	var selection = [];
	
	if (exhibit._registry._registry.facet.f1 != null) {
		for (var i = 0; i < scenarioArray.length; i++) {
			var selected = new Object();
			selected["value"] = scenarioArray[i];
			selection.push(selected);
		}    
		exhibit._registry._registry.facet.f1._selections = selection; 
//		exhibit._registry._registry.facet.f1._notifyCollection(); 
	}
}

//TODO: check - is this still in use?
/**
 * Method to set the number of available scenarios
 * 
 * @param scenCounts
 */
function setScenarioCounts(scenCounts) {
	scenarioCounts = scenCounts;
}

/**
 * Method to get the number of available scenarios
 * 
 * @param scen - name of the scenario
 * @returns number of the scenario
 */
function getScenarioCounts(scen) { 
	for (var i = 0; i < scenarioCounts.length; i++) { 
		if (scen == scenarioCounts[i].scen)
			return scenarioCounts[i].count;
	}
	return 0;
} 

/**
 * Method to get all scenarios as one string, separated with ;
 * 
 *  @returns {String} scenario names, separated with ;
 */
var _scenarioNames = "";
function getScenarioTreeNames() {
	var tree = getScenarioTree();
	if (_scenarioNames == "") {
		_scenarioNames = traverseChildrenNames(tree);
		if (_scenarioNames.charAt(_scenarioNames.length-1) == ";")
			_scenarioNames = _scenarioNames.substring(0, _scenarioNames.length-1);
	}
	 
	return _scenarioNames;	
}

/**
 * Method to get selected items of facet hierarchylevelname.
 * 
 * @returns {String} selected scenario facet values, separated with ;
 */
var selectedHierarchylevelnames = ""; //scenario as string, separated with ";"
function getHierarchylevelnameSelection() {
	if (typeof fixedHierarchylvl != "undefined" && fixedHierarchylvl != "") {
		selectedHierarchylevelnames = fixedHierarchylvl;		
		list = selectedHierarchylevelnames.split("..");
		require(["dojo/html", "dojo/dom", "dojo/domReady!"],
			function(html, dom, on) {
				text = "<div><span class='exhibit-facet-header-title'>selected Sustainable Land Management</span></div><table>";
				for (var i = 0; 0 < list.length; i++) {
					if (list[i] == undefined) break;     
					text += "<tr><td>" + list[i] + "</td></tr>";			
				}
				text += "</table>";
			    html.set(dom.byId("f0"), text);
			});
		selectedHierarchylevelnames = replaceAll("\\.\\.",";",selectedHierarchylevelnames);
		return selectedHierarchylevelnames;
	}
	if (projectUpdateFlag) {
		selectedHierarchylevelnames = "";
	    //check selected hierarchylevels
	    if (exhibit._registry._registry.facet.f0 != null && exhibit._registry._registry.facet.f0._selections.length > 0) {
		    //list selected facet values as { value1: true, value2: true }
		    var valueObj = exhibit._registry._registry.facet.f0._selections; 
		    for (var i = 0; i < valueObj.length; i++) {
		    	childrenNames = "";
		    	selectedHierarchylevelnames += getDeepestChildren(valueObj[i].value, getProjectTree());
		    } 
		    if (selectedHierarchylevelnames.charAt(selectedHierarchylevelnames.length-1) == ";") {
		    	selectedHierarchylevelnames = selectedHierarchylevelnames.substring(0, selectedHierarchylevelnames.length-1);	      
		    }
	    }
	    if (selectedHierarchylevelnames == "") selectedHierarchylevelnames = "-";
	    projectUpdateFlag = false;
	}
	return selectedHierarchylevelnames;
}

/**
 * Method to set selection of the project facet
 * 
 * @param hierarchylevelnameArray - array of projects that should be selected
 */
function setHierarchylevelnameSelection(hierarchylevelnameArray) { 
	var selection = []; 
	if (exhibit._registry._registry.facet.f0 != null) {
		for (var i = 0; i < hierarchylevelnameArray.length; i++) {
			var selected = new Object();
			selected["value"] = hierarchylevelnameArray[i];
			selection.push(selected);
		}    
		exhibit._registry._registry.facet.f0._selections = selection; 
//		exhibit._registry._registry.facet.f0._notifyCollection(); 
	}
}

/**
 * Method to set the number of available projects
 * 
 * @param hvlCounts - number of available projects
 */
function setHierarchylevelnameCounts(hvlCounts) {
	hierarchylevelnameCounts = hvlCounts;
}

/**
 * Method to get the number of available projects
 * 
 * @param hvl - name of the project
 * @returns number of the project
 */
function getHierarchylevelnameCounts(hvl) { 
	for (var i = 0; i < hierarchylevelnameCounts.length; i++) { 
		if (hvl == hierarchylevelnameCounts[i].hvl)
			return hierarchylevelnameCounts[i].count;
	}
	return 0;
} 

/**
 * Method to get all projects as one string, separated with ;
 * 
 *  @returns {String} project names, separated with ;
 */
var _projectNames = "";
function getProjectTreeNames() {
	var tree = getProjectTree();
	if (_projectNames == "") {
		_projectNames = traverseChildrenNames(tree);
		if (_projectNames.charAt(_projectNames.length-1) == ";")
			_projectNames = _projectNames.substring(0, _projectNames.length-1);
	}
	return _projectNames;	
}

/**
 * Help method to traverse the project/scenario hierarchy of the registries and get the names, separated with ;
 * 
 * @param tree - the hierarchy as object
 * @returns {String} names of all children and their children in the tree, separated with ;
 */
function traverseChildrenNames(tree) {
	var names = tree.name + ";";
	for (var i = 0; (tree.children != null && i < tree.children.length); i++) 	
		names += traverseChildrenNames(tree.children[i]);	  
	return names;
}
 
/**
 * Method to read the registry json file and return a project tree object
 * 
 * @returns the project tree object as json object with children in arrays
 */
function getProjectTree() { 
	if (!projectLoaded){
		projectLoaded=true;
		projectTree = httpGetJSON(projectRegistryUrl);
		if (projectTree instanceof Object) {
			console.log("Project tree loaded as object."); 
		} else {
			console.log("Project tree loaded as string.");
			projectTree = $.parseJSON(projectTree);
		} 	
	}
	return projectTree[0];
}
 
/**
 * Method to read the registry json file and return a tree object
 * 
 * @returns the scenario tree object as json object with children in arrays
 */
function getScenarioTree() {
	if(!scenarioLoaded){
		scenarioLoaded=true;
		scenarioTree = httpGetJSON(scenarioRegistryUrl);
		if (scenarioTree instanceof Object) {
			console.log("Scenario tree loaded as object.");
		} else {
			console.log("Scenario tree loaded as string.");
			scenarioTree = $.parseJSON(scenarioTree);
		}
	}
	return scenarioTree[0]; 
}

/**
 * Help method to get "leafs" of the hierarchy tree. Returns children that do not have own children as string
 * 
 * @ return {String} children without own children, separated with ;
 */
var childrenNames = "";
function getDeepestChildren(selected, tree) {	
	var children = tree.children; 
	
	if (children != null && children.length > 0) {
		for (var i = 0; i < children.length; i++) { 
			//node has children + is selected -> add children names + evaluate children
			if (selected == tree.name) { 
				if (childrenNames.indexOf(children[i].name + ";") < 0)
					childrenNames += children[i].name + ";"; 
		
				getDeepestChildren(children[i].name, children[i]); 
			//node is not selected -> evaluate children	
			} else {
				//select != children[i] -> check children of children[i]  
				getDeepestChildren(selected, children[i]);
				 
			}		
		}
	//node has no children + is selected -> add children names
	} else if (selected == tree.name && childrenNames.indexOf(selected) < 0) {
		if (childrenNames.indexOf(selected + ";") < 0)
			childrenNames += selected + ";";
	}  
	return childrenNames;
}

/**
 * Method to get names of a children array
 * 
 * @param children - array of children objects
 * @returns {String} names of the children, separated with ;
 */
function getChildNames(children) {
	var names = "";
	
	for (var i = 0; i < children.length; i++)
		names += children[i].name + ";";
	
	names = names.substring(0, names.length-1); 
	return names;
}

var hierarchyInits;
var scenarioInits;
var datatypeInits;
var organizationInits;
var topicInits;

/**
 * Method to store init values of the facets (for a better performance in case of "resetting" all facets)
 * 
 * @param facet - name of the facet @see facet names below
 * @param obj - initial facet values to store
 */
function setInitValues(facet, obj) {
	if (hierarchylevelnameFacet == facet) hierarchyInits = obj;
	else if (scenarioFacet == facet) scenarioInits = obj;
	else if (datatypeFacet == facet) datatypeInits = obj;
	else if (organizationFacet == facet) organizationInits = obj;
	else if (topicFacet == facet) topicInits = obj;
}

/**
 * Method to get initial facet values and perform a fast reset of all facets
 * 
 * @param facet - name of the facet
 * @returns initial values for the chosen facet
 */
function getInitValues(facet) {
	if (hierarchylevelnameFacet == facet) return hierarchyInits;
	else if (scenarioFacet == facet) return scenarioInits;
	else if (datatypeFacet == facet) return datatypeInits;
	else if (organizationFacet == facet) return organizationInits;
	else if (topicFacet == facet) return topicInits;
}

//---------------------------------------------------------------------------
//-- CONSTANTS --------------------------------------------------------------
//---------------------------------------------------------------------------

var dbHost = "http://141.30.100.165:3000/metadata/"; 
var scenarioRegistryUrl = "././registries/glues_registry_scenarios.json"; 
var projectRegistryUrl = "././registries/glues_registry_projects.json";

var projectTree;
var hierarchylevelnameCounts;
var scenarioTree;
var scenarioCounts; 

//REST DB INTERFACE CALLs
var findAllIds = "findAllIds";
var findOne = "findOne";

var findAllBBox = "findAllBBox";
var findMixedBox = "findMixedBox";

var topicFacet = "topiccategory";
var findAllTopics = "findAllTopiccategories"; 
var findAllTopicsById = "findAllTopiccategoriesById";
var countAllTopiccategories = "countAllTopiccategories";
var themeFacet = "Thematic categorization";

var datatypeFacet = "datatype";
var findAllDatatypes = "findAllDatatypes"; 
var findAllDatatypesById = "findAllDatatypesById";
var countAllDatatypes = "countAllDatatypes";
var dtFacet = "Resources";

var organizationFacet = "organization"; 
var findAllOrganizations = "findAllOrganizations";
var findAllOrganizationsById = "findAllOrganizationsById";
var countAllOrganizations = "countAllOrganizations";
var orgaFacet = "Organizations";

var hierarchylevelnameFacet = "Sustainable Land Management";
var findHierarchylevelnames = "findHierarchylevelnames"; 
var findAllHierarchylevelnamesById = "findAllHierarchylevelnamesById";
var countAllHierarchylevelnames = "countAllHierarchylevelnames";

var scenarioFacet = "Scenarios and storylines";
var findScenarios = "findScenarios"; 
var findAllScenariosById = "findAllScenariosById";
var countAllScenarios = "countAllScenarios";

var boundingboxFacet = "geographicboundingbox";
var findAllBoundingboxes = "findAllBoundingboxes";
var countAllBoundingboxes = "countAllBoundingboxes";

var findByMixed = "findByMixed";

var findPublicationByDsId = "findPublicationByDsId";

var findSimilarLimited = "findSimilarLimited";
var findSimilarScenarioValues = "findSimilarScenarioValues";
var findSimilarHierarchylevelnameValues = "findSimilarHierarchylevelnameValues";
var findSimilarTopiccategoryValues = "findSimilarTopiccategoryValues";
var findSimilarDatatypeValues = "findSimilarDatatypeValues";
var findSimilarOrganizationValues = "findSimilarOrganizationValues";

var findInternId = "findInternId";

//displayed count values @see: exhibit collection summary widget
var allItemsCount = 0; //all items of database 
var filteredItemsCount = 0; //actually filtered items (no. of items in table)


//-DATABASE CONSTANTS
var PARENT = "parent";
var CHILDREN ="children";
var TOPIC = "topic";
var DESCRIPTION = "Description";
var ORGANISATION = "Organization";
var FROM = "from";
var TO ="to";
var RELATED_LAYER = "related layer";
var RELATED_DATASETS = "related datasets";
var RELATED_SERVICE = "related service";
var SCENARIO ="scenario";
var LABEL = "label";
var DATATYPE = "Datatype";
var HVL ="hvl";
var ID = "id"; 
var URL = "url";
var LATLONG ="latlng";
