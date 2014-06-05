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

  var lineage_hidden = true; 
   
  function toggleLineage() { 
  
    var slideTarget = dojo.byId("lineage_mini_cards");  	//lineage
    var neg_slideTarget = dojo.byId("lineage_con");    
    var slideTarget2 = dojo.byId("usage_mini_cards");       //usage
    var neg_slideTarget2 = dojo.byId("usage_con");   
    var slideTarget3 = dojo.byId("detail_container");       //detail
    var lines = dojo.byId('actual_lines'); 
    
    var detail_left;
    if (dojo.byId('lineage_model_0') == null && dojo.byId('usage_model_0') == null) detail_left= "470";
    else if (lineage_hidden) detail_left= "590";
    else detail_left= "240";
    
    if (lineage_hidden) {
      dojo.byId("usage_mini_cards").style.visibility = "visible"; 
      dojo.byId("icon_arrow_right").style.visibility = "visible";    //arrows near lineage link
      dojo.byId("icon_arrow_left").style.visibility = "hidden";          
      dojo.byId("usage_model_cards_container").style.left = "0px";
      dojo.byId("usage_dataset_cards_container").style.left = "0px";   
              
      lineage_hidden = false;  
      dojo.fadeOut({ node: lines, duration:200 }).play();
       
      dojo.fx.combine([  
        dojo.fadeOut({ node: slideTarget, duration:200 }),                                                          
        dojo.fadeOut({ node: neg_slideTarget2, duration:200 }),          
      ]).play();   
       
      dojo.fx.combine([  
        dojo.fx.slideTo({ node: slideTarget, duration:100, left: "-600", top: "30" }),
        dojo.fx.slideTo({ node: neg_slideTarget, duration:100, left: "0", top: "50" }),
        //dojo.fx.slideTo({ node: slideTarget2, duration:100, left: "860", top: "30" }),
        dojo.fx.slideTo({ node: slideTarget2, duration:100, left: "860", top: "30" }),
        //dojo.fx.slideTo({ node: neg_slideTarget2, duration:100, left: "1500", top: "50" }),  
        dojo.fx.slideTo({ node: neg_slideTarget2, duration:100, left: "0", top: "50" }),  
      ]).play();  
      
      dojo.byId("lineage_dataset_cards_container").style.visibility = "visible";
      dojo.byId("lineage_model_cards_container").style.visibility = "visible"; 
       
      dojo.fx.combine([ 
        //lin behav                                                         
        dojo.fadeIn({ node: neg_slideTarget, duration:1400 }),           
        //us behav                                         
        dojo.fadeIn({ node: slideTarget2, duration:1400 }),            
        //detail behav        
        dojo.fx.slideTo({ node: slideTarget3, duration:400, left: detail_left, top: "50" }),
         
      ]).play();       
 
      setLines(); 
      dojo.byId('actual_lines').style.opacity = 0;
      dojo.fadeIn({ node: lines, duration:1400 }).play();  
      
      dojo.byId("lineage_mini_cards").style.visibility = "hidden";   
      dojo.byId("usage_dataset_cards_container").style.visibility = "hidden";
      dojo.byId("usage_model_cards_container").style.visibility = "hidden";
       
      if (num_us_ds < 1) {
    	  dojo.byId("usage_mini_cards").style.left = "0px";
    	  dojo.byId("usage_mini_cards").style.width = "0px";
    	  dojo.byId("usage_dataset_mini_cards_container").style.left = "0px";
    	  dojo.byId("usage_dataset_mini_cards_container").style.width = "0px";
    	  dojo.byId("usage_model_mini_cards_container").style.left = "0px";
    	  dojo.byId("usage_model_mini_cards_container").style.width = "0px";
    	  dojo.byId("lin_pub_texts").style.width = "900px";
      } else {
    	  dojo.byId("usage_dataset_mini_cards_container").style.left = "110px";
    	  dojo.byId("usage_model_mini_cards_container").style.left = "5px";
      }
      
      hide_tools();               
    } else {
      dojo.byId("lineage_mini_cards").style.visibility = "visible";   
      
      dojo.byId("icon_arrow_right").style.visibility = "hidden";     //arrows near lineage link
      dojo.byId("icon_arrow_left").style.visibility = "visible"; 
      
      dojo.byId("usage_model_cards_container").style.left = "510px"; //"360px";
      dojo.byId("usage_dataset_cards_container").style.left = "780px"; //"660px";
          
      lineage_hidden = true; 
      dojo.fadeOut({ node: lines, duration:200 }).play(); 

      dojo.fx.combine([                        
        dojo.fadeOut({ node: neg_slideTarget, duration:200 }),   
        dojo.fadeOut({ node: slideTarget2, duration:200 })                              
      ]).play(); 

      dojo.fx.combine([  
         dojo.fx.slideTo({ node: slideTarget, duration:100, left: "-30", top: "30" }), 
         dojo.fx.slideTo({ node: neg_slideTarget, duration:100, left: "-600", top: "50" }), 
         dojo.fx.slideTo({ node: neg_slideTarget2, duration:100, left: "30", top: "50" }),
         //dojo.fx.slideTo({ node: slideTarget2, duration:100, left: "1500", top: "30" }),
         dojo.fx.slideTo({ node: slideTarget2, duration:100, left: "0", top: "30" }),
      ]).play();    

      dojo.byId("usage_dataset_cards_container").style.visibility = "visible";
      dojo.byId("usage_model_cards_container").style.visibility = "visible"; 
       

      dojo.fx.combine([
        //lin behav
        dojo.fadeIn({ node: slideTarget, duration:1400 }),      
        //us behav
        dojo.fadeIn({ node: neg_slideTarget2, duration:1400 }),                             
        //detail behav
        dojo.fx.slideTo({ node: slideTarget3, duration:400, left: detail_left, top: "50" }),   
                             
      ]).play(); 
        
      setLines(); 
      dojo.byId('actual_lines').style.opacity = 0;
      dojo.fadeIn({ node: lines, duration:1400 }).play(); 
       
      dojo.byId("usage_mini_cards").style.visibility = "hidden";
      dojo.byId("lineage_dataset_cards_container").style.visibility = "hidden";
      dojo.byId("lineage_model_cards_container").style.visibility = "hidden";
      
      hide_tools();     
    }      
  }

  