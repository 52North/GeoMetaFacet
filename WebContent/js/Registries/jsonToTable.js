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

var jsonObj;

/**
 * Method to create table header with 4 columns.
 * @returns header row with 4 columns
 */
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

/**
 * Method to create a table row.
 * Shows name + id | description + web link | children.
 * Children will be displayed as anchor.
 * Name has reference to anchor.
 * 
 * @param name
 * @param id
 * @param description
 * @param children 
 * @param web
 * @returns
 */
function createTableRow(name, id, description, children, web) { 
	var row = document.createElement("tr");

	var cellA = document.createElement("a");
	var attr = document.createAttribute("name");
	attr.nodeValue = id; //name;
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
			attr.nodeValue = "#" + v.identifier; //v.name;
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

/**
 * Method that uses a hierarchical JSON object to generate a table.
 * Will be used to generate registry html pages.
 * (In application click on i next to facet project or scenario and click link to further details -> registry page)
 * 
 * @param path - data hierarchy
 * @returns table object
 */
function convertJsonToTable(path) {	 
	var table = document.createElement("table");
	var row = createTableHeader();
	row.style.size = 20;
	table.appendChild(row); 
	$.getJSON(path, function(data) { 
	    jsonObj = data;
	    $.each(data, function(k, v) { recursiveFunction(k, v); });
	    
	    /**
	     * recursion to navigate through children.
	     */
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
}