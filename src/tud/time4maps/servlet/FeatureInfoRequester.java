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

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import tud.time4maps.controlling.RequestControlling;

/**
 * Servlet implementation class FeatureInfoRequester.
 * This class handles time4maps feature infor requests from frontend and intitialize 
 * feature info requests.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
@WebServlet("/FeatureInfoRequester")
public class FeatureInfoRequester extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public FeatureInfoRequester() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String wmsUrl = request.getParameter("url");
		String version = request.getParameter("version"); 
		String layers = request.getParameter("query_layers");
		String srs = request.getParameter("crs");
		String bbox = request.getParameter("bbox");
		String width = request.getParameter("width");
		String height = request.getParameter("height");
		String i = request.getParameter("I");
		String j = request.getParameter("J");
		String time = request.getParameter("time");
		 
		RequestControlling rc = new RequestControlling();
		String retStr = rc.initializeFeatureInfo(wmsUrl, version, layers, srs, bbox, width, height, i, j, time);
		
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
	    out.println(retStr);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { }
}
