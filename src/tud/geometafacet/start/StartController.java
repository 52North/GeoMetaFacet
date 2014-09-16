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
package tud.geometafacet.start;

import java.sql.SQLException;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;


/**
 * ServletContextListener - creates hsql database permanently and facet string for first use on server start
 * @author Bernd Grafe. Professorship of Geoinformation Systems
 *
 */
public class StartController implements ServletContextListener {
	
	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// shutdown code - close conenction
		if (Container.conn != null)
			try {
				if (Container.conn != null)
					Container.conn.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		// server start code - create permanent db connection and facet strings
		try {
			Container.setConenction();
			Container.setResults();
			System.out.println("Server started - hsql db loaded");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			System.out.println("Could not load db connection");
			e.printStackTrace();
		}
	}
}
