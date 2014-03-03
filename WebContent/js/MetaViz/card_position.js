
//before changing global vars check dependencies to line_position.js and others

  var card_size_with_buffer = 100;
  var half_card_size = 45;
   
  var mini_card_with_buffer = 60;
  var half_mini_card_size = 25; 
   
  var quarter_detail_card = 5;

function positionModel(id) { 
  var top = (num_lin_ds) / 2 * card_size_with_buffer;     
  
  if (id === "usage_model_1" || id === "usage_model_mini_1") {
	  //new 2012-12-06
	  if (num_lin_ds == 0) { 
		  dojo.byId("usage_model_1").style.top = (20) + 'px'; 
		  dojo.byId("usage_model_0").style.top = (130) + 'px'; 
	  
		  dojo.byId("usage_model_mini_0").style.top = (130) + 'px';
		  dojo.byId("usage_model_mini_1").style.top = (-30) + 'px'; 
		//ende new 2012-12-06
	  } else { 
		  dojo.byId("usage_model_1").style.top = (top-60) + 'px'; 
		  dojo.byId("usage_model_0").style.top = (top+50) + 'px'; 
	  
		  dojo.byId("usage_model_mini_0").style.top = (top-60) + 'px';
		  dojo.byId("usage_model_mini_1").style.top = (top) + 'px';
	  }
  } else { 
	  dojo.byId(id).style.top = top + 'px';
  }
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
	     for (var i = 0; i < num_ds; i++){
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
  
      var ds_array = mStore.getValues(mapping_JSON, "usage_model_"+k);   
      var num_ds = ds_array.length;  
      
      console.log("MODEL K:" + model_array[k]);
      var mo_id = model_array[k];
      
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
			         if (dojo.byId(id_string + no) != null) dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
		        } else { 
			         y_pos_absolute = mod_middle + y_pos_relative; 
			         if (dojo.byId(id_string + no) != null) dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
		        }
	       } //end for (ds)
      } else {
	       for (var i = 0; i < num_ds; i++){
		        var faktor = getPosition(i, num_ds, 1);
		        var y_pos_relative = Math.abs(faktor) * o_ds + (Math.abs(faktor) + 1/2) * h_ds;

		        var no = getIdNumber(ds_array[i]);

		        if (faktor <= 0) {
			         y_pos_absolute = mod_middle - y_pos_relative; 
			         if (dojo.byId(id_string + no) != null) dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
		        } else {
			         y_pos_absolute = mod_middle + y_pos_relative - h_ds;
			         if (dojo.byId(id_string + no) != null) dojo.byId(id_string + no).style.top = y_pos_absolute + 'px';
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

function getPosition(pos, max_vals, odd){
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