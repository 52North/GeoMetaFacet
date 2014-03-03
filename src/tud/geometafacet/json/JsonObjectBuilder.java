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
