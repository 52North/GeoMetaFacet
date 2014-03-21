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

package tud.geometafacet.script;
 
import java.util.concurrent.TimeUnit;

import tud.geometafacet.controlling.RequestControllingJDBC;

/**
 * 
 * This class provides a script to request CSW database and catalogue data
 * and store it in the intern HSQL database.
 * 
 * @author Christin Henzen, Bernd Grafe. Professorship of Geoinformation Systems
 */
public class DBCreater {

	/**
	 * Main method, for internal testing only.
	 * @param args
	 */
	public static void main(String[] args) { 
		//getData(); 
		getDataWithTime();
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
	
	public static void getDataWithTime() {		
		long startTime = System.currentTimeMillis();
		System.out.println("init connection...");
		RequestControllingJDBC.initConnection();
		long duration = System.currentTimeMillis() - startTime;
		System.out.println("done - time(min): " + TimeUnit.MILLISECONDS.toMinutes(duration));
		System.out.println("getAllRecords...");
		RequestControllingJDBC.getAllRecords();
		duration = System.currentTimeMillis() - startTime;
		System.out.println("done - time(min): " + TimeUnit.MILLISECONDS.toMinutes(duration));
		System.out.println("getDistributedCatalogData...");
		RequestControllingJDBC.getDistributedCatalogData();
		duration = System.currentTimeMillis() - startTime;
		System.out.println("done - time(min): " + TimeUnit.MILLISECONDS.toMinutes(duration));
		RequestControllingJDBC.closeConnection();	 
		duration = System.currentTimeMillis() - startTime;
		System.out.println("total - time(min): " + TimeUnit.MILLISECONDS.toMinutes(duration));
	} 
}
