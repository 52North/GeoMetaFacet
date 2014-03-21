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

function GeoNames() {
	var body = null;
	var searchText = null;
}

/**
*	\details	This Method uses GeoNames Search Engine to find object-related longitude and latitude 
*	\author 	Hannes Tressel
*   \param		value - Search Term (e.g. Dresden )
*/
GeoNames.search = function(value) {
	GeoNames.searchText = value;
	require(["dojo/request/script"], function(script) {
		script.get("http://api.geonames.org/searchJSON", {
			query: {
				q: value,
				maxRows: 20,
				isNameRequired: true,
				username: "hannestressel",
				format: "json",
				callback: "GeoNamesAnswer"
			}
		});
	});
};

/**
*	\details 	manage results of geonames search engine
*	\param		data - Results ( json )
*	\author		Hannes Tressel
*/
function GeoNamesAnswer(data) {
	require(["dojo/dom-construct", "dijit/form/Button"], function(domConstruct, Button) {
 
		GeoNames.body = domConstruct.create("div", {
			id: "Dialog_body",
			style: "width: 100%;"
		}); 
		var widget = domConstruct.create("table", {
			id: "GeoNamesResults",
			style: "width: 100%; margin-bottom: 20px;"
		}, GeoNames.body);
 
		var GeoNameResults = filterCityCountry(data.geonames);

		for (var i = 0; i < GeoNameResults.length; i++) {
			var tr = domConstruct.create("tr", {
				style: "background-color: #FFFFFF;border-top:1px solid gray;",
				ondblclick: function() {  
					for (var i = 0; i < widget.rows.length; i++) {
						var row = widget.rows[i];
						if (row.style.backgroundColor === "rgba(0, 124, 149, 0.2)") {							 
							var LatLongFcode = row.cells[0].id.split(":"); 
							map2.setCenter(new OpenLayers.LonLat(Number(LatLongFcode[1]), Number(LatLongFcode[0])).transform(map2.displayProjection, map2.projection), manageLevelOfZoom(LatLongFcode[2]));
							
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
					
					//searchTable - resetting colors
					for (var i = 0; i < searchTable.rows.length; i++) {
  						row = searchTable.rows[i]; 
  						row.style.backgroundColor = "#fff";
  					}
					
					this.style.backgroundColor = "rgba(0,124,149,0.2)";
				}
			}, widget);
 
			domConstruct.create("td", {
				id:  GeoNameResults[i].lat + ":" + GeoNameResults[i].lng + ":" + GeoNameResults[i].fcode,
				innerHTML: "<b>" + GeoNameResults[i].name + "</b>, " + GeoNameResults[i].countryName + "<br>Datatype: map result<br>Lat/Lon: " + GeoNameResults[i].lat + ", " + GeoNameResults[i].lng
			}, tr);

		}

  		for (var i = 0; i < widget.rows.length; i++) {
  			row = widget.rows[i];
  			if (i%2) {
  				row.style.backgroundColor = "#eee";
  			} else
  				row.style.backgroundColor = "#fff";
  		}	
	});

	Search.execute(GeoNames.searchText);
}

/**
* \details		this method should return the correct level of zoom, depending on geoname attribute "fcode"
* \param		fcode 	Feature Code
* \return 		OpenLayers ZoomLevel
* \author 		hannes tressel
*/
function manageLevelOfZoom(fcode) {
	switch(fcode) {
		case "ADM1":
			return 7;
			
		case "AMD2":
			return 8;
			
		case "AMD3":
			return 9;
			
		case "AMD4":
			return 10;
			
		case "AMD5":
			return 11;
			
		case "PCLI":
			return 4;
			
		default:
			return 10;	
	}
}

/**
 * \details		This method is filtering from cities or countries
 * 				PPLA - 4 	-> seat of a first/second/third/fourth-order administrative division
 * 				PPLC 		-> capital of a political entity
 * 				ADM1 - 5	-> first/second/third/fourth/fifth-order administrative division
 * 				PCLI		-> independent political entity
 * 				
 * \param 		fcode		Feature Code 
 * \return 		Array containing cities / countries
 * \author		hannes tressel
 */
function filterCityCountry(data) {
	var result = [];
	for (var i=0; i<data.length; i++) {
		var fcode = data[i].fcode;
		
		if (   fcode === "PPLA"  || fcode === "PPLA2" || fcode === "PPLA3" 
			|| fcode === "PPLA4" || fcode === "PPLC"  || fcode === "ADM1" 
			|| fcode === "ADM2"  || fcode === "ADM3"  || fcode === "ADM4"
			|| fcode === "ADM5"  || fcode === "PCLI"  ){
			result.push(data[i]);
		}
	}	
	return result;
}