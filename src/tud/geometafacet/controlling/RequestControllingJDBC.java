package tud.geometafacet.controlling; 
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;  
import java.util.HashMap;     
import java.util.Iterator;
import java.util.Map;     

import org.apache.xpath.NodeSet;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList; 

import de.conterra.suite.catalog.client.exception.SystemException;
import de.conterra.suite.catalog.client.facades.GetRecordsResponse;
import de.conterra.suite.catalog.client.invoker.HttpPostInvoker;
import de.conterra.suite.catalog.client.invoker.IServiceInvoker;
import de.conterra.suite.catalog.client.request.GetRecordsRequest;
import tud.geometafacet.xpath.EvaluatingXPath;
import tud.geometafacet.helper.Constants;
import tud.geometafacet.helper.FileDocumentMethods;
import tud.geometafacet.helper.EvaluationMethods; 
import tud.geometafacet.helper.HelpMethods;
  
/**
 * This class handles db requests to preprocess data.
 * Data is requested from a catalogue db and distributed catalogues 
 * and stored in an intern HSQL database.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class RequestControllingJDBC { 
 
	//TODO change path
	static String path = "../WebContent/data/db.script";
	static Connection dbConnection; 
	static EvaluatingXPath xpe = new EvaluatingXPath(); 
	   
	static Integer dataCounter = 0, topicId = 0, hierarchyId = 0, publicationId = 0;	
	static Map<String, String> original2InternId = new HashMap<String, String>(); 
	static Map<String, String> internId2Topic = new HashMap<String, String>(); 
	static Map<String, Integer> publicationTitle2Id = new HashMap<String, Integer>();
	static Map<String, String> publicationId2DsId = new HashMap<String, String>(); 
	static Map<String, String> parentChildRest = new HashMap<String, String>();
	
	/**
	 * Initializes DB connection. Using a Postgres DB.
	 */
	public static void initConnection() { 
		try {
			Class.forName("org.postgresql.Driver"); 
		 	dbConnection = DriverManager.getConnection("jdbc:postgresql://" + Constants.dbEndpoint, Constants.dbUser, Constants.dbPasswd);
		} catch (ClassNotFoundException e) { e.printStackTrace(); 
		} catch (SQLException e) { e.printStackTrace(); }
	}

	/**
	 * Closes DB connection. Using a Postgress DB.
	 */
	public static void closeConnection() {
		try {  
			dbConnection.close();
		} catch (SQLException e) { e.printStackTrace(); }
	}
 
	/**
	 * Initialize requesting distributed catalogues that are stored in the catalogue db (see above).
	 */
	public static void getDistributedCatalogData() { 
		Statement stmt;
		try { 
			//DB SELECT
		  	stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
		  	ResultSet result = stmt.executeQuery( 
		  			"SELECT DISTINCT tc_md.identifier, tc_md.title, tc_md.profilefull " +
		  			"FROM " + "tc30.tc_md " +
		  			"WHERE tc_md.servicetype = 'CSW'" );
 
		 	while (result.next()) { 
		 		String catalogURL = (String) xpe.getXPathResult(Constants.xPathCatalogURL, new String(), FileDocumentMethods.createDocument(result.getString(3)).getChildNodes());
		 		if (!(result.getString(2).contains("PortalU"))) { //|| result.getString(2).contains("CarBioCial"))) {
		 			Document doc = doCatalogRequest(catalogURL); 
		 			if (doc != null) 
		 				getRecordNames(doc, catalogURL);
		 		}
		 	}
		} catch (SQLException e) { e.printStackTrace(); } 
	}
	
	/**
	 * Initializes DB requests to get all data of the catalogues database.
	 */
	public static void getAllRecords() {  
		try { 
			ResultSet result = doDatabaseRequest();
		   
		  	FileDocumentMethods.clearFile(path);
		  	FileDocumentMethods.writeFileLine(InitialDBScript.getInitalDBScript(), path);
		  	
		 	while (result.next()) { 
		 		if (!result.getString(1).equals("79d2629b-9519-4f9c-b8ff-92538f777f03") && !result.getString(1).equals("560254f4-f9d3-4881-841f-00e1ff4c08e0")
		 		&& !result.getString(1).equals("d9592a3e-b7d7-4f6c-b8d0-68b3940ae593") && !result.getString(1).equals("5d1f36e8-0c14-48ed-b8b0-e55f834ac9a9") 
		 		&& !result.getString(1).equals("d9592a3e-b7d7-4f6c-b8d0-68b3940ae593") && !result.getString(1).equals("940192af-854a-4c76-a72d-fdd02ceb39c4")		 		
		 		&& !result.getString(2).equals("Test_Lineage") && !original2InternId.containsKey(result.getString(1))) {
		 			
		 			//-------- DETAILS
		 			String id = result.getString(1);
		 			String title = HelpMethods.prepareString(result.getString(2));
		 			String description = EvaluationMethods.checkAbstract(result.getString(3));
		 			String keywords = RequestHelpMethods.getKeywords(id, dbConnection);
		 			String temporalextentbeginposition = "";
		 			String temporalextentendposition = "";
		 			
		 			if (result.getString(6) != null) 
		 				temporalextentbeginposition = result.getString(6);
		 			if (result.getString(7) != null) 
		 				temporalextentendposition = result.getString(7); 	 
		 			String elementINSERT = "INSERT INTO DETAILS VALUES(" + dataCounter + ",'" + id + "','" + title + "','" + description + "','" + temporalextentbeginposition + "','" + temporalextentendposition + "','" + keywords +"') ";//\n";
		 			 
		 			//-------- FACETS
		 			String[] hvlScen = RequestEvaluation.getHVLScenario(result);
		 			String hierarchylevelname = "";
		 			String scenario = "";
		 			if (hvlScen[0] != null) hierarchylevelname = hvlScen[0];
		 			if (hvlScen[1] != null) scenario = hvlScen[1];
		 			
		 			String organization = HelpMethods.prepareString(result.getString(4).trim());
		 			String datatype = EvaluationMethods.checkDataType(result.getString(5)); 
		 			String geographicboundingbox = EvaluationMethods.convertUTMtoLatLon(result.getString(8));
		 				
		 			elementINSERT += "\n INSERT INTO FACETS VALUES(" + dataCounter + ",'" + hierarchylevelname + "','" + scenario + "','" + organization + "','" + datatype + "','" + geographicboundingbox + "') ";//\n";
		 			 
		 			//-------- TOPICS
		 			String topic = EvaluationMethods.checkTopic(result);
		 			
		 			if (topic != "") {
			 			elementINSERT += "\n INSERT INTO TOPICS VALUES(" + topicId + "," + dataCounter + ",'" + topic + "') ";//\n";  
			 			internId2Topic.put(id + "," + topic + "", id + "," + topic + "");
			 			topicId++;
		 			}
		 			  
		 			String parent = result.getString(10);
		 			if (parent != null && parent != "" && !parent.equals("null")) {
		 				if (original2InternId.get(parent) != null) {
		 					elementINSERT += "\n INSERT INTO HIERARCHY VALUES(" + hierarchyId + "," + dataCounter + "," + original2InternId.get(parent) + ") ";//\n";
		 					hierarchyId++;	
		 				} else {
		 					parentChildRest.put(dataCounter.toString(), parent);
		 				}
		 			 }  
		 			
		 			//-------- URL
		 			String url = "http://catalog.glues.geo.tu-dresden.de:8080/terraCatalog/Query/ShowCSWInfo.do?fileIdentifier=" + id; 			  
		 			String info = "", save = "";
		 			if (datatype.equals("dataset")) {
		 				String[] saveInfo = RequestEvaluation.getLinks(result);
		 				if (saveInfo != null) {
		 					if (saveInfo[0] != null) save = saveInfo[0];
		 					if (saveInfo[1] != null) info = saveInfo[0];
		 					
		 					if (info != null && info.equals("null")) info = "";
		 					if (save != null && save.equals("null")) save = "";
		 				}
		 			}
		 			elementINSERT += "\n INSERT INTO URL VALUES(" + dataCounter + ",'" + url + "','" + info + "','" + save + "') ";//\n"; 
		 			
		 			original2InternId.put(id, dataCounter.toString());
		 			
		 			//-------- RELATEDS
		 			String relatedService = "", relatedLayer = "", relatedServiceId = ""; 
		 			if (datatype.equals("service")) {
		 				relatedService = RequestEvaluation.getServiceURL(result); 
		 			}
		 			
		 			if (description != null && !description.equals("")) {
		 				String rsIDCS = (String) xpe.getXPathResult(Constants.xPathRSIdCodeSpace, new String(), FileDocumentMethods.createDocument(result.getString(12)).getChildNodes());
		 				String rsIDC = (String) xpe.getXPathResult(Constants.xPathRSIdentifier, new String(), FileDocumentMethods.createDocument(result.getString(12)).getChildNodes());
		 			
		 				String[] serviceURL = RequestHelpMethods.getRecordLink(rsIDCS, rsIDC, dbConnection);
		 				if (serviceURL != null && serviceURL[0] != "") {
		 					relatedService = serviceURL[0];
		 					relatedLayer = serviceURL[1]; 
		 					relatedServiceId = serviceURL[2];  
		 				}
		 				
		 				if (!relatedService.equals("")) { 
		 					if (relatedServiceId == null || relatedServiceId.equals(""))
		 						relatedServiceId = id;
		 					elementINSERT += "\n INSERT INTO RELATEDS VALUES(" + dataCounter + ",'" + relatedService + "','" + relatedServiceId + "','" + relatedLayer + "') ";//\n";		
		 				} 
		 			}  
		 			 
		 			//-------- PUBLICATION
		 			elementINSERT += getPublication(result);	

		 			//-------- WRITE RESULT
		 			FileDocumentMethods.writeFileLine(elementINSERT, path);
		 			dataCounter++;
		 		} else if (original2InternId.containsKey(result.getString(1))) {
		 			String elementINSERT = "";
		 			
		 			//-------- TOPIC
		 			String topic = EvaluationMethods.checkTopic(result); 
		 			String id = original2InternId.get(result.getString(1));
		 			  
		 			if (topic != "" && internId2Topic.containsKey(id + "," + topic + "")) {
			 			elementINSERT = "\n INSERT INTO TOPICS VALUES(" + topicId + "," + id + ",'" + topic + "') ";//\n"; 
			 			internId2Topic.put(id + "," + topic + "",id + "," + topic + "");
			 			topicId++;
		 			} 
		 			
		 			//-------- PUBLICATION
		 			FileDocumentMethods.writeFileLine(getPublication(result), path);
		 			FileDocumentMethods.writeFileLine(elementINSERT, path); 
		 			dataCounter++;
		 		}  
		 	}
		 	
		 	Iterator<Map.Entry<String, String>> prEntries = parentChildRest.entrySet().iterator();
			while (prEntries.hasNext()) {
			    Map.Entry<String, String> entry = prEntries.next();
			     
			    String elementINSERT = "INSERT INTO HIERARCHY VALUES(" + hierarchyId + "," + entry.getKey() + "," + original2InternId.get(entry.getValue()) + ") ";//\n";
	 			hierarchyId++;
	 			FileDocumentMethods.writeFileLine(elementINSERT, path);
			}	
			
		} catch (SQLException e) { e.printStackTrace(); } 
	}
	
	
 
	/**
	 * This method evaluates a metadata xml string and parses publication information that is stored in
	 * the lineage part of the xml. Only dataset xmls will be analyzed here.
	 * 
	 * @param result - the db request result
	 * @return HSQL formatted database string for inserting a publication into the intern database
	 * @throws SQLException
	 */
	public static String getPublication(ResultSet result) throws SQLException {
		String elementINSERT = "";
		NodeList resultNode = FileDocumentMethods.createDocument(result.getString(12)).getChildNodes();
	 
		NodeList processSteps = (NodeList) xpe.getXPathResult(Constants.xPathProcessSteps, new NodeSet(), resultNode);
		NodeList processingInfos = (NodeList) xpe.getXPathResult(Constants.xPathPInfos, new NodeSet(), resultNode);
		for (int k = 0; k < processingInfos.getLength(); k++) { 
			for (int i = 0; i < processSteps.getLength(); i++) { 
				NodeList pIDocumentation = (NodeList) xpe.getXPathResult(Constants.xPathDocumentation, new NodeSet(), processingInfos.item(k).getChildNodes());
			  
				for (int j = 0; j < pIDocumentation.getLength(); j++) { 
					NodeList nodes = pIDocumentation.item(j).getChildNodes(); 
					String title = (String) xpe.getXPathResult(Constants.xPathCiTitle, new String(), nodes);
					String date = (String) xpe.getXPathResult(Constants.xPathCiDate, new String(), nodes);
					String others = (String) xpe.getXPathResult(Constants.xPathCiOtherDetails, new String(), nodes);
  
					title = HelpMethods.prepareString(title);
					
					if (!publicationTitle2Id.containsKey(title) && title != null && !title.equals("") && !title.equals("Original") && !result.getString(2).equals("Test_Lineage")) {
						dataCounter++; 	
						
						//------------- DETAILS 
						String keywords = RequestHelpMethods.getKeywords(result.getString(1), dbConnection);
						String description = "";
						
						if (others.equals("")) description = "No details available";
						else if (others.contains("http")) description = others;
						else description = "Further details: " + others; 
						
						String tempINSERT = "\n INSERT INTO DETAILS VALUES(" + dataCounter + ",'" + dataCounter + "','" + title + "','" + description + "','" + date + "','" + " " + "','" + keywords +"') ";//\n";
			 	 
						//------------- FACETS
						String datatype = "publication";
						String[] hvlScen = RequestEvaluation.getHVLScenario(result);
						String hvl = "";
						String scen = "";
						if (hvlScen[0] != null) hvl = hvlScen[0];
						if (hvlScen[1] != null) scen = hvlScen[1];
						String organization = HelpMethods.prepareString(result.getString(4).trim());
						String geographicboundingbox = EvaluationMethods.convertUTMtoLatLon(result.getString(8));
 
						tempINSERT += "\n INSERT INTO FACETS VALUES(" + dataCounter + ",'" + hvl + "','" + scen + "','" + organization + "','" + datatype + "','" + geographicboundingbox + "') ";//\n";
			 			
						//------------- TOPIC
			 			String topic = EvaluationMethods.checkTopic(result);
			 			if (topic != null && topic != "") {
				 			tempINSERT += "\n INSERT INTO TOPICS VALUES(" + topicId + "," + dataCounter + ",'" + topic + "') ";//\n"; 
				 			internId2Topic.put(dataCounter + "," + topic + "",dataCounter + "," + topic + "");
				 			topicId++;
			 			}
						
			 			//------------- RELATEDS
			 			String rsIDCS = (String) xpe.getXPathResult(Constants.xPathRSIdCodeSpace, new String(), FileDocumentMethods.createDocument(result.getString(12)).getChildNodes());
		 				String rsIDC = (String) xpe.getXPathResult(Constants.xPathRSIdentifier, new String(), FileDocumentMethods.createDocument(result.getString(12)).getChildNodes());
		 			
		 				String[] serviceURL = RequestHelpMethods.getRecordLink(rsIDCS, rsIDC, dbConnection);
		 				if (serviceURL != null && serviceURL[0] != "") {
		 					String relatedService = serviceURL[0];
		 					String relatedLayer = serviceURL[1]; 
		 					String relatedServiceId = serviceURL[2]; 
			 				tempINSERT += "\n INSERT INTO RELATEDS VALUES(" + dataCounter + ",'" + relatedService + "','" + relatedServiceId + "','" + relatedLayer + "') ";//\n";		
		 				}
						 
		 				//------------- RELATEDPUB
		 				String dsId = original2InternId.get(result.getString(1));
		 				tempINSERT += "\n INSERT INTO RELATEDPUB VALUES(" + publicationId + "," + dataCounter + "," + dsId + ") ";//\n";
		 				publicationId2DsId.put(dataCounter+dsId,dataCounter+dsId);
		 				publicationTitle2Id.put(title, dataCounter);
		 				publicationId++; 
		 				
		 				elementINSERT += tempINSERT;
		 				
		 			//Publication already exists, but dataset is not listed as related	
					} else if (publicationTitle2Id.containsKey(title) && title != null && !title.equals("")) { 
						//ADDING RELATED DS to REGISTERED PUBLICATION
						String pubId = String.valueOf(publicationTitle2Id.get(title));
		 				String dsId = original2InternId.get(result.getString(1));
						if (!publicationId2DsId.containsKey(pubId+dsId)) {
							elementINSERT += "\n INSERT INTO RELATEDPUB VALUES(" + publicationId + "," + pubId + "," + dsId + ") ";//\n";
							publicationId2DsId.put(pubId+dsId,pubId+dsId);
							publicationId++;   
						}
					}
				}
			} 
		}
		return elementINSERT;
	}
	
	public static ResultSet doDatabaseRequest() {
		//DB SELECT
	  	Statement stmt;
		try {
			stmt = dbConnection.createStatement(ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
		
		  	ResultSet result = stmt.executeQuery( 
	  			"SELECT DISTINCT tc_md.identifier, tc_md.title, tc_md.abstract, " +
	  					"tc_organisationname.organisationname, tc_md.type, " +
	  					"tc_tempextent.tempextent_begin, tc_tempextent.tempextent_end, " +
	  					"ST_AsEWKT(tc_md.boundingbox), " +
	  					"tc_topiccategory.topiccategory, " +
	  					"tc_md.parentidentifier, " +
	  					"tc_hlv.hierarchylevelname," +
	  					"tc_md.profilefull " +
	  			"FROM " +
	  				"tc30.tc_md " +
	  				"JOIN tc30.tc_organisationname ON tc30.tc_md.idmd = tc30.tc_organisationname.idmdorgname " +
	  				"LEFT OUTER JOIN tc30.tc_topiccategory ON tc30.tc_md.idmd = tc30.tc_topiccategory.idmdtc " +
	  				"LEFT OUTER JOIN tc30.tc_tempextent ON tc30.tc_md.idmd = tc30.tc_tempextent.idmdtempextent " +
	  				"LEFT OUTER JOIN tc30.tc_hlv ON tc30.tc_md.idmd = tc30.tc_hlv.idmdhlv " +
	  				"GROUP BY tc_md.title, tc_md.identifier, tc_md.abstract, " +
	  					"tc_organisationname.organisationname, tc_md.type, " +
	  					"tc_tempextent.tempextent_begin, tc_tempextent.tempextent_end, " +
	  					"tc_md.boundingbox, " +
	  					"tc_topiccategory.topiccategory, " +
	  					"tc_md.parentidentifier, " +
	  					"tc_hlv.hierarchylevelname, " +
	  					"tc_md.profilefull");
		  	return result;
		} catch (SQLException e) { 
			e.printStackTrace();
			return null;
		}
	}
	
 
	//--------------- DISTRIBUTED CATALOGS ---------------------------------------------------------
	//----------------------------------------------------------------------------------------------
	
	public static Document doCatalogRequest(String cswURL) { 
		System.out.println(cswURL);
		GetRecordsRequest lRequest = new GetRecordsRequest();
		lRequest.addNamespace("gco", "http://www.isotc211.org/2005/gco");
		lRequest.addNamespace("gmd", "http://www.isotc211.org/2005/gmd");
		lRequest.addNamespace("srv", "http://www.isotc211.org/2005/srv");
		lRequest.addNamespace("csw", "http://www.opengis.net/cat/csw/2.0.2");
		lRequest.addNamespace("apiso","http://www.opengis.net/cat/csw/apiso/1.0");
		lRequest.addNamespace("xsi","http://www.w3.org/2001/XMLSchema-instance");
		lRequest.addNamespace("gmi","http://eden.ign.fr/xsd/metafor/20050620/gmi");
		lRequest.addNamespace("dc", "http://purl.org/dc/elements/1.1/");
		lRequest.setElementSetName("full").setMaxRecords(500).setTypeName("gmd:MD_Metadata").setResultType("results").setOutputSchema("http://www.isotc211.org/2005/gmd");

		GetRecordsResponse gResponse = new GetRecordsResponse();
		IServiceInvoker invoker = new HttpPostInvoker();
		invoker.initialize(cswURL);
		try { invoker.invoke(lRequest, gResponse); } 
		catch (SystemException e) { e.printStackTrace(); System.out.println("Connection error with " + cswURL); return null; }

		Document document = gResponse.getDocument();
		return document;
	} 
	
	public static void getRecordNames(Document document, String catalogURL) {		
		String xPathEntries = "//gmd:MD_Metadata";
		NodeList entries = (NodeList) xpe.getXPathResult(xPathEntries, new NodeSet(), document.getChildNodes());
 
		for (int i = 0; i < entries.getLength(); i++) {   
			String dataset = (String) xpe.getXPathResult(Constants.xPathPartDataSets, new String(), entries.item(i).getChildNodes());
			String service = (String) xpe.getXPathResult(Constants.xPathPartServices, new String(), entries.item(i).getChildNodes());
			String identifier = (String) xpe.getXPathResult(Constants.xPathId, new String(), entries.item(i).getChildNodes());

			String orga = (String) xpe.getXPathResult(Constants.xPathOrganisationShort, new String(), entries.item(i).getChildNodes());
			if (orga.equals("")) orga = (String) xpe.getXPathResult(Constants.xPathOrganisationShort2, new String(), entries.item(i).getChildNodes());
			if (orga.equals("")) orga = "not defined";
			if (orga.indexOf("http://") >= 0) orga = orga.substring(0, orga.indexOf("http://"));
			orga = orga.replaceAll("/", "-");
			
			NodeList type = (NodeList) xpe.getXPathResult(Constants.xPathRessourceType, new NodeSet(), entries .item(i).getChildNodes());
			String dataType = ""; 
			if (type.getLength() > 0) {
				if (type.item(0).hasAttributes()) {
					if (type.item(0).getAttributes().getLength() > 1) {
						dataType = type.item(0).getAttributes().item(1).getNodeValue();
					}
				}
			}
			
			String abs = "";
			String title = "";
			if (dataType.equals("dataset") || dataType.equals("application") || dataType.equals("series") || dataType.equals("")) {
				title = HelpMethods.prepareString(dataset);
				abs = (String) xpe.getXPathResult(Constants.xPathDataSetAbstractShort, new String(), entries.item(i).getChildNodes());
			} else if (dataType.equals("service")) {
				title = HelpMethods.prepareString(service);
				abs = (String) xpe.getXPathResult(Constants.xPathServiceAbstractShort, new String(), entries.item(i).getChildNodes());
			} 
			
			if (dataType.equals("")) dataType = "not defined";
			if (abs.equals("")) abs = "not defined"; 
			abs = EvaluationMethods.checkAbstract(abs);
			
			String tebp = (String) xpe.getXPathResult(Constants.xPathTimeBeginShort, new String(), entries.item(i).getChildNodes());
			if (tebp != null) tebp = "";		
			String teep = (String) xpe.getXPathResult(Constants.xPathTimeEndShort, new String(), entries.item(i).getChildNodes());
 			if (teep != null) teep = "";	
 			
 			String geographicboundingbox = RequestEvaluation.convertUTMtoLatLon(entries.item(i).getChildNodes());			
			String[] topiccategory = RequestEvaluation.checkTopic(entries.item(i).getChildNodes());
			String hierarchylevelname = RequestEvaluation.getHVLScenario2(entries.item(i).getChildNodes());
			
			if (catalogURL.contains("http://139.17.3.254:8080/geonetwork")) hierarchylevelname = "SuMaRiO";
			else if (catalogURL.contains("http://artemis.geogr.uni-jena.de/pycsw")) hierarchylevelname = "KULUNDA";
			else if (catalogURL.contains("http://gdi.carbiocial.de")) hierarchylevelname = "CarBioCial";
			 
			String elementINSERT = "INSERT INTO DETAILS VALUES(" 																				//TODO: keywords				
 					+ dataCounter + ",'" + identifier + "','" + HelpMethods.prepareString(title) + "','" + HelpMethods.prepareString(abs) + "','" + tebp + "','" + teep + "','') ";//\n";
 	 
			elementINSERT += "\n INSERT INTO FACETS VALUES("		 //no scenario	
 					+ dataCounter + ",'" + hierarchylevelname + "','','" + HelpMethods.prepareString(orga) + "','" + dataType + "','" + geographicboundingbox + "') ";//\n";
 			 
			for (int j = 0; j < topiccategory.length; j++) {
				if (topiccategory[j] != "") {
		 			elementINSERT += "\n INSERT INTO TOPICS VALUES(" + topicId + "," + dataCounter + ",'" + topiccategory[j] + "') ";//\n";  
		 			internId2Topic.put(dataCounter + "," + topiccategory[j] + "", dataCounter + "," + topiccategory[j] + "");
		 			topicId++;
	 			}
			}
			
			FileDocumentMethods.writeFileLine(elementINSERT, path); 
			dataCounter++; 
		} 
	}
 
}
