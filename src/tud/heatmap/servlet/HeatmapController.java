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

package tud.heatmap.servlet;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException; 
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This class handles heatmap stores. Frontend send all collected heatmap data. 
 * This class initializes storing of collected data in separated files.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
@WebServlet("/HeatmapController")
public class HeatmapController extends HttpServlet { 
	private static final long serialVersionUID = 1L;

	/**
     * @see HttpServlet#HttpServlet()
     */
    public HeatmapController() {
        super();
    }
    
    /**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//getting data
		String clicks = request.getParameter("normal"); //all clicks
		String mapClicks = request.getParameter("map"); //all clicks on the map/bboxes frame
		String t4mClicks = request.getParameter("t4m"); //all clicks on the t4m frame
		String mviClicks = request.getParameter("mvi"); //all clicks on the lineage frame
		String infClicks = request.getParameter("inf"); //all clicks on the info windows
		String seaClicks = request.getParameter("sea"); //all clicks on the search windows

		String facetScroll = request.getParameter("facetScroll");
		String listScroll = request.getParameter("listScroll");
		String tabMDScroll = request.getParameter("tabMDScroll");
		String tabTreeScroll = request.getParameter("tabTreeScroll");
		String middleScroll = request.getParameter("middleScroll");
		 
		String facetMiddleSplitter = request.getParameter("facetMiddleSplitter");
		String listDetailSplitter = request.getParameter("listDetailSplitter");
		String mapFInfoSplitter = request.getParameter("mapFInfoSplitter");
		String mapTimeSplitter = request.getParameter("mapTimeSplitter");
		String mapListDetailSplitter = request.getParameter("mapListDetailSplitter");
				
		String times = request.getParameter("times"); 	//all clicks with a time stamp
		String taskTimes = request.getParameter("taskTimes");
		
		//setting file names
		//TODO:change path
		String path = "C:/Users/ch/workspace3/GeoMetaFacet/WebContent/data/"; 
		String random = Double.toString(Math.random());
		path = path + random;
		File f = new File(path);
		f.mkdir();
		path = path + "/";
		
		String clicksFileName = path + random + "_clicks_all.json" ;
		String mapFileName = path + random + "_clicks_map.json" ;
		String t4mFileName = path + random + "_clicks_t4m.json" ;
		String mviFileName = path + random + "_clicks_mvi.json" ;
		String infFileName = path + random + "_clicks_inf.json" ;
		String seaFileName = path + random + "_clicks_sea.json" ;
			
		String facetScrollFileName = path + random + "_scroll_facet.json";
		String listScrollFileName = path + random + "_scroll_list.json";
		String tabMDScrollFileName = path + random + "_scroll_tabMD.json";
		String tabTreeScrollFileName = path + random + "_scroll_tabTree.json";
		String middleScrollFileName = path + random + "_scroll_middle.json";
		
		String facetMiddleSplitterFileName = path + random + "_splitter_facetMiddle.json";
		String listDetailSplitterFileName = path + random + "_splitter_listDetail.json";
		String mapFInfoSplitterFileName = path + random + "_splitter_mapFInfo.json";
		String mapTimeSplitterFileName = path + random + "_splitter_mapTime.json";
		String mapListDetailSplitterFileName = path + random + "_splitter_mapListDetail.json";
	 
		String timesFileName = path + random + "_times.json" ;
		String taskTimesFileName = path + random + "_taskTimes.json" ;
 	 
		Writer fw = null;
		try {
			fw = new FileWriter(clicksFileName); fw.write(clicks);	 
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw != null) try { fw.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw2 = null;
		try {
			fw2 = new FileWriter(timesFileName); fw2.write(times);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw2 != null) try { fw2.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw3 = null;
		try {
			fw3 = new FileWriter(mapFileName); fw3.write(mapClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw3 != null) try { fw3.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw4 = null;
		try {
			fw4 = new FileWriter(t4mFileName); fw4.write(t4mClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw4 != null) try { fw4.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw5 = null;
		try {
			fw5 = new FileWriter(mviFileName); fw5.write(mviClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw5 != null) try { fw5.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw6 = null;
		try {
			fw6 = new FileWriter(infFileName); fw6.write(infClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw6 != null) try { fw6.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw7 = null;
		try {
			fw7 = new FileWriter(seaFileName); fw7.write(seaClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw7 != null) try { fw7.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		 
		Writer fw8 = null;
		try {
			fw8 = new FileWriter(facetScrollFileName); fw8.write(facetScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw8 != null) try { fw8.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw9 = null;
		try {
			fw9 = new FileWriter(listScrollFileName); fw9.write(listScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw9 != null) try { fw9.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw10 = null;
		try {
			fw10 = new FileWriter(tabMDScrollFileName); fw10.write(tabMDScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw10 != null) try { fw10.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw11 = null;
		try {
			fw11 = new FileWriter(tabTreeScrollFileName); fw11.write(tabTreeScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw11 != null) try { fw11.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw12 = null;
		try {
			fw12 = new FileWriter(middleScrollFileName); fw12.write(middleScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw12 != null) try { fw12.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw13 = null;
		try {
			fw13 = new FileWriter(facetMiddleSplitterFileName); fw13.write(facetMiddleSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw13 != null) try { fw13.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw14 = null;
		try {
			fw14 = new FileWriter(listDetailSplitterFileName); fw14.write(listDetailSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw14 != null) try { fw14.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw15 = null;
		try {
			fw15 = new FileWriter(mapFInfoSplitterFileName); fw15.write(mapFInfoSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw15 != null) try { fw15.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw16 = null;
		try {
			fw16 = new FileWriter(mapTimeSplitterFileName); fw16.write(mapTimeSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw16 != null) try { fw16.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw17 = null;
		try {
			fw17 = new FileWriter(mapListDetailSplitterFileName); fw17.write(mapListDetailSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw17 != null) try { fw17.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw18 = null;
		try {
			fw18 = new FileWriter(taskTimesFileName); fw18.write(taskTimes);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw18 != null) try { fw18.close(); } catch (IOException e) { e.printStackTrace(); }
		}
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { 
		
		//getting data
		String clicks = request.getParameter("normal"); //all clicks
		String mapClicks = request.getParameter("map"); //all clicks on the map/bboxes frame
		String t4mClicks = request.getParameter("t4m"); //all clicks on the t4m frame
		String mviClicks = request.getParameter("mvi"); //all clicks on the lineage frame
		String infClicks = request.getParameter("inf"); //all clicks on the info windows
		String seaClicks = request.getParameter("sea"); //all clicks on the search windows

		String facetScroll = request.getParameter("facetScroll");
		String listScroll = request.getParameter("listScroll");
		String tabMDScroll = request.getParameter("tabMDScroll");
		String tabTreeScroll = request.getParameter("tabTreeScroll");
		String middleScroll = request.getParameter("middleScroll");
		  
		String facetMiddleSplitter = request.getParameter("facetMiddleSplitter");
		String listDetailSplitter = request.getParameter("listDetailSplitter");
		String mapFInfoSplitter = request.getParameter("mapFInfoSplitter");
		String mapTimeSplitter = request.getParameter("mapTimeSplitter");
		String mapListDetailSplitter = request.getParameter("mapListDetailSplitter");
				
		String times = request.getParameter("times"); 	//all clicks with a time stamp
		String taskTimes = request.getParameter("taskTimes");
		
		//setting file names
		//String path = "C:/Users/ch/workspace3/GeoMetaFacet/WebContent/data/";
		String path = "C:/Heatmaps/";
		String random = Double.toString(Math.random());
		path = path + random;
		File f = new File(path);
		f.mkdir();
		path = path + "/";
		
		String clicksFileName = path + random + "_clicks_all.json" ;
		String mapFileName = path + random + "_clicks_map.json" ;
		String t4mFileName = path + random + "_clicks_t4m.json" ;
		String mviFileName = path + random + "_clicks_mvi.json" ;
		String infFileName = path + random + "_clicks_inf.json" ;
		String seaFileName = path + random + "_clicks_sea.json" ;
			
		String facetScrollFileName = path + random + "_scroll_facet.json";
		String listScrollFileName = path + random + "_scroll_list.json";
		String tabMDScrollFileName = path + random + "_scroll_tabMD.json";
		String tabTreeScrollFileName = path + random + "_scroll_tabTree.json";
		String middleScrollFileName = path + random + "_scroll_middle.json";
		
		String facetMiddleSplitterFileName = path + random + "_splitter_facetMiddle.json";
		String listDetailSplitterFileName = path + random + "_splitter_listDetail.json";
		String mapFInfoSplitterFileName = path + random + "_splitter_mapFInfo.json";
		String mapTimeSplitterFileName = path + random + "_splitter_mapTime.json";
		String mapListDetailSplitterFileName = path + random + "_splitter_mapListDetail.json";
	 
		String timesFileName = path + random + "_times.json" ;
		String taskTimesFileName = path + random + "_taskTimes.json" ;
		
		Writer fw = null;
		try {
			fw = new FileWriter(clicksFileName); fw.write(clicks);	 
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw != null) try { fw.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw2 = null;
		try {
			fw2 = new FileWriter(timesFileName); fw2.write(times);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw2 != null) try { fw2.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw3 = null;
		try {
			fw3 = new FileWriter(mapFileName); fw3.write(mapClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw3 != null) try { fw3.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw4 = null;
		try {
			fw4 = new FileWriter(t4mFileName); fw4.write(t4mClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw4 != null) try { fw4.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw5 = null;
		try {
			fw5 = new FileWriter(mviFileName); fw5.write(mviClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw5 != null) try { fw5.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw6 = null;
		try {
			fw6 = new FileWriter(infFileName); fw6.write(infClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw6 != null) try { fw6.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw7 = null;
		try {
			fw7 = new FileWriter(seaFileName); fw7.write(seaClicks);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw7 != null) try { fw7.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		 
		Writer fw8 = null;
		try {
			fw8 = new FileWriter(facetScrollFileName); fw8.write(facetScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw8 != null) try { fw8.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw9 = null;
		try {
			fw9 = new FileWriter(listScrollFileName); fw9.write(listScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw9 != null) try { fw9.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw10 = null;
		try {
			fw10 = new FileWriter(tabMDScrollFileName); fw10.write(tabMDScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw10 != null) try { fw10.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw11 = null;
		try {
			fw11 = new FileWriter(tabTreeScrollFileName); fw11.write(tabTreeScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw11 != null) try { fw11.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw12 = null;
		try {
			fw12 = new FileWriter(middleScrollFileName); fw12.write(middleScroll);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw12 != null) try { fw12.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw13 = null;
		try {
			fw13 = new FileWriter(facetMiddleSplitterFileName); fw13.write(facetMiddleSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw13 != null) try { fw13.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw14 = null;
		try {
			fw14 = new FileWriter(listDetailSplitterFileName); fw14.write(listDetailSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw14 != null) try { fw14.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw15 = null;
		try {
			fw15 = new FileWriter(mapFInfoSplitterFileName); fw15.write(mapFInfoSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw15 != null) try { fw15.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw16 = null;
		try {
			fw16 = new FileWriter(mapTimeSplitterFileName); fw16.write(mapTimeSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw16 != null) try { fw16.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw17 = null;
		try {
			fw17 = new FileWriter(mapListDetailSplitterFileName); fw17.write(mapListDetailSplitter);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw17 != null) try { fw17.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
		Writer fw18 = null;
		try {
			fw18 = new FileWriter(taskTimesFileName); fw18.write(taskTimes);		  
		} catch (IOException e) { System.err.println("File not written"); 
		} finally {
			if (fw18 != null) try { fw18.close(); } catch (IOException e) { e.printStackTrace(); }
		}
		
	}
}