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
  var det_desc_tip;
  var usage_inputs = [];
  var linked_ds = [];
  var savedDS;
  var maxInput;

  function initMetaViz(storeData) {    
    mStore = new dojo.data.ItemFileReadStore({ data:storeData });

    initData();
    initStylesAndTools();
     
    fillLineage();
    buildTooltips();

    det_desc_tip = new dijit.Tooltip({ connectId: ["detail_title"],
        label: '<div class="tooltip"></div>' 
  	});    
  }
  
  function initData() {
    var ds_data;
    mStore.fetchItemByIdentity({ identity: "datasets", onItem: function(item, request) { ds_data = item; }});
    var ds_ids = mStore.getAttributes(ds_data);    
    preprocessData(ds_ids);
 
    var mod_data;
    mStore.fetchItemByIdentity({ identity: "models", onItem: function(item, request) { mod_data = item; }});
    var mod_ids = mStore.getAttributes(mod_data);    
    preprocessModel(mod_ids);
 
    var mappings;
    mStore.fetchItemByIdentity({ identity: "mapping_ids_uuids", onItem: function(item, request) { mappings = item; }}); 
 
    //MODELS
    maxInput=0;
    for (var i = 0; i < num_lin_mod; i++) {
    	console.log("num_lin_mo:"+i);
      var model; 
      var mappedID = mStore.getValues(mappings, "lineage_model_" + i);    
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { model = item; }}); 
      //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, info, viewing, store
      if (model != null) buildCardSet("Model", model.title, model.organisation, "", "", model.type+"_model", false, false, false, false, false);
    }
    
    for (var i = 0; i < num_us_mod; i++) { 
    	console.log("num_us_mod:"+i);
      var model;      
      var mappedID = mStore.getValues(mappings, "usage_model_" + i);    
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { model = item; }}); 
      //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, info, viewing, store
      if (model != null) {
    	  buildCardSet("Model", model.title, model.organisation, "", "", model.type+"_model", false, false, false, false, false);
    	  		
    	  //get inputs for usage models
    	  var inputs = [];
    	  for(var k = 0; k<model.input_datasets.length;k++){
    		  inputs.push(model.input_datasets[k]);
    	  }
    	  usage_inputs["usage_model_"+i]=inputs; 
    	  if(maxInput<inputs.length)maxInput=inputs.length;
      }
    }
   
    //DATASETS      // changed <= to <
    
    //TODO: buildcard for usage inputs + preprocessData, counter for usage_ds_input
    
    for (var i=0; i<num_lin_ds; i++) {
    	console.log("num_lin_ds:"+i);
      var mappedID = mStore.getValues(mappings, "lineage_dataset_"+i);  
      var ds;
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { ds = item; }});
       
      if (ds != null) {
    	  var ds_time = ""; var is_time = false; var has_view = false; var has_save = false; var has_info = false;
    	  if (ds.time != null && ds.time[0] != "") { ds_time = ", <br />" + ds.time; is_time = true; }
    	  if ((ds.view != null && ds.view[0] != "") && ((ds.view[0].indexOf("catalog")) < 0) && (ds.view[0].indexOf("null") > 0)) { has_view = true; }
    	  if (ds.save != null && ds.save[0] != "") { has_save = true; }
    	  if (ds.info != null && ds.info[0] != "") { has_info = true; }
    	  //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, viewing, save
    	  buildCardSet("Dataset", ds.title, ds.organisation, ds.extent + ds_time, "", "lineage_dataset", ds.vector, is_time, has_info, has_view, has_save);
    	  //changed type to fixed "lineage"
      }    
    }
    
    for (var i = 0; i < num_us_ds; i++) {
    	console.log("num_us_ds:"+i);
      var mappedID = mStore.getValues(mappings, "usage_dataset_"+i);  
      var ds;
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { ds = item; }});
       
      if (ds != null) {
    	if (ds.linked_2_modelInput==1) linked_ds.push("usage_dataset_"+i); //saves usage ds which are linked to model
    	  
    	var ds_time = ""; var is_time = false; var has_view = false; var has_save = false; var has_info = false;
      	if (ds.time != null && ds.time[0] != "") { ds_time = ", <br />" + ds.time; is_time = true; }
      	if ((ds.view != null && ds.view[0] != "") && ((ds.view[0].indexOf("catalog")) < 0) && (ds.view[0].indexOf("null") > 0)) { has_view = true; }
      	if (ds.save != null && ds.save[0] != "") { has_save = true; }
      	if (ds.info != null && ds.info[0] != "") { has_info = true; }
      	//displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, viewing, save
      	buildCardSet("Dataset", ds.title, ds.organisation, ds.extent + ds_time, "", ds.type+"_dataset", ds.vector, is_time, has_info, has_view, has_save);
      }
    }
    
    //DETAIL
    var detailId;
    mStore.fetchItemByIdentity({ identity: "mapping_ids_uuids", onItem: function(item, request) { detailId = item; }}); 
  
    var detail;
    mStore.fetchItemByIdentity({ identity: detailId.detail_0[0], onItem: function(item, request) { detail = item; }});
    savedDS=detailId.detail_0[0];
    var ds_time = ""; var is_time = false; var has_view = false; var has_save = false; var has_info = false;
    if (detail.time != "") { ds_time = ",<br />" + detail.time; is_time = true; }
    if ((detail.view != null && detail.view[0] != "") && ((detail.view[0].indexOf("catalog")) < 0) && (detail.view[0].indexOf("null") > 0)) { has_view = true; }
    if (detail.save != "") { has_save = true; }
    if (detail.info != "") { has_info = true; }
    //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, viewing, save
    buildCardSet("Dataset", detail.title, detail.organisation, detail.extent + ds_time, detail.description, "detail", detail.vector, is_time, has_info, has_view, has_save);    
//    dojo.byId('sub_title').innerHTML = "Viewing details for dataset "+detail.title; 
  }
 
   //counting all lin and us datasets
  function preprocessData(ds_ids) {
     for (var i=0;i<ds_ids.length;i++) {
      var ds; 
      if (ds_ids[i] != "paramName") {
          mStore.fetchItemByIdentity({ identity: ds_ids[i], onItem: function(item, request) { ds = item; }});    
          if (ds != null && ds.paramName != null) { 
        	  if (ds.type == "lineage" || ds.linked_2_modelInput==1) num_lin_ds++; //changed for proper input display - deleted else because linked=usage
        	  if (ds.type == "usage") num_us_ds++;
          }
      }
    } 
  }
  
  //counting all lin and us models
  function preprocessModel(mod_ids) {
     for (var i=0; i<mod_ids.length; i++) { 
      var mod;
      
      if (mod_ids[i] != "paramName") {
          mStore.fetchItemByIdentity({ identity: mod_ids[i], onItem: function(item, request) { mod = item; }});    
          if (mod.type == "lineage") num_lin_mod++;
          else if (mod.type == "usage") num_us_mod++; 
      }
    } 
  }
  
  function initStylesAndTools() {
    setWhiteSize();
    positionDatasets();      
    initializeLocalTools();   
    toggleLineage();     
    if(num_us_mod>2)setModels(); //to add n-models in card-position
    //drawLink(); 
    setLines();
  }