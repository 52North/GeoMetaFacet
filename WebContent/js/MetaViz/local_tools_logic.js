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

  var actual_id; 
  
  //-------------- moving tools in dep. of mouse move -------------------------------------------
  //-> getting right tool in dep. of overed card an its properties - sets position of tool and style visible
  //-- id - String id of dataset, model, service
  function show_tools(id, has_info, has_viewing, has_store) {     	  
	actual_id = id; 
    var tool_id;
     
    var move_Pos0 = 36;   //lin ds mini
    var move_Pos1 = 155;  //lin ds
    var move_Pos1b = 151;
    var move_Pos2 = 421;  //lin model
    var move_Pos2b = 371;
    var move_Pos3 = 791;
    var move_Pos4 = 641;
    var move_Pos5 = 721;  //detail full lin
    var move_Pos6 = 1041;
    var move_Pos7 = 896;
    var move_Pos8 = 1011;
    var move_Pos9 = 935;
    var move_Pos10 = 1271;
       
    var move_right = 0;
    
    hide_tools(); //hiding all tools first 
 
    if (has_viewing == "true" && has_store == "true" && has_info == "true") {  
      tool_id = "tools_full"; 
      dojo.byId(tool_id).style.visibility = "visible"; 
    } else if (has_viewing == "true" && has_store == "false" && has_info == "true") {  
      tool_id = "tools_view_info"; 
      move_right = 25;
      dojo.byId(tool_id).style.visibility = "visible"; 
    } else if (has_viewing == "false" && has_store == "true" && has_info == "true") {  
      tool_id = "tools_save_info";  
      move_right = 25;    
      dojo.byId(tool_id).style.visibility = "visible"; 
    } else if (has_info == "true" && has_store == "false" && has_viewing == "false") {  
      tool_id = "tools_info"; 
      move_right = 50;
      dojo.byId(tool_id).style.visibility = "visible";  
    } else if (has_info == "false" && has_store == "true" && has_viewing == "false") {  
      tool_id = "tools_save"; 
      move_right = 50;
      dojo.byId(tool_id).style.visibility = "visible"; 
    } else if (has_info == "false" && has_store == "false" && has_viewing == "true") {  
      tool_id = "tools_view"; 
      move_right = 50;
      dojo.byId(tool_id).style.visibility = "visible"; 
    } else if (has_info == "false" && has_store == "true" && has_viewing == "true") {  
      tool_id = "tools_save_view"; 
      move_right = 25;
      dojo.byId(tool_id).style.visibility = "visible"; 
    }
  
    if (tool_id != null) {
    //lineage dataset      
    if (id.indexOf('dataset') != -1 && id.indexOf('lineage') != -1) { 
      if (id.indexOf('mini') == -1) dojo.byId(tool_id).style.left = move_Pos1 + move_right + "px"; 
      else dojo.byId(tool_id).style.left = move_Pos0 + "px"; 
    }
     
    //lineage model  
    if (id.indexOf('model') != -1 && id.indexOf('lineage') != -1) { 
      if (id.indexOf('mini') == -1) dojo.byId(tool_id).style.left = move_Pos2 + move_right + "px";  
      else dojo.byId(tool_id).style.left = move_Pos1b + "px";   
    }
    
    //detail 
    if (dojo.byId('lineage_model_0') == null && dojo.byId('usage_model_0') == null) dojo.byId(tool_id).style.left = "651px";
    else if (id.indexOf('detail') != -1 && !lineage_hidden) dojo.byId(tool_id).style.left = move_Pos5 + move_right + "px";   
    else if (id.indexOf('detail') != -1 && lineage_hidden) dojo.byId(tool_id).style.left = move_Pos2b + move_right + "px";    
 
    //usage dataset + lin not hidden
    if (id.indexOf('dataset') != -1 && id.indexOf('usage') != -1 && !lineage_hidden) {
      if (id.indexOf('mini') == -1) dojo.byId(tool_id).style.left = move_Pos10 + move_right + "px";  
      else dojo.byId(tool_id).style.left = move_Pos8 + "px";
    }
       
    //usage dataset + lin hidden  
    if (id.indexOf('dataset') != -1 && id.indexOf('usage') != -1 && lineage_hidden) 
      dojo.byId(tool_id).style.left = move_Pos9 + move_right + "px"; 
    
    //usage model + lin not hidden
    if (id.indexOf('model') != -1 && id.indexOf('usage') != -1 && !lineage_hidden) {
      if (id.indexOf('mini') == -1) dojo.byId(tool_id).style.left = move_Pos7 + move_right + "px";    
      else dojo.byId(tool_id).style.left = move_Pos6 + "px";     
    }  
    
    //usage model + lin hidden
    if (id.indexOf('model') != -1 && id.indexOf('usage') != -1 && lineage_hidden) {
      if (id.indexOf('mini') == -1) dojo.byId(tool_id).style.left = move_Pos4 + "px";      
      else dojo.byId(tool_id).style.left = move_Pos4 + "px";
    }  
  
    if (id.indexOf('mini') == -1) dojo.byId(tool_id).style.top = dojo.byId(id).offsetTop +30 + "px";     
    else dojo.byId(tool_id).style.top = dojo.byId(id).offsetTop + 40 + "px";
    }   
  } 
  
  //-> hiding all tools
  function hide_tools() {
    dojo.byId("tools_full").style.visibility = "hidden";  
    dojo.byId("tools_view_info").style.visibility = "hidden";      
    dojo.byId("tools_save_info").style.visibility = "hidden";
    dojo.byId("tools_save_view").style.visibility = "hidden";    
    dojo.byId("tools_info").style.visibility = "hidden";
    dojo.byId("tools_view").style.visibility = "hidden";
    dojo.byId("tools_save").style.visibility = "hidden";
  }
   
  //-------------- actions pushing a tool button -------------------------------------------
  
  function show_view_menu() {
    var data;
    mStore.fetchItemByIdentity({ identity: "mapping_ids_uuids", onItem: function(item, request) { data = item; }});
    
    if (actual_id.indexOf('mini') != -1) actual_id = actual_id.replace('_mini','');
    var mapped_id = mStore.getValues(data, actual_id); 
    guiFunctions.setItemDetailsWithoutHiding(mapped_id);
    guiFunctions.scrollToSpecificPoint(mapped_id); 
    time4Maps.showTime4MapsId(mapped_id);
//    var map;
//    mStore.fetchItemByIdentity({ identity: mapped_id, onItem: function(item, request) { map = item; }});
//     
//    window.open("http://geoportal.glues.geo.tu-dresden.de:8080/Time4Maps/start.jsp?url="+map.view);
  }
  
  function show_info_menu() { 
    var data;
    mStore.fetchItemByIdentity({ identity: "mapping_ids_uuids", onItem: function(item, request) { data = item; }});

    if (actual_id.indexOf('mini') != -1) actual_id = actual_id.replace('_mini','');
    var mapped_id = mStore.getValues(data, actual_id); 
    
    var map;
    mStore.fetchItemByIdentity({ identity: mapped_id, onItem: function(item, request) { map = item; }});  
    window.open(map.info);
  }
  
  function show_save_menu() {
    var data;
    mStore.fetchItemByIdentity({ identity: "mapping_ids_uuids", onItem: function(item, request) { data = item; }});

    if (actual_id.indexOf('mini') != -1) actual_id = actual_id.replace('_mini','');
    var mapped_id = mStore.getValues(data, actual_id); 
    
    var map;
    mStore.fetchItemByIdentity({ identity: mapped_id, onItem: function(item, request) { map = item; }});
    window.open(map.save);
  }
  
  function focus_element(id) {
	var mappings;
    mStore.fetchItemByIdentity({ identity: "mapping_ids_uuids", onItem: function(item, request) { mappings = item; }});
    
    var mapped_id = mStore.getValues(mappings, id); 

    var entry = httpGet(findInternId + "/" + mapped_id);
    mapped_id = entry.id;
 
    metaVizOn = true;
    
    guiFunctions.setItemDetailsWithoutHiding(mapped_id);
    guiFunctions.scrollToSpecificPoint(mapped_id); 
    
    metaVizOn = false;
  }
  
  function showChildren() {
	  dojo.byId("children_div").style.visibility = "visible";
  }
  
  function hideChildren() {
	  dojo.byId("children_div").style.visibility = "hidden";
  }