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

var registries = {};
var jsonObj;

 registries.displayOverview = function(number) {
	require(["dojo/dom-construct", "dijit/form/Button", "dijit/layout/ContentPane", "dojo/domReady!"], function(domConstruct, Button, ContentPane) {
		
		//Body + Header ---------------------------------------------------------------------
		var globalBody = domConstruct.create("div", {
			id: "Dialog_body",
			style: "width: 100%;"
		});

		var textDiv = domConstruct.create("div", {
			innerHTML: "",
			style: "width: 100%; margin-bottom: 20px;"
		}, globalBody);
		
		var tableDiv = domConstruct.create("div",{
			id: "tableDiv",
		}, globalBody);
		
		if (number == 1) {
			textDiv.innerHTML = "This facet shows an overview of all projects related to the Module A of Sustainable Land Management research program. <br><br>" +
					"The <b>Sustainable Land Management</b> program is an international research program  of the German Ministry of Education and Research (BMBF). The program consists of two Modules, A and B, that work on the topics " +
					"<ul><li>Interactions between land management</li><li>Climate change and ecosystem services</li><li>And innovative system solutions</li></ul> for sustainable land management. <br><br> " +
					"Central to <b>Module A</b> are the <b>interactions between land management, climate change and ecosystem services</b>, which need to be understood better. These interactions are multi-dimensional and complex and are not yet fully understood. " +
					"Apart from adaption and mitigation of climate change, policies for land management can contribute to increased sustainability of regional societies and landscapes. <br>" +
					"An important issue is the maintenance of key functions that are indispensable to the implementation of sustainable, climate-optimized landscapes. These key functions are ecosystem functions and services (ESF/ESS), which must be " +
					"protected for both societal and economic reasons. In the long run, ecosystem functions and services are essential if land is to function as a natural resource for human societies: They can support the resilience of ecosystems under " +
					"climate change. <br>" +
					"In Module A, <b>GLUES</b> (Global Assessment of Land Use Dynamics, Greenhouse Gas Emissions and Ecosystem Services) is the coordination project and supports the regional projects (RPs) within the research program with a major portion of " +
					"communications and networking measures and aims to synthesise the RPs' results. <br>" +
					"The twelve <b>regional projects</b> (RPs) are researching the impacts of climate and socio-economic changes and a corresponding optimization of the use of land and natural resources in different countries and regions.";
		
			var a = document.createElement("a");
			var onclick = document.createAttribute("onclick");			
			var url = location.href;
			if (url.indexOf("#") >= 0)
				url = url.substring(0, url.indexOf("#"));
			url = url.substring(0, url.length - 10);
			url += "project_registry.html";
			
			onclick.nodeValue = "window.open('" + url + "')";
			a.setAttributeNode(onclick);
			a.innerHTML = "Detailled information about all projects of Sustainable Land Management program - Module A";
			
			tableDiv.appendChild(a); 
			registries.displayWidget(globalBody, hierarchylevelnameFacet);
		} else if (number == 2) {
			textDiv.innerHTML = "This facet shows an overview of all scenarios and storylines that are used within GLUES. <br><br>" +
					"The term scenario is explained by the IPCC with the help of the following description: A plausible and often simplified description of how the future may " +
					"develop based on a coherent and internally consistent set of assumptions about driving forces and key relationships. Scenarios may be derived from projections, " +
					"but are often based on additional information from other sources, sometimes combined with a narrative storyline. <br>" +
					"(http://www.ipcc.ch/pdf/special-reports/srex/SREX-Annex_Glossary.pdf) <br><br>" +
					"In context of GLUES and the Sustainable Land Management program, the scenarios can be grouped by their developers into GLUES specific scenarios and IPCC scenarios." +
					"The <b>GLUES specific scenarios</b> are developed by the GLUES scientists and suit the specific requirements " +
					"of the regional projects in the Sustainable Landmanagement Program." +
					"The <b>IPCC scenarios</b> are developed by the IPCC group and are used in several GLUES models.";			
			
			var a = document.createElement("a");
			var onclick = document.createAttribute("onclick");
			var url = location.href;
			if (url.indexOf("#") >= 0)
				url = url.substring(0, url.indexOf("#"));
			url = url.substring(0, url.length - 10);
			url += "scenario_registry.html";
			
			onclick.nodeValue = "window.open('" + url + "')";
			a.setAttributeNode(onclick);
			a.innerHTML = "Detailled information about all used scenarios and storylines";
			tableDiv.appendChild(a); 
			registries.displayWidget(globalBody, scenarioFacet);
		} else if (number == 3) {
			textDiv.innerHTML = "This facet shows an overview of the thematic classification of the data.<br><br>" +
					"The field topic category is a metadata field, which is defined in the ISO 19115 as a high-level geographic data thematic classification. It should assist in the grouping and search of available geographic data sets.";
			var a = document.createElement("a");
			var onclick = document.createAttribute("onclick");
			var url = location.href;
			if (url.indexOf("#") >= 0)
				url = url.substring(0, url.indexOf("#"));
			url = url.substring(0, url.length - 10);
			url += "topiccategory_registry.html";
			
			onclick.nodeValue = "window.open('" + url + "')";
			a.setAttributeNode(onclick);
			a.innerHTML = "Detailled information about all topic categories";
			tableDiv.appendChild(a);
			registries.displayWidget(globalBody, themeFacet);
		} else if (number == 4) {
			textDiv.innerHTML = "This facet shows an overview of the data types.<br><br>" +
					"The field data type is a metadata field, which is defined in the ISO 19115 as scope code. It describes the class of information to which the referencing entity applies. Possible values for the scope code are for example dataset, series, non-geographic dataset, feature, model, service or software.<br><br>" +
					"Withing GLUES and the Sustainable Land Management program only datasets, series, services, applications and non-geographic datasets are available.<br>" +
					"A special GLUES specific (and non-ISO) data type is the publication. The publication entries contain information about scientific publications or documentations of the lineage of a dataset. " +
					"Therefore the publication entries are extracted from the extended lineage description of the datasets (based on ISO 19115-2).";
			
			registries.displayWidget(globalBody, dtFacet);
		} else if (number == 5) {
			textDiv.innerHTML = "This facet shows an overview of the organizations that produce data within the Sustainable Land Management program. It summarizes institutions that work in the GLUES project or in one of the twelve regional projects. Furthermore, organizations that produced data, which solves as input for further modeling, are listed.";
			 
			registries.displayWidget(globalBody, orgaFacet);
		}
	});
 };
	
