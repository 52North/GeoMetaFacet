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
var surface_height;
var toggleGroup;
var tempGroup;

function setLines() {  
  var num_ds;
  var lineage_ds_left, lineage_model_left, lineage_model_width, usage_ds_left, usage_model_left, usage_model_width, usage_dataset_width, usage_dataset_height, lineage_model_corner;
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
      usage_dataset_width=65;
      usage_dataset_height=45;
      lineage_model_corner=100;
  } else { 
      lineage_ds_left = 60;
      lineage_model_left = 100;
      detail_left = 240; 
      usage_model_left = 740;       
      usage_ds_left = 780; 
      lineage_model_width = 75;
      usage_model_width = 230;
      usage_dataset_width=250;
      usage_dataset_height=85;
      lineage_model_corner=70;
  }     
   
  //delete old surface - if there is one
  if (first == false &&  dojo.byId("actual_lines").hasChildNodes()) dojo.byId('actual_lines').removeChild(dojo.byId('actual_lines').firstChild);
  else { first = false; }
 
  
  if(maxInput>num_lin_ds && maxInput>num_us_ds)
	  surface_height = maxInput * card_size_with_buffer;  
  else if (num_lin_ds > num_us_ds) 
	  surface_height = num_lin_ds * card_size_with_buffer;
  else if (num_lin_ds == 0 && num_us_ds == 0) 
	  surface_height = card_size_with_buffer;
  else surface_height = num_us_ds * card_size_with_buffer;
   
  surface_height = surface_height + 2000; //we need a lil bit more space for linked arrows

  
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
      //surface.createLine({x1:lineage_ds_left, y1:ds_top_pos+offset, x2:lineage_model_left, y2:mod_top_pos+offset}).setStroke({color: "black", style: "Dot"}).moveToFront();        
      drawArrow({start: {x : lineage_ds_left, y :ds_top_pos+offset}, end: {x:lineage_model_left,y:mod_top_pos+offset}});
  }  
  
  if (num_ds == 0) { 
	  mod_top_pos = 0;
	  offset = 50;
  }
  
  // + lines lin_mod - detail  
  if (dojo.byId('lineage_model_0') != null) //surface.createLine({x1:lineage_model_left+lineage_model_width, y1:mod_top_pos+offset, x2:detail_left-30, y2:mod_top_pos+offset}).setStroke({color: "black", style: "Dot"}).moveToFront();    
  drawArrow({start: {x : lineage_model_left+lineage_model_width, y :mod_top_pos+offset}, end: {x:detail_left-30,y:mod_top_pos+offset}});

  if (lineage_hidden == false) {
    id_string = "usage_dataset_mini_"; 
  } else {
    id_string = "usage_dataset_";       
  } 
 
  toggleGroup = surface.createGroup();
  
  //line detail -> usage model / usage-model->usage dataset
  for (var k = 0; k<num_us_mod; k++) { 
      var us_mod_top_pos = getTopPosition(id_string+k);
      var ds_top_pos = getTopPosition(id_string+k); 
      var detail_top_pos = getTopPosition("detail_0");      
      
      //surface.createLine({x1:detail_left+detail_width-20, y1:detail_top_pos+offset, x2:usage_model_left-usage_model_width, y2:mod_top_pos+offset-5}).setStroke({color: "black", style: "Dot"}).moveToFront();   
      toggleGroup.add(drawArrow({color: "black" , arrowHeight:10, arrowWidth:2, start: {x:detail_left+detail_width-20,y:detail_top_pos+offset}, end: {x : usage_model_left-usage_model_width, y : us_mod_top_pos+offset-5}}));
         
      //surface.createLine({x1:usage_ds_left, y1:ds_top_pos+offset, x2:usage_model_left, y2:mod_top_pos+offset}).setStroke({color: "black", style: "Dot"}).moveToFront();
      drawArrow({start: {x : usage_model_left, y :us_mod_top_pos+offset}, end: {x:usage_ds_left,y:ds_top_pos+offset}});
      
      //check for link
      var _defaultStroke = {
    	  color : "black",
    	  style : "dot",
    	  width : 1
      };
      
      for(var m=0; m<linked_ds.length;m++) {
    	  if(linked_ds[m]=="usage_dataset_"+k) {
    		  var deepest = getTopPosition(id_string+(num_us_mod-1));
    		  var group = surface.createGroup();
    		  group.createPath()
    	      .moveTo(usage_ds_left+usage_dataset_width,ds_top_pos+offset)
    	      .lineTo(usage_ds_left+usage_dataset_width+50,ds_top_pos+offset)
    	      .lineTo(usage_ds_left+usage_dataset_width+50,deepest + (usage_dataset_height*2))
    	      .lineTo(lineage_model_left-20,deepest + (usage_dataset_height*2))
    	      .lineTo(lineage_model_left-20,mod_top_pos+offset)
    	      .setStroke(_defaultStroke)
    	      ;  
    		  drawArrow({start: {x:lineage_model_left-20,y:mod_top_pos+offset}, end: {x : lineage_model_left, y : mod_top_pos+offset}});   
    	  } 
      }
  }

}

function getTopPosition(id) {  
  //if (id.indexOf("usage_model") > -1 && id.indexOf("_0") < 0 && id.indexOf("_1") < 0) id += "_0"; // <- whats that? 
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

//draw an arrow to surface
function drawArrow(p) {
    //Create a group that can be manipulated as a whole
    var group = surface.createGroup();
    var x1 = p.start.x,
        y1= p.start.y,
        x2 = p.end.x,
        y2= p.end.y;
    var _arrowHeight = p.arrowHeight || 10;
    var _arrowWidth = p.arrowWidth || 2;
    var len = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2));
    var _defaultStroke = {
        color : p.color || "black",
        style : p.style ||"dot",
        width : 1
    };
    
    //Add a line to the group
    group.createLine({
        x1 : 0, y1 : 0,
        x2 : 0+len, y2 : 0
    }).setStroke(p.stroke || _defaultStroke);

    //add triangle path
    group.createPath()
    .moveTo(len-_arrowHeight,0)
    .lineTo(len-_arrowHeight,-_arrowWidth)
    .lineTo(len,0)
    .lineTo(len-_arrowHeight,_arrowWidth)
    .lineTo(len-_arrowHeight,0)
    .setStroke(p.stroke || _defaultStroke)
    .setFill(p.stroke ? p.stroke.color : _defaultStroke.color );

    var _rot = Math.asin((y2-y1)/len)*180/Math.PI;
    if (x2 <= x1) {_rot = 180-_rot;}

    //Translate and rotate the entire group as a whole
    group.setTransform([
        dojox.gfx.matrix.translate(x1,y1),
        dojox.gfx.matrix.rotategAt(_rot,0,0)
    ]);
   return group;
}
