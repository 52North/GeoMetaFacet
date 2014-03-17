 
var lastposition = 0;
var guiFunctions = {};
var _id = null; 

var metaVizOn = false;

/**
 * function which ensures via callback, that preloader is shown before tree generation is done
 */
require(["dojo/Deferred"], function(Deferred) {
	guiFunctions.showPreloaderCallback = function() {
		var d = new Deferred(); 
		
		if (dojo.byId("preloaderContent") != null) {
			// Show the preloader centered in the viewport		
			var ps = dojo.position('preloaderContent');
			var ws = dojo.window.getBox(); 
			dojo.style("preloaderContent", "top" , (ws.h / 2 - ps.h / 2) + "px");
			dojo.style("preloaderContent", "left", (ws.w / 2 - ps.w / 2) + "px");
			dojo.style("preloaderContent", "visibility" , "visible");
			dojo.style("preloader","background", "rgba(255,255,255, 0.8)");
			dojo.style("preloaderContent", "background", "rgba(255,255,255, 1.0)" );
			dojo.style("preloader", "opacity", "1");
			dojo.style("preloader", "display", "block");
			dojo.byId("preloaderText").innerHTML = "Structure is loading.";
		}
		setTimeout(function() {
			d.resolve();
		}, 100);
	
		return d.promise;
	};
});

/**
 * call for preloader function should look like this
 */
//guiFunctions.showPreloaderCallback().then(function() {
//	guiFunctions.setTree(_id);
//	hidePreloader();
//});

/**
 * Method to fill detail tab and hide details of previously selected metadata (metaviz view, map view).
 * Calls further methods to fill the tab.
 */
guiFunctions.setItemDetails = function (id) {   
	
	if (dojo.byId("map") != null) {
		time4Maps.hideTime4Maps();
		metaViz.hideMetaViz();
		dojo.byId("mapII").style.display = "block";
		showFeature(id);
		
		guiFunctions.setGeneralMetaData(id);
		guiFunctions.setTabularView(id);
		//guiFunctions.scrollToSpecificPoint(id);
		
		//if tree tab is selected && id is new --> calculate tree again)
		if ((dijit.byId('tabContainer').selectedChildWidget == dijit.byId('tabTree')) && _id != id) {
			guiFunctions.setTree(id);
		}
	} else {
		guiFunctions.setGeneralMetaData(id);
	}
	
	_id = id;	
};

/**
 * Method to set details view.  
 */
guiFunctions.setItemDetailsWithoutHiding = function(id) {
	if (id == "") { 
		alert("Selected Object not found.");
		return;
	}
		
	var entry = httpGet(findOne + "/" + id);
	if (entry == "") {
		console.log("guiFunctions: Entry is not defined ");
		return;
	}
	
	showFeature(id);
	if (dojo.byId('tabContainer') != null) {
		if ((dijit.byId('tabContainer').selectedChildWidget == dijit.byId('tabTree')) && _id != id) {
			_id = id; 
			guiFunctions.setTree(_id);	
		}
		_id = id;
		guiFunctions.setTabularView(id);
		guiFunctions.setGeneralMetaData(id); 
	} else if (dojo.byId("tabMetaData") != null) {
		guiFunctions.setGeneralMetaData(id); 
	}
 
};

/**
 * Method to scroll the tabular view to a specific point
 */
guiFunctions.scrollToSpecificPoint = function(href) {
	window.location.href = "#" + href;
};
 
/**
 * Method to set the style of the selected item to a specific color
 */
guiFunctions.setTabularView = function(id) { 
	_id = id; 
	// tabularView
	var table2 = document.getElementsByClassName("exhibit-tabularView-body");
	
	if(lastposition > table2[0].rows.length) {
		lastposition = 0;
		return;
	}
	//set the color of the preselected item back to normal
//	if (table2[0].rows[lastposition+1].rowIndex % 2) {
//		table2[0].rows[lastposition+1].style.background = '#ddd';
//	} else {
		table2[0].rows[lastposition+1].style.background = '#fff';
//	}
	//style color of selected item and set preselected item back to normal
	for (var i = 0; i < currentTabularViewItems.length; i++) {		
		if (currentTabularViewItems[i].id == id && table2[0].rows[i] != undefined) {
			lastposition = i;
			//style color of current selected item
			table2[0].rows[i+1].style.background = 'rgba(249, 178, 0, 0.4)';
			break;
		}
	}
};

