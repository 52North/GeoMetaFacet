var registries = {};
var jsonObj;
	
registries.convertJsonToTable = function(path) {	 
	var table = document.createElement("table");
	var row = createTableHeader();
	row.style.size = 20;
	table.appendChild(row);
	
	function createTableHeader(){
		var row = document.createElement("tr");
		var cell = document.createElement("th");
		var cellText=document.createTextNode("Name");
		cell.appendChild(cellText);
		var cell2 = document.createElement("th");
		var cellText2 = document.createTextNode("Identifier");
		cell2.appendChild(cellText2);
		var cell3 = document.createElement("th");
		var cellText3 = document.createTextNode("Description");
		cell3.appendChild(cellText3);
		var cell4 = document.createElement("th");
		var cellText4 = document.createTextNode("Children");
		cell4.appendChild(cellText4); 	
		row.appendChild(cell);
		row.appendChild(cell3);
		row.appendChild(cell4);
		return row;
	}

	function createTableRow(name, id, description, children, web) { 
		var row = document.createElement("tr");

		var cellA = document.createElement("a");
		var attr = document.createAttribute("name");
		attr.nodeValue = name;
		cellA.setAttributeNode(attr); 
		
		var cellText = document.createTextNode(name);
		cellA.appendChild(cellText);
		 
		var cellP = document.createElement("p");
		var cellTextP = document.createTextNode("> " + id);
		cellP.appendChild(cellTextP);
		
		var attrP = document.createAttribute("class");
		attrP.nodeValue = "p_id";
		cellP.setAttributeNode(attrP);
		
		var cell2 = document.createElement("td"); 
		var cell3 = document.createElement("td");	
		var cell = document.createElement("td");
		var cell4 = document.createElement("td"); 	
		
		var attrCell = document.createAttribute("class");
		attrCell.nodeValue = "table_row_id";
		cell.setAttributeNode(attrCell); 
		
		var attrCell2 = document.createAttribute("class");
		attrCell2.nodeValue = "table_row_name";
		cell2.setAttributeNode(attrCell2); 
		
		cell2.appendChild(cellA);  
		cell2.appendChild(cellP);
		
		var cellText3 = document.createTextNode(description);
		var attrCell3 = document.createAttribute("class");
		attrCell3.nodeValue = "table_row_desc";
		cell3.setAttributeNode(attrCell3); 
		cell3.appendChild(cellText3); 
		
		if (web) {
			var cellBr = document.createElement("br");
			cell3.appendChild(cellBr);
			
			var cellA = document.createElement("a");
			var attr = document.createAttribute("href");
			attr.nodeValue = web;
			cellA.setAttributeNode(attr);
			var attr2 = document.createAttribute("target");
			attr2.nodeValue = "_blank";
			cellA.setAttributeNode(attr2);
			
			var cellLink = document.createTextNode(web);
			cellA.appendChild(cellLink);
			cell3.appendChild(cellA);
		}
		
		if (children) { 
			$.each(children, function(k, v) { 
				var cellA = document.createElement("a");
				var attr = document.createAttribute("href");
				attr.nodeValue = "#" + v.name;
				cellA.setAttributeNode(attr); 
				
				var cellText = document.createTextNode(v.name);
				cellA.appendChild(cellText);				
				cell4.appendChild(cellA);
				
				var cellBr = document.createElement("br");
				cell4.appendChild(cellBr);
			});
		}
	 
		var attrCell4 = document.createAttribute("class");
		attrCell4.nodeValue = "table_row_children";
		cell4.setAttributeNode(attrCell4); 
		 
		row.appendChild(cell2);
		row.appendChild(cell3);
		row.appendChild(cell4);
		return row;
	}
	
	
	
	$.getJSON(path, function(data) { 
	    jsonObj = data;
	    $.each(data, function(k, v) { recursiveFunction(k, v); });
	    
	    function recursiveFunction(k, v) { 
	    	table.appendChild(createTableRow(v.name, v.identifier, v.description, v.children, v.web));
	    	if (v.children) {
		    	if(v.children instanceof Object) {
		    		$.each(v.children, function(k, v) {
		    			recursiveFunction(k, v);
		    		});
		    	}
	    	}
	    }
	    
	}); 
	return table;
};


/**
*\details	this method pops up a dijit dialog which display the search results in a table
*\author		Hannes Tressel changed by Susi
*\param		widget	content element
*/
registries.displayWidget = function(widget){
	require(["dijit/Dialog", "dojo/window", "dijit/registry", "dojo/on", "dojo/keys"], function(dialog, window, registry, on, keys){
		var browserSize = window.getBox();
		
		if (registry.byId("SearchResultOverview")){
			registry.byId("SearchResultOverview").destroyRecursive();
		}

		new dialog({
			id: "SearchResultOverview",
			title: "",
			autofocus: false,
			style: "width:"+(browserSize.w*80)/100+"px; height:"+(browserSize.h*60)/100+"px;",
			content: widget
		}).show();
	});
}
