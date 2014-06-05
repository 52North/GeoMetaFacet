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

//before changing global vars check dependencies to line_position.js and others

  var card_size_with_buffer = 100;
  var half_card_size = 45;
   
  var mini_card_with_buffer = 60;
  var half_mini_card_size = 25; 
   
  var quarter_detail_card = 5;
  //var counter = 0;
  
function positionModel(id) { 
	var count = 0;
	if(num_us_ds>num_lin_ds)count=num_us_ds; //get highest amount of datasets to set the top value of lineage model - proper visualization depends on it
	else count = num_lin_ds;
	var top = (count) / 2 * card_size_with_buffer;  

  if (id === "lineage_model_0" || id === "lineage_model_mini_0"){ //TODO:will there be more than 1 lineage model?
	  dojo.byId(id).style.top = top + 'px';
  }else if (id === "usage_model_0"){
	  dojo.byId(usage_model_0).style.top = top + 'px';
	  dojo.byId(usage_model_mini_0).style.top = top + 'px';
	  
  } else
  if (id === "usage_model_1" || id === "usage_model_mini_1") {
	  //counter=1;
	  //new 2012-12-06
	  if (num_lin_ds == 0) { 
		  dojo.byId("usage_model_0").style.top = (20) + 'px'; 
		  dojo.byId("usage_model_1").style.top = (130) + 'px'; 
	  
		  dojo.byId("usage_model_mini_0").style.top = (130) + 'px';
		  dojo.byId("usage_model_mini_1").style.top = (-30) + 'px'; 
		//ende new 2012-12-06
	  } else { 
		  dojo.byId("usage_model_0").style.top = (top-60) + 'px'; 
		  dojo.byId("usage_model_1").style.top = (top+50) + 'px'; 
	  
		  dojo.byId("usage_model_mini_0").style.top = (top-60) + 'px';
		  dojo.byId("usage_model_mini_1").style.top = (top) + 'px';
	  }
  }
  
 /* else if(1==100) {                  //since positionDatasets already calculates top values, model.top is the same as ds.top 
	  counter++;						// -> setModels() - called from initializer_scripts.js / initStylesandTools()
	  var h_ds = 90;
	  //var h_ds_mini = 50;
	  var o_ds = 10;
	  var mod_middle = top + (h_ds / 2);
	  //var mod_middle_mini = top + (h_ds_mini / 2);
	  //set height
	  for (var i=0 ; i< counter;i++){
		  dojo.byId("usage_model_"+i).style.height = 85 + 'px';
		  dojo.byId("usage_model_mini_"+i).style.height = 45 + 'px';
	  }
	  //set top
	  if (counter % 2 == 0) {
		  alert('oben');
		     for (var i = 0; i < counter; i++) { 
		    	 var faktor = getPosition(i, counter, 0); 
		         var y_pos_relative = Math.abs(faktor) * h_ds + (Math.abs (faktor) + 1/2) * o_ds;
		         var y_pos_absolute;
			      if (faktor < 0) {
				       y_pos_absolute = mod_middle - y_pos_relative; 
				       dojo.byId("usage_model_"+i).style.top = y_pos_absolute + 'px';
			      } else { 
				       y_pos_absolute = mod_middle + y_pos_relative; 
				       dojo.byId("usage_model_"+i).style.top = y_pos_absolute + 'px';  
			      }
		    }
	    } else {
		     for (var i = 0; i < counter; i++){ //85 25 85
		    	 
			      var faktor = getPosition(i, counter, 1);
			      var y_pos_relative = Math.abs(faktor) * o_ds + (Math.abs(faktor) + 1/2) * h_ds;
			      
			      if (faktor <= 0) {
				       y_pos_absolute = mod_middle - y_pos_relative; 
				       dojo.byId("usage_model_"+i).style.top = y_pos_absolute + 'px';

			      } else {
				       y_pos_absolute = mod_middle + y_pos_relative - h_ds;
				       dojo.byId("usage_model_"+i).style.top = y_pos_absolute + 'px';

			      }
		     }
	    }
 	}*/

}
  
