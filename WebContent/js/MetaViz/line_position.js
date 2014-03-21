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
// dependence: var lineage_hidden in navi_hide_show_logic.js
// dependence: var card_size_with_buffer in card_position.js

var first = true;
var surface;

function setLines() {  
  var surface_height, num_ds;
  var lineage_ds_left, lineage_model_left, lineage_model_width, usage_ds_left, usage_model_left, usage_model_width;
  var detail_left; 
  var detail_width = 250;//300;
  var id_string, mod_id_string;
  var offset = half_card_size;// half (mini) card size - to get lines in middle of card
   
  if (lineage_hidden == false) {//lineage in full size
      lineage_ds_left = 255;
      lineage_model_left = 290;//300//330;
      lineage_model_width = 235;//280;
      detail_left = 590;//660; 
      usage_model_left = 930;       
      usage_ds_left = 965; 
      usage_model_width = 75; 
  } else { 
      lineage_ds_left = 60;
      lineage_model_left = 100;
      detail_left = 240; 
      usage_model_left = 740;       
      usage_ds_left = 780; 
      lineage_model_width = 75;
      usage_model_width = 230;
  }     
   
  //delete old surface - if there is one
  if (first == false &&  dojo.byId("actual_lines").hasChildNodes()) dojo.byId('actual_lines').removeChild(dojo.byId('actual_lines').firstChild);
  else { first = false; }
                                                                               
  if (num_lin_ds > num_us_ds) surface_height = num_lin_ds * card_size_with_buffer;
  else if (num_lin_ds == 0 && num_us_ds == 0) surface_height = card_size_with_buffer;
  else surface_height = num_us_ds * card_size_with_buffer;
  
  if (num_us_ds > 0) 
	  surface = dojox.gfx.createSurface(dojo.byId('actual_lines'), 1100, surface_height);
  else {
	  surface = dojox.gfx.createSurface(dojo.byId('actual_lines'), 700, surface_height);
	  dojo.byId("usage_mini_cards").style.left = "-200px";
	  dojo.byId("lineage_info").style.width = "400px";
	  dojo.byId("publication_info").style.width = "400px";
  }
	  
  num_ds = num_lin_ds;
   
  if (lineage_hidden == false) {
      id_string = "lineage_dataset_";
      mod_id_string = "lineage_model_0"; 
  } else {
      id_string = "lineage_dataset_mini_";
      mod_id_string = "lineage_model_mini_0"; 
  }      
   
  for (var i = 0; i < num_ds; i++) {  
      var ds_top_pos = getTopPosition(id_string+i);      
      var mod_top_pos = getTopPosition(mod_id_string);  
      surface.createLine({x1:lineage_ds_left, y1:ds_top_pos+offset, x2:lineage_model_left, y2:mod_top_pos+offset}).setStroke({color: "black", style: "Dot"}).moveToFront();        
  }  
  
  if (num_ds == 0) { 
	  mod_top_pos = 0;
	  offset = 50;
  }
  
  // + lines lin_mod - detail  
  if (dojo.byId('lineage_model_0') != null) surface.createLine({x1:lineage_model_left+lineage_model_width, y1:mod_top_pos+offset, x2:detail_left-30, y2:mod_top_pos+offset}).setStroke({color: "black", style: "Dot"}).moveToFront();    

  var models;
  mStore.fetchItemByIdentity({ identity: "usage_models", onItem: function(item, request) { models = item; }});  
  var model_array = models.usage_model_ids;
  
  if (lineage_hidden == false) {
    id_string = "usage_dataset_mini_"; 
  } else {
    id_string = "usage_dataset_";       
  } 
 
  for (var k = 0; (k < models.usage_model_ids.length) && (models.usage_model_ids.length > 0); k++) { 
	  var mapping_JSON;  
      mStore.fetchItemByIdentity({ identity: "mod_ds_relations", onItem: function(item, request) { mapping_JSON = item; }});  
      
      var mod_top_pos = getTopPosition(model_array[k]);
      var ds_array = mStore.getValues(mapping_JSON, "usage_model_"+k);  
      var num_ds = ds_array.length;  
      //lines to detail to each usage model
      var detail_top_pos = getTopPosition("detail_0");             
      surface.createLine({x1:detail_left+detail_width-20, y1:detail_top_pos+offset, x2:usage_model_left-usage_model_width, y2:mod_top_pos+offset-5}).setStroke({color: "black", style: "Dot"}).moveToFront();   

	  for (var i = 0; i < num_ds; i++) { 
		  var ds_top_pos;
		  if (lineage_hidden == false) {
			  var no = getIdNumber(ds_array[i]);
			  ds_top_pos = getTopPosition("usage_dataset_mini_"+no); 
		  } else {
			  ds_top_pos = getTopPosition(ds_array[i]);  
		  }                   
		  surface.createLine({x1:usage_ds_left, y1:ds_top_pos+offset, x2:usage_model_left, y2:mod_top_pos+offset}).setStroke({color: "black", style: "Dot"}).moveToFront();          
      } //end for (ds)      
  } //end for (models) 
  //surface.createLine({x1:1070, y1:100, x2:1070, y2:1000}).setStroke({color: "black", style: "Dot"}).moveToFront();
 
}

function getTopPosition(id) {  
  if (id.indexOf("usage_model") > -1 && id.indexOf("_0") < 0 && id.indexOf("_1") < 0) id += "_0";
  if (id === "model_0") id = "usage_model_0";
 
  //new
  if (dojo.byId(id) == null && id === "model_1") {
	  id = "usage_model_1";
  }
  
  if (dojo.byId(id) != null) {
  	var pos_string = dojo.byId(id).style.top;   
  	var pos_top = parseInt(pos_string.slice(0,pos_string.length-2));  
  	return pos_top;
  } else {
	return 0;
  }
}
