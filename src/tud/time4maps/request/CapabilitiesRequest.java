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

package tud.time4maps.request;

/* 
 * The source code of the class is used from Apache web examples.
 * 
 * ====================================================================
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 * ====================================================================
 *
 * This software consists of voluntary contributions made by many
 * individuals on behalf of the Apache Software Foundation.  For more
 * information on the Apache Software Foundation, please see
 * <http://www.apache.org/>.
 *
 */
       
import java.io.ByteArrayInputStream;  
import java.io.IOException; 
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException; 
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;
        
/**   
 * This class handles WMS requests. 
 * 
 */   
public class CapabilitiesRequest {

	/**
	 * This method is called by class RequestControlling and handles WMS requests.
	 * 
	 * @param wmsUrl - the wms request url
	 * @return response document 
	 */
	public static Document doRequest(String wmsUrl) {   
		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        // factory.setNamespaceAware( true ); factory.setValidating( true );
		try {
			DocumentBuilder builder = factory.newDocumentBuilder();
			return builder.parse(new ByteArrayInputStream(getResponseString(wmsUrl).getBytes()));
        } catch (ParserConfigurationException e) { e.printStackTrace(); 
        } catch (SAXException e) { e.printStackTrace();
		} catch (IOException e) { e.printStackTrace();
		} catch (Exception e) { e.printStackTrace(); }
		return null;
	}
	
	public static String doRequest_Plain(String wmsUrl) {   
		//DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        // factory.setNamespaceAware( true ); factory.setValidating( true );
		try {
			//DocumentBuilder builder = factory.newDocumentBuilder();
			return getResponseString(wmsUrl);
        //} catch (ParserConfigurationException e) { e.printStackTrace();  
		} catch (Exception e) { e.printStackTrace(); }
		return null;
	}

	/**
	 * This method handles http get request and returns response string.
	 * 
	 * @param wmsUrl - the wms request url
	 * @return response document 
	 */
	public static String getResponseString(String wmsUrl) {
		HttpClient httpclient = new DefaultHttpClient(); 
		
		try { 
			String responseBody = "";
			HttpGet httpget = new HttpGet(wmsUrl);
			 
			System.out.println("CR - WMS: " + wmsUrl);
			
			// Create a response handler
			BasicResponseHandler responseHandler = new BasicResponseHandler();
			try {
				responseBody = httpclient.execute(httpget, responseHandler);
			} catch (ClientProtocolException e) { e.printStackTrace();
			} catch (IOException e) { e.printStackTrace(); } 
			
			return responseBody;
		} finally {
			
			// When HttpClient instance is no longer needed,
			// shut down the connection manager to ensure
			// immediate deallocation of all system resources
			httpclient.getConnectionManager().shutdown();
		}	
	}
}