function positionDetail(id) { //correcting detail position          
  var mod_pos_string;
  if (dojo.byId('lineage_model_0') != null) 
	  mod_pos_string = dojo.byId('lineage_model_0').style.top; 
  else if (dojo.byId('usage_model_0') != null) 
	  mod_pos_string = dojo.byId('usage_model_0').style.top;  
  else mod_pos_string = "70px";
  
  if (dojo.byId('lineage_model_0') == null && dojo.byId('usage_model_1') != null) {
	  mod_pos_string = '75px';
  }
  
  var mod_position = parseInt(mod_pos_string.slice(0,mod_pos_string.length-2));        
  var top = mod_position - quarter_detail_card;               
  dojo.byId(id).style.top = top + 'px';   
}

function positionDatasets() {
  var mod_pos_string;
  if (dojo.byId('lineage_model_0') != null) mod_pos_string = dojo.byId('lineage_model_0').style.top; 
  else if (dojo.byId('usage_model_0') != null) mod_pos_string = dojo.byId('usage_model_0').style.top;
  else mod_pos_string = "20px"; 
  
  //new 2012-12-06
  if (dojo.byId('usage_model_0') != null && dojo.byId('usage_model_1') != null && num_lin_ds == 0) {
	 var modtop = dojo.byId('usage_model_0').style.top; 
	 mod_pos_string = parseInt(modtop.slice(0,modtop.length-2)) - 50 + "px";
  }
  //end new
  
  var mod_position = parseInt(mod_pos_string.slice(0,mod_pos_string.length-2));  
  var mod_middle;
  
  var h_ds;       // 50/90
  var o_ds = 10;  // offset DS - (top + bottom)
  var num_ds;             

  var id_string;
 
  for (var j = 0; j < 3; j++) { //combinations of min/normal lineage/usage
                                           
    if (j == 0) h_ds = 50;  //mini-cards
    else h_ds = 90;         //normal cards
  
    if (j == 0 || j == 1) num_ds = num_lin_ds; //lineage
    else num_ds = num_us_ds;                   //usage

    if (j == 0) id_string = "lineage_dataset_mini_";
    else if (j == 1) id_string = "lineage_dataset_";
    else if (j == 2) id_string = "usage_dataset_"; 

    mod_middle = mod_position + (h_ds / 2); //mid of model (horizontal axis) 

    //if (num_ds == 0) num_ds = 1; //new 2012-12-04
    
    if (num_ds % 2 == 0) {
	     for (var i = 0; i < num_ds; i++) { 
		      var faktor = getPosition(i, num_ds, 0); 
		      var y_pos_relative = Math.abs(faktor) * h_ds + (Math.abs (faktor) + 1/2) * o_ds;
		      var y_pos_absolute; 
		
		      if (faktor < 0) {
			       y_pos_absolute = mod_middle - y_pos_relative;  
			       if (dojo.byId(id_string + i) != null) dojo.byId(id_string + i).style.top = y_pos_absolute + 'px';
		      } else { 
			       y_pos_absolute = mod_middle + y_pos_relative; 
			       if (dojo.byId(id_string + i) != null) dojo.byId(id_string + i).style.top = y_pos_absolute + 'px';
		      }
	    }
    } else {
	     for (var i = 0; i < num_ds; i++) {
		      var faktor = getPosition(i, num_ds, 1);
		      var y_pos_relative = Math.abs(faktor) * o_ds + (Math.abs(faktor) + 1/2) * h_ds;

		      if (faktor <= 0) {
			       y_pos_absolute = mod_middle - y_pos_relative; 
			       if (dojo.byId(id_string + i) != null) dojo.byId(id_string + i).style.top = y_pos_absolute + 'px';
		      } else {
			       y_pos_absolute = mod_middle + y_pos_relative - h_ds;
			       if (dojo.byId(id_string + i) != null) dojo.byId(id_string + i).style.top = y_pos_absolute + 'px';
		      }
	     }
    }
  } //end for
 
  //setting usage mini according models
 
  var models;
  mStore.fetchItemByIdentity({ identity: "usage_models", onItem: function(item, request) { models = item; }});  
  
  var model_array = models.usage_model_ids;
  
  id_string = "usage_dataset_mini_";
  h_ds = 50;  
  o_ds = 10;
  
  for (var k = 0; k < models.usage_model_ids.length && models.usage_model_ids.length > 0; k++) { 
      var mapping_JSON;  
      //mStore.fetchItemByIdentity({ identity: model_array[k], onItem: function(item, request) { mapping_JSON = item; }});  
      mStore.fetchItemByIdentity({ identity: "mod_ds_relations", onItem: function(item, request) { mapping_JSON = item; }});  
  
      var ds_array = mStore.getValues(mapping_JSON, "usage_model_" + k);   
      var num_ds = ds_array.length;  
      
      console.log("MODEL K:" + model_array[k]);
      //var mo_id = model_array[k];
      var mo_id = "usage_dataset_" + k;
      
      var mod_pos_string = dojo.byId(mo_id).style.top;  
      var mod_position = parseInt(mod_pos_string.slice(0,mod_pos_string.length-2)); 
      var mod_middle = mod_position + (h_ds / 2); //mid of model (horizontal axis) 
 
      //same as above 
      if (num_ds % 2 == 0) {
	       for (var i = 0; i < num_ds; i++) {
		        var faktor = getPosition(i, num_ds, 0);
		        var y_pos_relative = Math.abs(faktor) * h_ds + (Math.abs (faktor) + 1/2) * o_ds;
		        var y_pos_absolute; 
		
		        var no = getIdNumber(ds_array[i]);//mapping_JSON.dataset_ids[i]);
		      
		        if (faktor < 0) {
			         y_pos_absolute = mod_middle - y_pos_relative;  			       
			         if (dojo.byId(id_string + no) != null) {
			        	 dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
			         }
		        } else { 
			         y_pos_absolute = mod_middle + y_pos_relative; 
			         if (dojo.byId(id_string + no) != null) {
			        	 dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
			         }
		        }
	       } //end for (ds)
      } else {
	       for (var i = 0; i < num_ds; i++){
		        var faktor = getPosition(i, num_ds, 1);
		        var y_pos_relative = Math.abs(faktor) * o_ds + (Math.abs(faktor) + 1/2) * h_ds;

		        var no = getIdNumber(ds_array[i]);

		        if (faktor <= 0) {
			         y_pos_absolute = mod_middle - y_pos_relative; 
			         if (dojo.byId(id_string + no) != null){
			        	 dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
			         }
		        } else {
			         y_pos_absolute = mod_middle + y_pos_relative - h_ds;
			         if (dojo.byId(id_string + no) != null){
			        	 dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
			         }
		        }
	       } //end for (ds)
      } //end else
  } //end for (models)   
}