/**
 * Method to show info text.
 */
guiFunctions.showInfoText = function() {
	dojo.byId("infotext").style.display = "block";
};

/**
 * Method to remove tree for previously selected item.
 */
guiFunctions.removeTableAndTree = function() {
	(dojo.byId("infotext")).style.display = "none";
	//table
	var tab = dojo.byId("metaDataTable");
	if (tab) {
		while (tab.hasChildNodes()) {
			tab.removeChild(tab.lastChild);
		}
		dojo.destroy(tab);
	}

	var tab = document.getElementById("table");
	if(tab)
		tab.parentNode.removeChild(tab);
	//tree
	dijit.byId("myTree").reload([],[]);
	//set preselected object id back to null
	_id = null;
};

/**
 * Method to remove detail table for previously selected item.
 */
guiFunctions.removeTable = function() {
	//table
	if (dojo.byId("infotext") != null)
		(dojo.byId("infotext")).style.display = "none";
	var tab = dojo.byId("metaDataTable");
	if (tab) {
		while (tab.hasChildNodes()) {
			tab.removeChild(tab.lastChild);
		}
		dojo.destroy(tab);
	}

	var tab = document.getElementById("table");
	if (tab)
		tab.parentNode.removeChild(tab);
};

/**
 * Method to set the general metadata information according to selected item
 */
