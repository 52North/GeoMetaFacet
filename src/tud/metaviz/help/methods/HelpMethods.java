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

package tud.metaviz.help.methods;
   
import java.io.IOException; 
import java.io.InputStream;  
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException; 

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;  
import org.xml.sax.SAXException;

/**
 * This class handles help methods.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
public class HelpMethods {
	
	@SuppressWarnings("unchecked") //TODO: check if used!
	public Object[] processRequest(HttpServletRequest request) {
		Object[] idDocument = new Object[2];
		
		if (request != null) {			
			if (ServletFileUpload.isMultipartContent(request)) {
				ServletFileUpload sfu = new ServletFileUpload(new DiskFileItemFactory());
				List<FileItem> fil; 
				
				try {
					fil = sfu.parseRequest(request);
					Iterator<FileItem> it = fil.iterator();   
					
					while (it.hasNext()) { 
						FileItem fi = (FileItem) it.next();  
						if (fi.getContentType() != null && fi.getContentType().equals("text/xml") && !fi.getName().equals("")) {
							//hold intern as document
							InputStream stream = fi.getInputStream();	 
							DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
							fac.setNamespaceAware(true);   
							idDocument[1] = fac.newDocumentBuilder().parse(stream);  
							
						} else if (fi.isFormField() && fi.getFieldName().contains("dataset_id")) 
							idDocument[0] = fi.getString(); 
					}
				} catch (SAXException e) { e.printStackTrace();  
				} catch (ParserConfigurationException e) { e.printStackTrace();		 
				} catch (FileUploadException e) { e.printStackTrace();
				} catch (IOException e) { e.printStackTrace(); }						    
			}
		}
		return idDocument;
	}
	
}
