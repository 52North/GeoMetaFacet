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
 
