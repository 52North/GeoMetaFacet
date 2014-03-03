package tud.metaviz.controlling;
  
import tud.metaviz.connection.Connection;
import tud.metaviz.connection.csw.CSWConnection;
import tud.metaviz.connection.db.JDBCConnection;
import tud.metaviz.connection.file.FileConnection;
 
/**
 * 
 * This class handles request from frontend and intializes further processing.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class RequestControlling { 
 
	static Connection connection = CSWConnection.getInstance(); //new CSWConnection();
	
	/**
	 * Method to get JSON string for details of certain metadata entry.
	 * 
	 * @param id
	 * @return
	 */
	public String getDetailsTo(String id) { 
		return connection.getRecordDetails(id);
	}

	/**
	 * Method to get JSON string for all available catalogue data.
	 * @return
	 */
	public String getRecordList() {  
		return connection.getRecordNames();
	}
	
	/**
	 * Method to get the mode of MetaViz application.
	 * Possible modes: file, csw, db
	 * 
	 * @return mode as string 
	 */
	public static String getMode() {
		return connection.getClass().toString();
	}
	
	/**
	 * Method to set the mode of MetaViz application.
	 * Possible modes: file, csw, db
	 * 
	 * @param mode as string
	 */
	public static void setMode(String mode) {
		if (mode.equals("db")) connection = JDBCConnection.getInstance();
		else if (mode.equals("csw")) connection = CSWConnection.getInstance();
		else if (mode.equals("file")) connection = FileConnection.getInstance();
	}
}
