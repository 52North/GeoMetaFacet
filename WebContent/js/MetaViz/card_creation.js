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

  var lineage_model_cards = 0;
  var usage_model_cards = 0;
   
  var lineage_model_mini_cards = 0;
  var usage_model_mini_cards = 0;
     
  var lineage_dataset_cards = 0; 
  var usage_dataset_cards = 0;  

  var lineage_dataset_mini_cards = 0; 
  var usage_dataset_mini_cards = 0; 

  //-> initializes card creation
  //-- builds card itself (Background)
  //-- calls generateDescriptionset - building text elements of the card
  //-- calls generateIconset - building the icons on the left of the card
  
                        //type:       "Data set" or "Model" or "Data set - Driver"
                        //view_type:  "lineage_dataset", "usage_dataset", "lineage_model", "usage_model"
  function buildCardSet(type, title, organisation, extent_time, description, view_type, is_vector, is_time_aware, has_info, has_viewing, has_store) {
  
	 console.log("TITLE: " + title + " VIEW_TYPE: " + view_type); 
	  
    if (view_type == "detail") {
      dojo.byId("detail_container").innerHTML = generateCard(type, title, organisation, extent_time, description, view_type, is_vector, is_time_aware, has_info, has_viewing, has_store);
      positionDetail("detail_0");
    
    } else {   
      var mini_card_html = generate_mini_card(type, view_type, is_vector, is_time_aware, has_info, has_viewing, has_store);
      var card_html = generateCard(type, title, organisation, extent_time, description, view_type, is_vector, is_time_aware, has_info, has_viewing, has_store);  
        
      //it is a model  
      if (view_type.indexOf('model') != -1) {        
        if (view_type.indexOf('lineage') != -1) { //it is a lineage model
            dojo.byId("lineage_model_cards_container").innerHTML += card_html;
            dojo.byId("lineage_model_mini_cards_container").innerHTML +=  mini_card_html;          
            positionModel("lineage_model_"+(lineage_model_cards-1)); 
            positionModel("lineage_model_mini_"+(lineage_model_mini_cards-1));                     
        } else {                                  //it is a usage model
            dojo.byId("usage_model_cards_container").innerHTML += card_html;
            dojo.byId("usage_model_mini_cards_container").innerHTML +=  mini_card_html;          
            positionModel("usage_model_"+(usage_model_cards-1));
            //positionModel("usage_model_mini_"+(usage_model_mini_cards-1)); 
        }
        
       //it is a dataset 
      } else {  
         if (view_type.indexOf('lineage') != -1) { //it is a lineage dataset
            dojo.byId("lineage_dataset_cards_container").innerHTML += card_html;
            dojo.byId("lineage_dataset_mini_cards_container").innerHTML +=  mini_card_html; 
        } else {                                   //it is a usage dataset
            dojo.byId("usage_dataset_cards_container").innerHTML += card_html;
            dojo.byId("usage_dataset_mini_cards_container").innerHTML +=  mini_card_html; 
        }
      } //end of else model
    } //end of else detail
  }  //end of function buildCardSet
    
  //-> used variables 
  //-- type String - "dataset", "model", "service" - will be displayed as headline of card
  //-- title String - title of dataset, model, service
  //-- organisation String - responsible party for dataset, model, service
  //-- extent_time String - "World, 1901-2006" - can contain date or time range, if not "time_aware" just extent 
  //-- description String - abstract of dataset, model or service
  //-- view_type String - "lineage_dataset", "usage_dataset", "lineage_model", "usage_model", "detail" - gives position in layout/style info
  //-- is_vector bool - for building icons
  //-- is_raster bool - for building icons
  //-- is_time_aware bool - for building icons
  function generateCard(type, title, organisation, extent_time, description, view_type, is_vector, is_time_aware, has_info, has_viewing, has_store) {    
    var html_card = "";                                                                                                                                   //100 = card height (90) + margin (10)
    if (view_type == "lineage_dataset")     html_card += "<div id=\"" + "lineage_dataset_" + lineage_dataset_cards + "\" style=\"top:" + (lineage_dataset_cards - 1) * card_size_with_buffer  + "px;\" class=\"description_card\" onmouseover=\"show_tools(\'" + "lineage_dataset_" + lineage_dataset_cards + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\" onmousedown=\"focus_element(\'" + "lineage_dataset_" + lineage_dataset_cards + "\')\">"; 
    else if (view_type == "usage_dataset")  html_card += "<div id=\"" + "usage_dataset_" + usage_dataset_cards + "\" style=\"top:" + (usage_dataset_cards - 1) * card_size_with_buffer  + "px;\"  class=\"description_card\" onmouseover=\"show_tools(\'" + "usage_dataset_" + usage_dataset_cards + "\', \'"  + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\" onmousedown=\"focus_element(\'" + "usage_dataset_" + usage_dataset_cards + "\')\">";
    else if (view_type == "lineage_model")  html_card += "<div id=\"" + "lineage_model_" + lineage_model_cards + "\" class=\"description_card_petrol\" onmouseover=\"show_tools(\'" + "lineage_model_" + lineage_model_cards + "\', \'"  + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\">";
    else if (view_type == "usage_model")    html_card += "<div id=\"" + "usage_model_" +  usage_model_cards + "\" class=\"description_card_petrol\" onmouseover=\"show_tools(\'" + "usage_model_" + usage_model_cards + "\', \'"  + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\" onmousedown=\"showInputs(\'" + "usage_model_" + usage_model_cards + "\')\">";
    else if (view_type == "detail")         html_card += "<div id=\"" + "detail_0" + "\" class=\"description_card_colored_petrol\" onmouseover=\"show_tools(\'detail_0" + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\" onmousedown=\"focus_element(\'" + "detail_0" + "\')\">";
    // getting icons if card doesn't contain model information
    if (view_type.indexOf('model') == -1) html_card += generateIconset(false, is_vector, is_time_aware, true);   //icons (true = normal size)   
    else html_card += generateIconset(true, is_vector, is_time_aware, true); 
    //getting the text in the card
    html_card += generateDescriptionset(type, title, organisation, extent_time, description, view_type);             //text
    
    html_card += "</div>"; //end of card 
    return html_card;
  }
   
  var num_raster = 0; var num_vector = 0; var num_time = 0; 
     
  function generateIconset(is_model, is_vector, is_time_aware, normal_size) {
    var html_icons = "<div class=\"icons\">";
    
    if (!is_model) {
        if (is_vector === "true") { html_icons += "<div class=\"icon_vector\" id=\"vector_"+ num_vector +"\"></div>"; num_vector++; }
        else { html_icons += "<div class=\"icon_raster\" id=\"raster_"+ num_raster +"\"></div>"; num_raster++; }
    }
    
    if (normal_size && is_time_aware) { html_icons += "<div class=\"icon_time\" id=\"time_"+ num_time +"\"></div>"; num_time++; }
    else if (!normal_size && is_time_aware) { html_icons += "<div class=\"icon_time\" id=\"time_"+ num_time +"\" style=\"top:10px;left:35px;\"></div>"; num_time++; }
              
    html_icons += "</div>";
    return html_icons;
  }
                                        //view_type: lineage_/usage_dataset, lineage_/usage_model, detail
  function generateDescriptionset(type, title, organisation, extent_time, description, view_type) {
    var html_description = "";
    var id;
   
    if (view_type == "lineage_dataset") { id = lineage_dataset_cards; lineage_dataset_cards++; }
    else if (view_type == "usage_dataset") { id = usage_dataset_cards; usage_dataset_cards++; }
    else if (view_type == "lineage_model") { id = lineage_model_cards; lineage_model_cards++; }
    else if (view_type == "usage_model") { id = usage_model_cards; usage_model_cards++; }
    else if (view_type == "detail") id = 0;
    
    if (view_type == "lineage_model" || view_type == "usage_model") html_description += "<p id=\"" + view_type + "_" + id + "_type\" class=\"object_type\" style=\"left:10px;\">" + type + "</p>"; 
    else html_description += "<p id=\"" + view_type + "_" + id + "_type\" class=\"object_type\">" + type + "</p>"; 
  
    if (title[0].length > 23) {
    	var tit;
       if (title[0].length > 50) tit = title[0].substring(0,50) + "...";  
       else tit = title[0];
       
       if (view_type == "lineage_model" || view_type == "usage_model") html_description += "<p id=\"" + view_type + "_" + id + "_title\" class=\"object_title\" style=\"font-size:12px;left:10px;\">" + tit + "</p>"; 
       else html_description += "<p id=\"" + view_type + "_" + id + "_title\" class=\"object_title\" style=\"font-size:12px;\" onmousedown=\"focus_element(\'" + view_type + "_" + id + "\')\">" + tit + "</p>"; 
    } else {
    	if (view_type == "lineage_model" || view_type == "usage_model") html_description += "<p id=\"" + view_type + "_" + id + "_title\" class=\"object_title\" style=\"left:10px;\">" + title + "</p>";  
    	else html_description += "<p id=\"" + view_type + "_" + id + "_title\" class=\"object_title\" onmousedown=\"focus_element(\'" + view_type + "_" + id + "\')\">" + title + "</p>";  
    }
    if (organisation != null && organisation[0].length > 36) {
       if (organisation[0].length > 55) organisation[0]= organisation[0].substring(0,50) + "..."; 
       
       if (view_type == "lineage_model" || view_type == "usage_model") html_description += "<p id=\"" + view_type + "_" + id + "_organisation\" class=\"object_organisation\" style=\"left:10px;\">" + organisation + "</p>";
       else html_description += "<p id=\"" + view_type + "_" + id + "_organisation\" class=\"object_organisation\">" + organisation + "</p>"; 
     } else {
       if (organisation == null || organisation == "") { 
          if (view_type == "lineage_model" || view_type == "usage_model") html_description += "<p id=\"" + view_type + "_" + id + "_organisation\" class=\"object_organisation\" style=\"left:10px;\">" + "processor not defined" + "</p>";
          else html_description += "<p id=\"" + view_type + "_" + id + "_organisation\" class=\"object_organisation\">" + "processor not defined" + "</p>";
       } else {
          if (view_type == "lineage_model" || view_type == "usage_model") html_description += "<p id=\"" + view_type + "_" + id + "_organisation\" class=\"object_organisation\" style=\"left:10px;\">" + organisation + "</p>"; 
          else html_description += "<p id=\"" + view_type + "_" + id + "_organisation\" class=\"object_organisation\">" + organisation + "</p>";
       }
     }                 
   
    return html_description;
  }
  
  //-> initializes mini card creation
  //-- builds mini card itself (Background)
  function generate_mini_card(type, view_type, is_vector, is_time_aware, has_info, has_viewing, has_store) {
    var html_card = "";
    var id;
   
    if (view_type == "lineage_dataset") { id = lineage_dataset_mini_cards; lineage_dataset_mini_cards++; }
    else if (view_type == "usage_dataset") { id = usage_dataset_mini_cards; usage_dataset_mini_cards++; }
    else if (view_type == "lineage_model") { id = lineage_model_mini_cards; lineage_model_mini_cards++; }
    else if (view_type == "usage_model") { id = usage_model_mini_cards; usage_model_mini_cards++; }
    else if (view_type == "detail") id = 0;
    
    if (view_type == "lineage_dataset") html_card += "<div id=\"" + "lineage_dataset_mini_" + (lineage_dataset_mini_cards - 1) + "\" class=\"description_card\" style=\"width:65px;height:50px;top:" + ((lineage_dataset_mini_cards - 1) * 70 + 10)  + "px;\" onmouseover=\"show_tools(\'" + "lineage_dataset_mini_" + (lineage_dataset_mini_cards-1) + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\" onmousedown=\"focus_element(\'" + "lineage_dataset_" + lineage_dataset_cards + "\')\">"; 
    else if (view_type == "usage_dataset") html_card += "<div id=\"" + "usage_dataset_mini_" + (usage_dataset_mini_cards - 1) + "\" class=\"description_card\" style=\"width:65px;height:50px;top:" + ((usage_dataset_mini_cards - 1) * 70 + 10) + "px;\" onmouseover=\"show_tools(\'" + "usage_dataset_mini_" + (usage_dataset_mini_cards-1) + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\" onmousedown=\"focus_element(\'" + "usage_dataset_" + usage_dataset_cards + "\')\">";
    else if (view_type == "lineage_model") html_card += "<div id=\"" + "lineage_model_mini_" + (lineage_model_mini_cards - 1) + "\" class=\"description_card_petrol\" style=\"width:65px;height:50px;\" onmouseover=\"show_tools(\'" + "lineage_model_mini_" + (lineage_model_mini_cards - 1) + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\">";
    else if (view_type == "usage_model") html_card += "<div id=\"" + "usage_model_mini_" +  (usage_model_mini_cards - 1) + "\" class=\"description_card_petrol\" style=\"width:65px;height:50px;\" onmouseover=\"show_tools(\'" + "usage_model_mini_" + (usage_model_mini_cards - 1) + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\">";
    else if (view_type == "detail") html_card += "<div id=\"" + "detail_0_mini" + "\" class=\"description_card_colored_petrol\" style=\"width:65px;height:50px;\" onmouseover=\"show_tools(\'detail_0_mini" + "\', \'" + has_info + "\',\'" + has_viewing + "\',\'" + has_store + "\')\">";
 
    if (view_type.indexOf('model') != -1) html_card += generateIconset(true, is_vector, is_time_aware, false);   //icons (false = mini size)  
    else html_card += generateIconset(false, is_vector, is_time_aware, false);

    html_card += "<p id=\"" + view_type + "_mini_" + id + "_type\" class=\"object_type_mini\" style=\"left:0px;\">" + type + "</p>"; //text
    
    html_card += "</div>"; //end of card 
    return html_card;
  }