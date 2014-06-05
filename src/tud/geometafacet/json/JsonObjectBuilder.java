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

package tud.geometafacet.json;
  
import java.util.Map;
import org.codehaus.jackson.map.ObjectMapper;
import tud.time4maps.objects.JsonContainer;
  
/**
 * This class creates JSON object from maps. The structure for the JSON object is defined by the class JsonContainer, but can also be set by the structure of a map.
 * @see JsonContainer 
 *    
 * @author Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 *           
 */    
public class JsonObjectBuilder {  

	public static Object buildLayer(Map<String, Object> allData, String type) { 
		ObjectMapper mapper = new ObjectMapper(); 
		if (type.equalsIgnoreCase("string")) { //building json string
			try {
				return mapper.writeValueAsString(allData);
			} catch (Exception e) { e.printStackTrace(); } 		
		} else if (type.equalsIgnoreCase("jsoncontainer")) { //building object 
			return mapper.convertValue(allData, JsonContainer.class);
		}  
		
		return null;

		// testing fileWriter .. from map to json-file
		// mapper.writeValue(new File("json_test_file"), allData);
	}
}