function getIdNumber(id_string) { 
  var l_id = id_string.lastIndexOf("_")+1;
  var length = id_string.length;
  var no = id_string.slice(l_id,length);
  return parseInt(no);
}

function getPosition(pos, max_vals, odd) {
	if (odd == 0) { //gerade number of ds
		var a = max_vals / 2; //Mitte errechnen
		return (-a + pos);
		// pos 0 1 2 3 4 -> -2 -1 0 1 2
	} else { //ungerade number of ds
		var a = (max_vals - 1) / 2;
		return (-a + pos);
	}
}

function setWhiteSize() { 
  var factor;
  if (num_lin_ds > num_us_ds) factor = num_lin_ds;  
  else factor = num_us_ds;
  
  if (dojo.byId('lineage_model_0') == null && dojo.byId('usage_model_0') == null) factor = 1.5;
  if (factor < 2) factor = 2.0;
  
  dojo.byId('lin_pub_texts').style.top = (factor * card_size_with_buffer + 170) + "px";
  dojo.byId('hide_and_show').style.top = (factor * card_size_with_buffer + 170) + "px";
  //dojo.byId('page').style.height = (factor * card_size_with_buffer + 1000) + "px"; 
  if (dojo.byId('footer') != null) dojo.byId('footer').style.top = (factor * card_size_with_buffer + 980) + "px";
  dojo.byId('lineage_mini_cards').style.height = (factor * card_size_with_buffer) + "px";
  dojo.byId('usage_mini_cards').style.height = (factor * card_size_with_buffer) + "px";
}