registries.convertJsonToTable = function(path) {	 
	var table = document.createElement("table");
	var row = createTableHeader();
	row.style.size = 20;
	table.appendChild(row);
	
	function createTableHeader(){
		var row = document.createElement("tr");
		var cell = document.createElement("th");
		var cellText = document.createTextNode("Name");
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
		attr.nodeValue = id;//name;
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
				attr.nodeValue = "#" + v.id; //v.name;
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
*\details 	This method pops up a dijit dialog which display the search results in a table
*\author	Hannes Tressel 
*\param		widget	content element
*/
registries.displayWidget = function(widget, facetName) {
	require(["dijit/Dialog", "dojo/window", "dijit/registry", "dojo/on", "dojo/keys"], function(dialog, window, registry, on, keys) {
		var browserSize = window.getBox();
		
		if (registry.byId("SearchResultOverview")) {
			registry.byId("SearchResultOverview").destroyRecursive();
		}

		var dialogWidget = new dialog({
			id: "SearchResultOverview",
			title: "Information about facet <i>" + facetName + "</i>",
			autofocus: false,
			style: "width:" + (browserSize.w * 80) / 100 + "px; height:" + (browserSize.h * 60) / 100 + "px;",
			content: widget
		});
		dialogWidget.show();
		
		if (heatmap) {
			infoMode = true;
			dialogWidget.connect(dialogWidget, "hide", function(e){			   
			    infoMode = false;
			});
		}
	});
}