guiFunctions.setGeneralMetaData = function(id) {
	if (dojo.byId("tabTree") != null)
		dijit.byId("tabTree").set("disabled", false);
	
	//remove existing tab
	guiFunctions.removeTable();
	
	 /**
	  * create a new table row, 
	  * @param contentCell1 - content of first column
	  * @param contentCell2 - content of second column
	  * @returns
	  */
	function createTableRow(contentCell1, contentCell2) {
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		var cellText = document.createTextNode(contentCell1);
		cell.appendChild(cellText);
		var cell2 = document.createElement("td");
		var cellText2 = document.createTextNode(contentCell2);		
		cell2.appendChild(cellText2);
		
		if (contentCell1.indexOf("Title") >= 0) {
			cell2.style.cssText = "font-weight:bold";  
		} else {
			cell2.style.cssText = "color:#666666";
		}
		
		row.appendChild(cell);
		row.appendChild(cell2);
		return row;
	}
	
	var table = document.createElement("table");
	table.setAttribute("id", "metaDataTable");
	
	var entry = httpGet(findOne + "/" + id);
	
	table.appendChild(createTableRow("Title: ", entry.label)); 
	table.appendChild(createTableRow("Description: ", entry.description));
	table.appendChild(createTableRow("Organisation: ", entry.organization));
	table.appendChild(createTableRow("Datatype: ", entry.datatype));
	 
	if (entry.keywords != null && entry.keywords != "")
		table.appendChild(createTableRow("Keywords: ", entry.keywords));	
	if (entry.temporalextentbeginposition)
		table.appendChild(createTableRow("From: ", entry.temporalextentbeginposition));
	if (entry.temporalextentendposition)
		table.appendChild(createTableRow("To: ", entry.temporalextentendposition));
	if (entry.topiccategory) {
		var topics = "";
		for (var i = 0; i < entry.topiccategory.length; i++) {
			if (i < entry.topiccategory.length-1)
				topics += entry.topiccategory[i] + ", ";
			else 
				topics += entry.topiccategory[i];
		}
		
		table.appendChild(createTableRow("Topic: ", topics));
	}
	if (entry.scenario)
		table.appendChild(createTableRow("Scenario: ", entry.scenario));
	if (entry.hierarchylevelname)
		table.appendChild(createTableRow("Related project: ", entry.hierarchylevelname));
 
	var a = document.createElement("a");
	newAttribute = document.createAttribute("onclick"); 
	newAttribute2 = document.createAttribute("onclick"); 
	 
	if (entry.url) {
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		var cellText = document.createTextNode("Links: ");
		cell.appendChild(cellText);
		row.appendChild(cell);
		var cell2 = document.createElement("td");
		//var metaData = "<a onclick=\"window.open(\'http://catalog.glues.geo.tu-dresden.de:8080/terraCatalog/Query/ShowCSWInfo.do?fileIdentifier="+entry.id+"\');\">Show detailed metadata in catalog</a>";
		var metaData = "<a onclick=\"window.open(\'" + entry.url + "\');\">Show detailed metadata in catalog</a>";
		cell2.innerHTML = metaData;
		row.appendChild(cell2);
		table.appendChild(row);
	} 
	
	if (entry.hierarchylevelname == "GLUES" && entry.datatype== "dataset") { 
		newAttribute.nodeValue = "metaViz.showMetaViz(\"" + entry.uuid + "\")";
		a.setAttributeNode(newAttribute);
		a.innerHTML = "Show lineage information";
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		cellText = document.createTextNode("Lineage: ");
		cell.appendChild(cellText);
		var cell2 = document.createElement("td");
		cell2.appendChild(a);
		row.appendChild(cell);
		row.appendChild(cell2);
		table.appendChild(row);  
	}
	
	if (entry["datatype"] == "dataset") {
		var publication = httpGet("findPublicationByDsId/" + entry["id"]);
		if (publication[0] != null) {
			
			for (var i = 0; i < publication.length; i++) {
				var pubId = publication[i].id;
				
				var cell = document.createElement("td");
				cellText = document.createTextNode("Publication: ");
				cell.appendChild(cellText);
				
				var row = document.createElement("tr");
				var cell2 = document.createElement("td");
				var a = document.createElement("a");
				var newAttribute = document.createAttribute("onclick");
				newAttribute.nodeValue = "guiFunctions.setItemDetails(\"" + pubId + "\")";
				a.setAttributeNode(newAttribute);
				a.innerHTML = publication[i].label; //"Show details of related publication"; 
				cell2.appendChild(a);
				row.appendChild(cell);
				row.appendChild(cell2);
				table.appendChild(row);
			}
		}
	}
	
	if (entry["related service"] && entry["related service"] != "null" && dojo.byId("map") != null) {
		var a = document.createElement("a");
		newAttribute = document.createAttribute("onclick");
		newAttribute.nodeValue = "time4Maps.showTime4MapsId(\"" + id + "\")";
		a.setAttributeNode(newAttribute);
		a.innerHTML = "Visualize on the map";
		
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		var cellText = "";
		
		if (entry["datatype"] == "dataset" || entry["datatype"] == "publication")
			cellText = document.createTextNode("Related service: ");
		else if (entry["datatype"] == "service")
			cellText = document.createTextNode("Service: ");
		if (cellText != "")
			cell.appendChild(cellText);
		
		var cell2 = document.createElement("td");	
		cell2.appendChild(a);
		
		if (entry["related service id"]) { 			
			var a2 = document.createElement("a");
			newAttribute2 = document.createAttribute("onclick");
			newAttribute2.nodeValue = "guiFunctions.setItemDetails(\"" + entry["related service id"] + "\")";
			a2.setAttributeNode(newAttribute2);
			a2.innerHTML = " Show details of related service";
			a2.style.cssText = "padding-left: 10px;"; 
			cell2.appendChild(a2);
		}
		row.appendChild(cell);
		row.appendChild(cell2);
		table.appendChild(row); 	
	}
	
	if (entry.save != null && entry.save != "") { 
		var a = document.createElement("a");
		newAttribute = document.createAttribute("onclick"); 
		newAttribute.nodeValue = "self.location.href=\"" + entry["save"] + "\"";		
		newAttribute.nodeValue = "window.open('" + entry["save"] + "')";
			 
		a.setAttributeNode(newAttribute);
		a.innerHTML = "Open download page"; //entry["save"]; 
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		var cellText = document.createTextNode("Download: ");
		cell.appendChild(cellText);
		var cell2 = document.createElement("td");
		cell2.appendChild(a);
		row.appendChild(cell);
		row.appendChild(cell2);
		table.appendChild(row); 
	}
	if (entry.info != null && entry.info != "") {
		var a = document.createElement("a");
		newAttribute = document.createAttribute("onclick"); 
		newAttribute.nodeValue = "self.location.href=\"" + entry["info"] + "\"";		
		newAttribute.nodeValue = "window.open('" + entry["info"] + "')";
			 
		a.setAttributeNode(newAttribute);
		a.innerHTML = "Open info page" ;//entry["info"]; 
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		var cellText = document.createTextNode("Information: ");
		cell.appendChild(cellText);
		var cell2 = document.createElement("td");
		cell2.appendChild(a);
		row.appendChild(cell);
		row.appendChild(cell2);
		table.appendChild(row); 
	} 
	
	if (entry["related datasets"]) { 		
		var innerTable = document.createElement("table");
		innerTable.setAttribute("id", "relatedDSTable");
		for (var i = 0; i < entry["related datasets"].length; i++) {
			var datasetTuple = entry["related datasets"][i];
			datasetTuple = datasetTuple.substr(1, datasetTuple.length-1);
			var datasetTupleName = datasetTuple.substr(0, datasetTuple.lastIndexOf(","));
			
			var pos = datasetTuple.lastIndexOf(",") + 1;
			var datasetTupleId = datasetTuple.substr(pos, (datasetTuple.length - pos - 1));
			
			var a = document.createElement("a");
			newAttribute = document.createAttribute("onclick"); 
			newAttribute.nodeValue = "guiFunctions.setItemDetails(\"" + datasetTupleId + "\")";
			a.setAttributeNode(newAttribute);
			a.innerHTML = "Show details";
			 
			var row = document.createElement("tr");
			var cell = document.createElement("td");			
			var cellText = document.createTextNode(datasetTupleName);
			cell.appendChild(cellText);
			var cell2 = document.createElement("td");
			cell2.appendChild(a);
			row.appendChild(cell);
			row.appendChild(cell2);
			innerTable.appendChild(row); 			 
		} 
		
		var innerRow = document.createElement("tr");
		var innerCell = document.createElement("td");
		innerCellText = document.createTextNode("Related datasets: ");
		innerCell.appendChild(innerCellText);
		var innerCell2 = document.createElement("td");
		innerCell2.appendChild(innerTable);
		innerRow.appendChild(innerCell);
		innerRow.appendChild(innerCell2);
		table.appendChild(innerRow);  
	}
	
	//CSW Services 
	if (entry["related service"] && entry["related service"].indexOf("csw") >= 0) {
		var a = document.createElement("a");
		newAttribute = document.createAttribute("onclick"); 
		newAttribute.nodeValue = "self.location.href=\"" + entry["related service"] + "\"";		
		newAttribute.nodeValue = "window.open('" + entry["related service"] + "')";
			 
		a.setAttributeNode(newAttribute);
		a.innerHTML = "Show CSW details (opens a new window)";
		var row = document.createElement("tr");
		var cell = document.createElement("td");
		var cellText = document.createTextNode("URL: ");
		cell.appendChild(cellText);
		var cell2 = document.createElement("td");
		cell2.appendChild(a);
		row.appendChild(cell);
		row.appendChild(cell2);
		table.appendChild(row); 
	}
	
	if (!(entry["datatype"] == "dataset")) {
		if (dojo.byId("tabTree") != null)
			dijit.byId("tabTree").set("disabled", true);
	}
	
	//showing always general information after a new element is choosen
	if (dojo.byId("tabContainer")) 
		dijit.byId("tabContainer").selectChild(dijit.byId("tabMetaData"));
	
	table.style.display="block";
	document.getElementById("tabMetaData").appendChild(table);
	$('#tabMetaData').scrollTop(0);
};

