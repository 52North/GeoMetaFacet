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

import java.sql.SQLException;

import tud.geometafacet.hsql.HSQLConnection;

/**
 * 
 * This class is for testing hsql mode to request lineage information.
 * 
 * @author  Bernd Grafe. Professorship of Geoinformation Systems
 */
public class LineageIDTester {

	public static void main(String[] args) {
		// TODO Auto-generated method stub

		String externID = "glues:lmu:metadata:dataset:promet";
		//String externID = "glues:pik:metadata:dataset:co2-ukmo-hadcm3-sresb2-pastureland";
		
		try {
			HSQLConnection hc = new HSQLConnection();  
			System.out.println(hc.lineageForID(externID));
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
