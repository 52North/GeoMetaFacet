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