/**
 * Method called by onShow of Structure tab, when id is not known by method 
 * to calculate tree only when structure tab is activated
 */
guiFunctions.setTreeI = function() {
	if (_id != null) 
		guiFunctions.setTree(_id);	
};

/**
 * Method to prepare the data for dojo tree according to selected item (show hierarchy).
 */
guiFunctions.setTree = function(id) {
	var myTree = dijit.byId("myTree");
	var entry = httpGet(findOne + "/" + id);
	
	if (entry.datatype != "dataset") {
		myTree.reload([],[]);
		dojo.byId("tabTree").innerHTML = "There is no structure for this item. The information is only available for datasets.";
		return;
	} 
			
	data=[];
	
	var grandparent = httpGet("findGrandParent" + "/" + id);
	if (grandparent == "" ) {
		console.log("guiFunctions: no root node of dataset found");
		myTree.reload([], []);
		return;
	} else if (grandparent.children.length == 0) {
		myTree.reload([], []);
		dojo.byId("tabTree").innerHTML = "There is no structure for this item. This dataset has no parent or children.";		
		return;
	}
	
	//if actual grandparent equals old grandparent, just reset the path
	//otherwise call setChildren and sort result
	var rooti= myTree.getRootId();
	if (grandparent.id == rooti && rooti != undefined) {
		myTree.resetPath(grandparent["pathToChild"]);
	} else {
		//starts showing the preloader
		//showPreloaderCallback().then(function() {
			var dataContent = httpGet("findTree" + "/" + grandparent.id);
			data.push(dataContent);
			require(["dojo/Deferred"], function(Deferred) {
				var d = new Deferred();
				reloadTree = function() {
					myTree.reload(data);
					setTimeout(function() {
						d.resolve();
					}, 10);
					return d.promise;
				};
			});
			reloadTree().then(function() {
				myTree.resetPath(grandparent["pathToChild"]);	  
				myTree.scroll(grandparent["pathToChild"]);
			});
			
			//hidePreloader();
			//});
	}
	  
	/**
	 * Method to get the grandparent of an item. 
	 * Saves path to selected object in the grandparent as pathToChild property
	 * 
	 * @param object
	 * @returns
	 */
	 function getGrandParent(object) {
		 var grandparent = httpGet("findGrandParent" + "/" + object["id"]);
		 return grandparent;		 
	 }
	 
	 /**
	  * Method to set all children of an item as property "children" (recursively). 
	  */
	  function setChildren(object) {
		  var children = httpGet(findOne + "/" + object["id"]).children;
		  var label = httpGet(findOne + "/" + object["id"]).label;
		  
		  if (children != null && children.length > 0) {
			  object["children"] = [];
			  for (var i = 0; i < children.length; i++) {
				  var child = {};
				  child["id"] = children[i];
				  //cut substring children
				  var labelChild = httpGet(findOne + "/" + children[i]).label;
				  if (labelChild.substring(0,label.length) == label) {
					  labelChild = labelChild.substring(label.length, labelChild.length);
				  }
				  child["label"] = labelChild;
				  setChildren(child);
				  object["children"].push(child);
			   }
		   } 
		   return object;
	  } 
};

