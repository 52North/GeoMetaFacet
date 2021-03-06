/**
 * Copyright 2012 52�North Initiative for Geospatial Open Source Software GmbH
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

package tud.metaviz.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import tud.metaviz.controlling.RequestControlling;

/**
 * Servlet implementation class MetavizController
 * This class handles frontend requests to csw/db.
 * 
 * @author Christin Henzen, Bernd Grafe. Professorship of Geoinformation Systems
 * 
 */ 
@WebServlet("/MetavizController")
public class MetavizController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MetavizController() {
        super();
    }

	/**
	 * This method handles lineage requests from frontend and initalizes requesting information
	 * for a certain data set.
	 * 
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String mode = (String) request.getParameter("mode"); 		
//		if (mode != null) RequestControlling.setMode(mode); 
		
		if (mode.equals("hsql"))
			RequestControlling.setHSQL(true);
			 
		String id = (String) request.getParameter("id");
		RequestControlling controller = new RequestControlling();
//		controller.getRecordList();
		String jsonString;
		jsonString = controller.getDetailsTo(id); 
	 	response.setContentType("text/html");
		PrintWriter out = response.getWriter();
	    out.println(jsonString);		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	}

}
