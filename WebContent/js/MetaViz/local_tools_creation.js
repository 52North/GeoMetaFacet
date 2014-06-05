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
  function initializeLocalTools() {
    dojo.byId("content").innerHTML += buildFull();
    dojo.byId("content").innerHTML += buildInfo();
    dojo.byId("content").innerHTML += buildView();
    dojo.byId("content").innerHTML += buildSave();
    dojo.byId("content").innerHTML += buildViewInfo();
    dojo.byId("content").innerHTML += buildSaveInfo(); 
    dojo.byId("content").innerHTML += buildSaveView();
  } 
  
  //-------------- creating the html code of each version -------------------------------------------
  
  function buildFull() {
	 var html_tools = "<div id=\"tools_full\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:85px;left:0px;top:0px;z-index:10000;\">";
     
	 if (dojo.byId("map") != null) {
    	 html_tools += "<div id=\"view_0\" class=\"icon_view\" style=\"top:7px;left:10px;\" onmousedown=\'show_view_menu()\'></div>";
    	 html_tools += "<div id=\"save_0\" class=\"icon_save\" style=\"top:-9px;left:33px;\" onmousedown=\'show_save_menu()\'></div>";
    	 html_tools += "<div id=\"info_0\" class=\"icon_info\" style=\"top:-25px;left:57px;\" onmousedown=\'show_info_menu()\'></div>";
    	 html_tools += "</div> ";
	 } else {
		 html_tools = buildSaveInfo();
		 html_tools = html_tools.replace(/tools_save_info/g, "tools_full");
	 }
     return html_tools;
  }
  
  function buildInfo() {
	 var html_tools = "<div id=\"tools_info\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:35px;left:0px;top:0px;z-index:10000;\">"; 
     html_tools += "<div id=\"info_1\" class=\"icon_info\" style=\"top:7px;left:10px;\" onmousedown=\'show_info_menu()\'></div>";
     html_tools += "</div> ";
     return html_tools;
  }
  
  function buildView() { 
	 var html_tools = "<div id=\"tools_view\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:35px;left:0px;top:0px;z-index:10000;\">"; 
	 if (dojo.byId("map") != null) 
		 html_tools += "<div id=\"view_1\" class=\"icon_view\" style=\"top:7px;left:10px;\" onmousedown=\'show_view_menu()\'></div>";
	 else 
		 html_tools = "<div id=\"tools_view\" class=\"local_tools\" style=\"visibility:hidden;height:0px;width:0px;left:0px;top:0px;z-index:10000;\">"; 
	 html_tools += "</div> ";
     return html_tools; 
  }
  
  function buildSave() {
     var html_tools = "<div id=\"tools_save\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:35px;left:0px;top:0px;z-index:10000;\">";
	 html_tools += "<div id=\"save_1\" class=\"icon_save\" style=\"top:7px;left:10px;\" onmousedown=\'show_save_menu()\'></div>";
     html_tools += "</div> ";
     return html_tools;
  }
  
  function buildViewInfo() { 
     var html_tools = "<div id=\"tools_view_info\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:60px;left:0px;top:0px;z-index:10000;\">";    
     if (dojo.byId("map") != null)  {
	     html_tools += "<div id=\"view_2\" class=\"icon_view\" style=\"top:7px;left:10px;\" onmousedown=\'show_view_menu()\'></div>"; 
	     html_tools += "<div id=\"info_2\" class=\"icon_info\" style=\"top:-9px;left:35px;\" onmousedown=\'show_info_menu()\'></div>";
	     html_tools += "</div> ";
     } else {
    	 html_tools = buildInfo();
    	 html_tools = html_tools.replace(/tools_info/g, "tools_view_info");
     }
     return html_tools;
  }
  
  function buildSaveInfo() {
     var html_tools = "<div id=\"tools_save_info\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:60px;left:0px;top:0px;z-index:10000;\">";       
	 html_tools += "<div id=\"save_2\" class=\"icon_save\" style=\"top:7px;left:10px;\" onmousedown=\'show_save_menu()\'></div>"; 
     html_tools += "<div id=\"info_3\" class=\"icon_info\" style=\"top:-9px;left:35px;\" onmousedown=\'show_info_menu()\'></div>";
     html_tools += "</div> ";
     return html_tools;
  }
  
  function buildSaveView() {
     var html_tools = "<div id=\"tools_save_view\" class=\"local_tools\" style=\"visibility:hidden;height:30px;width:60px;left:0px;top:0px;z-index:10000;\">";
     if (dojo.byId("map") != null) {
	     html_tools += "<div id=\"save_3\" class=\"icon_save\" style=\"top:7px;left:10px;\" onmousedown=\'show_save_menu()\'></div>"; 
	     html_tools += "<div id=\"view_3\" class=\"icon_view\" style=\"top:-9px;left:35px;\" onmousedown=\'show_view_menu()\'></div>";
	     html_tools += "</div> ";
     } else {
    	 html_tools = buildSave();
    	 html_tools = html_tools.replace(/tools_save/g, "tools_save_view"); 
     }
     return html_tools;
  }

  function buildTooltips() {
    //arrows top left
    new dijit.Tooltip({
      connectId: ["ial2"],
      label: '<div class="tooltip">Minimize lineage information.</div>'
    });
    new dijit.Tooltip({
      connectId: ["ial"],
      label: '<div class="tooltip">Maximize lineage information.</div>'
    });
    
    //icons raster/vector/time
    for (var i=0; i <= num_raster; i++) {
      new dijit.Tooltip({
          connectId: ["raster_"+i],
          label: '<div class="tooltip">This dataset contains raster.</div>'
      });
    }
    for (var i=0; i <= num_time; i++) {
      new dijit.Tooltip({
          connectId: ["time_"+i],
          label: '<div class="tooltip">This dataset is time variate.</div>'
      });
    }
    for (var i=0; i <= num_vector; i++) {
      new dijit.Tooltip({
          connectId: ["vector_"+i],
          label: '<div class="tooltip">This dataset contains vectors.</div>'
      });
    }
    
    //datasets
    for (var i=0; i <= num_lin_ds; i++) {
      new dijit.Tooltip({
          connectId: ["lineage_dataset_"+i],
          label: '<div class="tooltip">Click to get further information for this lineage dataset.</div>'
      });
      new dijit.Tooltip({
          connectId: ["lineage_dataset_mini_"+i],
          label: '<div class="tooltip">Click to get further information for this lineage dataset.</div>'
      });
    }
    for (var i=0; i <= num_us_ds; i++) {
      new dijit.Tooltip({
          connectId: ["usage_dataset_"+i],
          label: '<div class="tooltip">Click to get further information for this usage dataset.</div>'
      });
      new dijit.Tooltip({
          connectId: ["usage_dataset_mini_"+i],
          label: '<div class="tooltip">Click to get further information for this usage dataset.</div>'
      });
    }
    
    for (var i=0; i <= num_us_mod; i++) {
      new dijit.Tooltip({
          connectId: ["lineage_dataset_"+i],
          label: '<div class="tooltip">Click to get further information for this usage process.</div>'
      });
      new dijit.Tooltip({
          connectId: ["lineage_dataset_mini_"+i],
          label: '<div class="tooltip">Click to get further information for this usage process.</div>'
      });     
    }
    
    //icons view, info, save
    for (var i=0; i <= 3; i++) {
      new dijit.Tooltip({
          connectId: ["info_"+i],
          label: '<div class="tooltip">Click to get further information on another website.</div>'
      });
      new dijit.Tooltip({
          connectId: ["save_"+i],
          label: '<div class="tooltip">Click to download the dataset.</div>'
      });
      new dijit.Tooltip({
          connectId: ["view_"+i],
          label: '<div class="tooltip">Click to view the data in a map client. </div>'
      });
    }

  }