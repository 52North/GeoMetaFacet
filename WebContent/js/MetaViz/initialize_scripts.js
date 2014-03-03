  
  var det_desc_tip;

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
    for (var i=0;i<num_lin_mod;i++) {
      var model; 
      var mappedID = mStore.getValues(mappings, "lineage_model_"+i);    
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { model = item; }}); 
      //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, info, viewing, store
      if (model != null) buildCardSet("Model", model.title, model.organisation, "", "", model.type+"_model", false, false, false, false, false);
    }
    
    for (var i=0;i<num_us_mod;i++) { 
      var model;      
      var mappedID = mStore.getValues(mappings, "usage_model_"+i);    
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { model = item; }}); 
      //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, info, viewing, store
      if (model != null) buildCardSet("Model", model.title, model.organisation, "", "", model.type+"_model", false, false, false, false, false);
    }
   
    //DATASETS   
    for (var i=0; i<=num_lin_ds; i++) {
      var mappedID = mStore.getValues(mappings, "lineage_dataset_"+i);  
      var ds;
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { ds = item; }});
       
      if (ds != null) {
    	  var ds_time = ""; var is_time = false; var has_view = false; var has_save = false; var has_info = false;
    	  if (ds.time != null && ds.time[0] != "") { ds_time = ", <br />" + ds.time; is_time = true; }
    	  if (ds.view != null && ds.view[0] != "") { has_view = true; }
    	  if (ds.save != null && ds.save[0] != "") { has_save = true; }
    	  if (ds.info != null && ds.info[0] != "") { has_info = true; }
    	  //displayed type, title, organisation, time+extent, description, intern type (eg. lineage_model), vector, time, viewing, save
    	  buildCardSet("Dataset", ds.title, ds.organisation, ds.extent + ds_time, "", ds.type+"_dataset", ds.vector, is_time, has_info, has_view, has_save);
      }    
    }
    
    for (var i=0; i<=num_us_ds; i++) {
      var mappedID = mStore.getValues(mappings, "usage_dataset_"+i);  
      var ds;
      mStore.fetchItemByIdentity({ identity: mappedID, onItem: function(item, request) { ds = item; }});
       
      if (ds != null) {
    	var ds_time = ""; var is_time = false; var has_view = false; var has_save = false; var has_info = false;
      	if (ds.time != null && ds.time[0] != "") { ds_time = ", <br />" + ds.time; is_time = true; }
      	if (ds.view != null && ds.view[0] != "") { has_view = true; }
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
 
    var ds_time = ""; var is_time = false; var has_view = false; var has_save = false; var has_info = false;
    if (detail.time != "") { ds_time = ",<br />" + detail.time; is_time = true; }
    if (detail.view != "") { has_view = true; }
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
        	  if (ds.type == "lineage") num_lin_ds++;
        	  else if (ds.type == "usage") num_us_ds++;
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
    setLines();
  }