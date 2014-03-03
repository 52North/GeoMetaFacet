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
 * @author Christin Henzen. Professorship of Geoinformation Systems
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
//		String mode = (String) request.getParameter("mode"); 		
//		if (mode != null) RequestControlling.setMode(mode); 
		RequestControlling.setMode("db");
		
		String id = (String) request.getParameter("id");
		RequestControlling controller = new RequestControlling();
		controller.getRecordList();
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
