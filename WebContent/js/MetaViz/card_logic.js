  
  function checkTitleLength() {
  
    for (var i = 0; i < lineage_dataset_cards; i++) {    
      var id_title = "lineage_dataset_" + i + "_title";
      var id_type = "lineage_dataset_" + i + "_type";
      var id_orga = "lineage_dataset_" + i + "_organisation"; 
       
      if (dojo.byId(id_title).innerHTML.length >= 35) {
        dojo.byId(id_title).style.fontSize="12px";
        dojo.byId(id_type).style.fontSize="10px";    
        dojo.byId(id_title).style.paddingTop="5px";
        dojo.byId(id_orga).style.paddingTop="5px";
      }    
    }
    
    for (var i = 0; i < usage_dataset_cards; i++) {    
      var id_title = "usage_dataset_" + i + "_title";
      var id_type = "usage_dataset_" + i + "_type";
      var id_orga = "usage_dataset_" + i + "_organisation";
      
      if (dojo.byId(id_title).innerHTML.length >= 35) {
        dojo.byId(id_title).style.fontSize="12px";
        dojo.byId(id_type).style.fontSize="10px";    
        dojo.byId(id_title).style.paddingTop="5px";
        dojo.byId(id_orga).style.paddingTop="5px";
      }    
    }
    
    for (var i = 0; i < lineage_model_cards; i++) {    
      var id_title = "lineage_model_" + i + "_title";
      var id_type = "lineage_model_" + i + "_type";
      var id_orga = "lineage_model_" + i + "_organisation";
      
      if (dojo.byId(id_title).innerHTML.length >= 35) {
        dojo.byId(id_title).style.fontSize="12px";
        dojo.byId(id_type).style.fontSize="10px";    
        dojo.byId(id_title).style.paddingTop="5px";
        dojo.byId(id_orga).style.paddingTop="5px";
      }    
    }
    
    for (var i = 0; i < usage_model_cards; i++) {    
      var id_title = "usage_model_" + i + "_title";
      var id_type = "usage_model_" + i + "_type";
      var id_orga = "usage_model_" + i + "_organisation";
    
      if (dojo.byId(id_title).innerHTML.length >= 35) {
        dojo.byId(id_title).style.fontSize="12px";
        dojo.byId(id_type).style.fontSize="10px";    
        dojo.byId(id_title).style.paddingTop="5px";
        dojo.byId(id_orga).style.paddingTop="5px";
      }    
    }
    
    var id_title = "detail_0_title";
    var id_type = "detail_0_type";
    var id_orga = "detail_0_organisation";
    
    if (dojo.byId(id_title).innerHTML.length >= 35) {
      dojo.byId(id_title).style.fontSize="12px";
      dojo.byId(id_type).style.fontSize="10px";    
      dojo.byId(id_title).style.paddingTop="5px";
      dojo.byId(id_orga).style.paddingTop="5px";
    }       
  }
 