/**
 * Method to show the map in main view.
 */
guiFunctions.showMap = function() {
	dojo.byId("mapII").style.display = "block";
	
	if (map2) {  
		map2.updateSize(); 
		vector.redraw();
	}
};

/**
 * Method to resize all gui elements.
 */
guiFunctions.resizeAll = function() {
	if (dijit.byId("map_contentPane"))  
	 	 dijit.byId("map_contentPane").resize();  
	if (dijit.byId("time4mapsMap"))
	 	 dijit.byId("time4mapsMap").resize();
	if (dijit.byId("time4mapsMap_Left"))
	 	 dijit.byId("time4mapsMap_Left").resize();
	if (dijit.byId("time4mapsMap_Time"))
	 	 dijit.byId("time4mapsMap_Time").resize();
	
	if (dijit.byId("border-left-top"))
	 	 dijit.byId("border-left-top").resize();
	
	if (dijit.byId("bc_t4m_right"))
	 	 dijit.byId("bc_t4m_right").resize();
	if (dijit.byId("listPanel"))
	 	 dijit.byId("listPanel").resize();
	if (dijit.byId("centerPanel"))
	 	 dijit.byId("centerPanel").resize();
	if (dijit.byId("tabMetaData"))
	 	 dijit.byId("tabMetaData").resize();
	if (dijit.byId("tabTree"))
	 	 dijit.byId("tabTree").resize();
};