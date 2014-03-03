package tud.geometafacet.script;
 
import tud.geometafacet.controlling.RequestControllingJDBC;

/**
 * 
 * This class provides a script to request CSW database and catalogue data
 * and store it in the intern HSQL database.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class DBCreater {

	/**
	 * Main method, for internal testing only.
	 * @param args
	 */
	public static void main(String[] args) { 
		getData(); 
	}
	
	/**
	 * Method to initialize data request scripts.
	 */
	public static void getData() {
		RequestControllingJDBC.initConnection();
		RequestControllingJDBC.getAllRecords();
		RequestControllingJDBC.getDistributedCatalogData();
		RequestControllingJDBC.closeConnection();	 
	} 
}
