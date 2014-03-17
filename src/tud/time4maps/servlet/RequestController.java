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

package tud.time4maps.servlet;

import tud.time4maps.controlling.RequestControlling;
import java.io.IOException;
 
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*; 

/**
 * Servlet implementation class RequestController.
 * This class handles time4maps request from frontend and initializes map service request.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
@WebServlet("/RequestController")
public class RequestController extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public RequestController() { }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 * * IMPORTANT: "&" signs in GET url must be replaced by ";"
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		RequestControlling controller = new RequestControlling();
		String url = (String) request.getParameter("url");
		String layer = (String) request.getParameter("layer");
		
		if (url.indexOf("?") < 0) {
			url = url + "?Request=GetCapabilities&Service=WMS&Version=1.1.1";
		}
		 
		String version = ""; 
		if (version.equals(""))
			version = "1.1.1";
		
		String jsonString;
		
		if (layer == "") { 
			jsonString = controller.getLayers(url, version);
		} else { 
			jsonString = controller.initialize(url, version, layer);
		} 
		response.setContentType("text/JSON");
		response.getWriter().println(jsonString);		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { }
}
