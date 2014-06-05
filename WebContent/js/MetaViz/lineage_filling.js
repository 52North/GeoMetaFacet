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
function fillLineage() {
 
  var statement;
  mStore.fetchItemByIdentity({ identity: "statement", onItem: function(item, request) { statement = item; }});
   
  if (statement != null && statement.description != "") { 
	  dojo.byId('ps_statement').innerHTML = statement.description;
	  dojo.byId('lin_process').parentNode.removeChild(dojo.byId('lin_process')); 
	  if (dojo.byId('table_processing')) dojo.byId('table_processing').parentNode.removeChild(dojo.byId('table_processing')); 
  } else {
	  if(dojo.byId('lin_statement')) dojo.byId('lin_statement').parentNode.removeChild(dojo.byId('lin_statement')); 
 
	  var pStep_data;
	  mStore.fetchItemByIdentity({ identity: "process_step_0", onItem: function(item, request) { pStep_data = item; }});
	  if (pStep_data != null) { 
		  dojo.byId('ps_rationale').innerHTML = pStep_data.rationale;
		  dojo.byId('ps_description').innerHTML = pStep_data.description; 
		  dojo.byId('p_time').innerHTML = pStep_data.dateTime; 
		  dojo.byId('p_processor').innerHTML = pStep_data.processor; 
		  dojo.byId('pubs').innerHTML = "";
  	  
		  if (pStep_data.processing_list != null) {
			  var pubs = pStep_data.processing_list[0].processing_0[0].docs[0]; 
			  if (pubs != null) {
				  var pubs_html = "<table class=\"lin_info_table\" style=\"clear:left;\">"; 
				  for (var i=0; i < pubs.size[0];i++) {
					  var cit;
					  mStore.fetchItemByIdentity({ identity: "doc_"+i, onItem: function(item, request) { cit = item; }});
 
					  if (i != 0) pubs_html += "<tr><td class=\"table_left\" id=\"table_title\" style=\"height:30px;padding-top:20px;\">"+(i+1)+". PUBLICATION</td><td></td></tr>";
					  else pubs_html += "<tr><td class=\"table_left\" id=\"table_title\" style=\"height:30px;\">"+(i+1)+". PUBLICATION</td><td></td></tr>";
					  pubs_html += "<tr><td class=\"table_left\" valign=\"top\">TITLE OF PUBLICATION</td><td>" + cit.title + "</td></tr>"; 
					  if (cit.date != null && cit.date != "") pubs_html += "<tr><td class=\"table_left\" valign=\"top\">PUBLISHING DATE</td><td>" + cit.date + "</td></tr>";
					  //if http
					  if (cit.others != null && cit.others != "" && cit.others.toString().substring(0,4) =="http") pubs_html += "<tr><td class=\"table_left\" valign=\"top\">CITATION</td><td><a onclick=\"window.open(\'" + cit.others +"\')\">"+cit.others+"</a></td></tr>";
					  else // if starts with doi -> calculate http://dx.doi.org/doi 
						  if (cit.others != null && cit.others != "" && cit.others.toString().substring(0,4)=="doi:" ) {
							  var helper = cit.others.toString().substring(4,cit.others.toString().lenth);
							  helper = "http://dx.doi.org/"+ helper;
							  pubs_html += "<tr><td class=\"table_left\" valign=\"top\">CITATION</td><td><a onclick=\"window.open(\'" + helper +"\')\">"+helper+"</a></td></tr>";
					  } else if(cit.others != null && cit.others != "") pubs_html += "<tr><td class=\"table_left\" valign=\"top\">CITATION</td><td>" + cit.others + "</td></tr>";
				  } 
				  pubs_html += "</table>";
				  dojo.byId('pubs').innerHTML = pubs_html;
			  }  
		  }
	  }  
  }
  if (dojo.byId('pubs').innerHTML == "") dojo.byId('pubs').innerHTML = "There are no publications avaliable.";	  
}