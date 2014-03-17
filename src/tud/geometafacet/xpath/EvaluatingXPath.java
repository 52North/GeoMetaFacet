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

package tud.geometafacet.xpath;

import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

import javax.xml.XMLConstants;
import javax.xml.namespace.NamespaceContext;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
  
/**
 * This class handles xPath queries.
 *   
 * @author Daniel Kadner. Professorship of Geoinformation Systems
 *
 */
public class EvaluatingXPath {   
	       
	// request xpath
	public Object getXPathResult(String xpath, Object returnObject, NodeList nl) {
		XPath xP = XPathFactory.newInstance().newXPath();   
		 
		// namespaces are read from DefaultNamespaces.xml - listed with prefix and uri
		NamespaceContext nsc = new NamespaceContext() {
 
			@Override
			@SuppressWarnings("rawtypes")
			public Iterator getPrefixes(String namespaceURI) { 
				return null;
			}
			
			@Override
			public String getPrefix(String namespaceURI) {
				try {					
					DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
					DocumentBuilder build = fac.newDocumentBuilder();
				
					InputStream inputStream = getClass().getClassLoader().getResourceAsStream("DefaultNamespaces.xml");
					Document doc = build.parse(inputStream); 
				
					for (int i = 0; i < doc.getElementsByTagName("namespace").getLength(); i++) {				
						if (namespaceURI.equals(doc.getElementsByTagName("namespaceuri").item(i).getFirstChild().getNodeValue()))
							return doc.getElementsByTagName("prefix").item(i).getFirstChild().getNodeValue();				
					}					
				} catch (ParserConfigurationException e) { 
					e.printStackTrace(); 
				} catch (SAXException e) { 
					e.printStackTrace(); 
				} catch (IOException e) { 
					e.printStackTrace(); 
				}				
				return null;	
			}

			@Override
			public String getNamespaceURI(String prefix) {
				try {
					DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
					DocumentBuilder build = fac.newDocumentBuilder();
				
					InputStream inputStream = getClass().getClassLoader().getResourceAsStream("DefaultNamespaces.xml");
					Document doc = build.parse(inputStream); 
				
					for (int i = 0; i < doc.getElementsByTagName("namespace").getLength(); i++) {						
						if (prefix.equals(doc.getElementsByTagName("prefix").item(i).getFirstChild().getNodeValue()))
							return doc.getElementsByTagName("namespaceuri").item(i).getFirstChild().getNodeValue();
					}					
				} catch (ParserConfigurationException e) { 
					e.printStackTrace(); 
				} catch (SAXException e) { 
					e.printStackTrace(); 
				} catch (IOException e) { 
					e.printStackTrace(); 
				}
				
				return XMLConstants.NULL_NS_URI;
			}
		};
		xP.setNamespaceContext(nsc);
		
		// evaluating xPath and return result 
		try {
			if (returnObject instanceof NodeList) {  
				return xP.evaluate(xpath, nl, XPathConstants.NODESET);
			}
			if (returnObject instanceof Node) { 
				return xP.evaluate(xpath, nl, XPathConstants.NODE);
			}
			if (returnObject instanceof Boolean) { 
				return xP.evaluate(xpath, nl, XPathConstants.BOOLEAN);
			}
			if (returnObject instanceof Number) { 
				return xP.evaluate(xpath, nl, XPathConstants.NUMBER);
			}
			if (returnObject instanceof String) { 
				return xP.evaluate(xpath, nl, XPathConstants.STRING);
			}
		} catch (XPathExpressionException e) { 
			e.printStackTrace();
		}
		return null;
	}
}