//take top from usage dataset
function setModels() {
	for (var i = 0; i < num_us_mod; i++) {
		
		//set height
		dojo.byId("usage_model_" + i).style.height = 85 + 'px';
		dojo.byId("usage_model_mini_" + i).style.height = 45 + 'px';
		
		//set usage-NORMAL
		dojo.byId("usage_model_" + i).style.top = dojo.byId("usage_dataset_" + i).style.top;
		
		//usage-MINI   //TODO: even usage_model_mini = usage_model top , the vis is messed up - if-cond for i=1 fixed it for index.html but not for detail page - different top values, same scripts---
		if (i == 1) {
			var topString = dojo.byId("usage_dataset_mini_" + i).style.top;  
		    var top = parseInt(topString.slice(0, topString.length - 2));
		    top = top - 50; 
			dojo.byId("usage_model_mini_" + i).style.top = top;
		} else {			
		    //if (1==1) top = top - 50;
		    dojo.byId("usage_model_mini_" + i).style.top = dojo.byId("usage_model_" + i).style.top;
		}
		
		console.log(dojo.byId("usage_model_mini_" + i).style.top);
		console.log(dojo.byId("usage_dataset_mini_" + i).style.top);
		console.log("---------------------");
	}
}



var lastID = "";
//shows inputs from models while mouseclick //triggered from card_creation / generateCard() - mousedown
function showInputs(id) {
	dojo.byId("input_container").innerHTML = "";
	setLines();
	if (lastID == id) {
		lastID = "";
		return;
	} else lastID = id;
	
	toggleGroup.clear();
	
	var inputLength = usage_inputs[id].length;
	var top_dataset = getTopPosition("detail_0");
	var left_dataset = 210;
	var top_usage_model= getTopPosition(id);
	var left_usage_model= 510 ;
	var width = 255;
	
	var offset = 0;
	var distance = 0;
	if (top_usage_model < top_dataset) {
		distance = 50;
		offset= -50;
	} else {
		offset = 120 ;// 120
		distance = -50;
	}
	//top_dataset=top_dataset+100;
 
	//cards
	var cards = 0;
	for (var i = 0; i < inputLength; i++) {
		if (usage_inputs[id][i] != savedDS) {
			mStore.fetchItemByIdentity({ identity: usage_inputs[id][i], onItem: function(item, request) { ds = item; }});
			if (ds != null) {
				var is_time = false;
				if (ds.time != null && ds.time[0] != "") { ds_time = ", <br />" + ds.time; is_time = true; }
		        var html_card = "";  
		        html_card += "<div id=\"" + "input_dataset_" + i + "\" class=\"input_card\" style=\"top:" + (top_dataset - (cards*distance) + offset) + "px; \">";
		        html_card += "<p  style=\"font-size:10px;\">" + "DATASET INPUT" + "</p>";
		        var title = ds.title;
		        if(title[0].length>25)title=title[0].substring(0,25)+"...";
		        html_card += "<p  class=\"object_title\" style=\"top:-20px;\">" + title + "</p>";        
		        html_card += "</div>";
		        dojo.byId("input_container").innerHTML += html_card;
		        drawArrow({ start: { x: left_dataset + width + 3, y: offset + top_dataset - (cards * distance) + 20 }, end: { x : left_usage_model, y : top_usage_model + 55 }});   
		        cards++;
			}
		} else { 
			drawArrow({ start: { x: left_dataset + width + 3, y: top_dataset + 55 }, end: { x : left_usage_model, y : top_usage_model + 55 }});
		}
	}
}


