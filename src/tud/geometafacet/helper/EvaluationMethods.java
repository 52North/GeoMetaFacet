package tud.geometafacet.helper;

import java.sql.ResultSet;
import java.sql.SQLException;  

/**
 * 
 * This class provides basic evaluation methods for strings or result sets.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class EvaluationMethods {

	/**
	 * Convert UTM-String from database into needed format.
	 * 
	 * @param utm in format: SRID=4326;POLYGON((-180 -90,180 -90,180 90,-180 90,-180 -90))
	 * @return latlon in format a,b;c,d
	 */
	public static String convertUTMtoLatLon(String utm) { 
		String latLon = "";
									// E S, W S, W N, E N, E S
		//Polygon: SRID=4326;POLYGON((-180 -90,180 -90,180 90,-180 90,-180 -90))
		if (utm!= null && utm.indexOf("POLYGON")  != -1){
			utm = utm.substring(utm.indexOf("((")+2, utm.indexOf("))"));
			String[] utmArray = utm.split(",");
			for (int i = 0; i < utmArray.length-1; i++){
				utmArray[i] = utmArray[i].replace(" ", ",");
				latLon += utmArray[i] + ";";
			}
			latLon = latLon.substring(0, latLon.length()-1); 
		} 	
		return latLon;
	} 
	
	/**
	 * This methods evaluates topics. It separates concatenated strings to human readable topic names.
	 * 
	 * @param result - the db request result
	 * @return corrected topic name
	 * @throws SQLException
	 */
	public static String checkTopic(ResultSet result) throws SQLException {
		String topic = "";
		if (result.getString(9) != null) { 
 			if (result.getString(9).equals("climatologyMeteorologyAtmosphere")) topic = "climatology, meteorology, atmosphere";
 			else if (result.getString(9).equals("imageryBaseMapsEarthCover")) topic = "imagery base maps earth cover";
 			else if (result.getString(9).equals("geoscientificInformation")) topic = "geoscientific information";
 			else if (result.getString(9).equals("inlandWaters")) topic = "inland waters";
 			else if (result.getString(9).equals("planningCadastre")) topic = "planning cadastre";
 			else topic = result.getString(9); 
		}
		topic = HelpMethods.prepareString(topic);
		return topic;
	} 
	
	/**
	 * This methods evaluates data types. It separates concatenated strings to human readable data type names.
	 * 
	 * @param datatype - data type as string
	 * @return corrected data type string
	 */
	public static String checkDataType(String datatype) {
		if (datatype.equals("nonGeographicDataset"))
			return "non-geographic dataset";
		else return datatype; 
	}
	
	/**
	 * This methods evaluates abstracts. It shortens the incoming string (200 characters) 
	 * and replaces all special characters by calling prepareString().
	 * 
	 * @param abstracttext - abstract of the metadata entry
	 * @return corrected abstract string
	 */
	public static String checkAbstract(String abstracttext) {
		if (abstracttext != null && abstracttext.length() > 200) { 
			abstracttext = abstracttext.substring(0,200) + " ..."; 
			abstracttext = abstracttext.replaceAll("  "," ");
		}
		if (abstracttext == null || abstracttext.equals("null")) abstracttext = "";
		return HelpMethods.prepareString(abstracttext);	
	} 
}
