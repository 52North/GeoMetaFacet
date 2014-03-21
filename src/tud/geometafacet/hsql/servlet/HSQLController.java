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

package tud.geometafacet.hsql.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import tud.geometafacet.helper.Constants;
import tud.geometafacet.hsql.*;

/**
 * 
 * Servlet implementation class HSQLController.
 * This class handles frontend requests to database.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
@WebServlet("/HSQLController")
public class HSQLController extends HttpServlet { 
	private static final long serialVersionUID = 1L; 
	
	/**
     * @see HttpServlet#HttpServlet()
     */
	public HSQLController() {
		super();
	} 
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String data = (String) request.getParameter("data");
		String[] dataArray = data.split("/");
		String query = dataArray[0];
		
		String id = "", hvl = "", scen = "", orga = "", topic = "", dt = "", bbox= "";
		
		//if (query.equals(Constants.findAllIds) || query.equals(Constants.findAllBBox)) {} 
		if (query.equals(Constants.findOne) || query.equals(Constants.findPublicationByDsId) 
		|| query.equals(Constants.findGrandParent) || query.equals(Constants.findTree)) {
			id = dataArray[1];
		} else if (query.equals(Constants.countAllHierarchylevelnames) || query.equals(Constants.countAllScenarios)
		|| query.equals(Constants.countAllTopiccategories) || query.equals(Constants.countAllDatatypes)
		|| query.equals(Constants.countAllOrganizations) || query.equals(Constants.countAllBoundingboxes)
		|| query.equals(Constants.findByMixed)) {
			hvl = dataArray[1];
			topic = dataArray[2];
			dt = dataArray[3];
			orga = dataArray[4];
			scen = dataArray[5];
			bbox = dataArray[6];
		} else if (query.equals(Constants.findMixedBox)) {
			hvl = dataArray[1];
			topic = dataArray[2];
			dt = dataArray[3];
			orga = dataArray[4];
			scen = dataArray[5];
		} else if (query.equals(Constants.findAllTopics)) {
			hvl = dataArray[1];
			dt = dataArray[2];
			orga = dataArray[3];
			scen = dataArray[4];
			bbox = dataArray[5];
		} else if (query.equals(Constants.findAllDatatypes)) {
			hvl = dataArray[1];
			topic = dataArray[2];
			orga = dataArray[3];
			scen = dataArray[4];
			bbox = dataArray[5];
		} else if (query.equals(Constants.findAllOrganizations)) {
			hvl = dataArray[1];
			topic = dataArray[2];
			dt = dataArray[3];
			scen = dataArray[4];
			bbox = dataArray[5];
		} else if (query.equals(Constants.findSimilarLimited)) {
			hvl = dataArray[2];
			topic = dataArray[3];
			dt = dataArray[4];
			orga = dataArray[5];
			scen = dataArray[6];
			id = dataArray[1];	
		} else if (query.equals(Constants.findSimilarScenarioValues) ||
			query.equals(Constants.findSimilarDatatypeValues) ||
			query.equals(Constants.findSimilarHierarchylevelnameValues) ||
			query.equals(Constants.findSimilarOrganizationValues) ||
			query.equals(Constants.findSimilarTopiccategoryValues) ||
			query.equals(Constants.findInternId)) {
			id = dataArray[1];	
		}
		
		HSQLConnection hc = new HSQLConnection(); 
		String jsonString = hc.queryStatement(query, id, hvl, scen, orga, topic, dt, bbox);
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
