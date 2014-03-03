package tud.geometafacet.helper;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

/**
 * 
 * This class handles help methods to clear and write files, and create documents.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class FileDocumentMethods {
	
	/**
	 * Method to clear content of a given file.
	 * 
	 * @param path - path to file
	 */
	public static void clearFile(String path) {
		BufferedWriter bw = null;  
		try {  
			bw = new BufferedWriter(new FileWriter(path, false));	 
			bw.write(""); 
		    bw.flush();   
		} catch (IOException e) { System.err.println( "Konnte Datei nicht erstellen" );
		} finally {
			if (bw != null) try { bw.close(); } catch (IOException e) { e.printStackTrace(); }
		}
	}
	
	/**
	 * Method to read a file and convert it into a document.
	 * 
	 * @param file to read
	 * @return document
	 */
	public static Document readFile(File file) {  
		try {
			FileInputStream stream = new FileInputStream(file);
			BufferedInputStream bis = new BufferedInputStream(stream);
	 
			int readBytes = 0;
			String fileContent = "";
			
			while ((readBytes = bis.read()) != -1)
				fileContent += readBytes;
		 
			if (bis != null)
				bis.close();
			if (stream != null)
				stream.close();
			
			return createDocument(fileContent);
			
		} catch (FileNotFoundException e) { e.printStackTrace(); } 
		  catch (IOException e) { e.printStackTrace(); }
		  
		return null; 
	}
	
	static boolean firstLine = true;
	/**
	 * Method to write a file.
	 * 
	 * @param line - text to write
	 * @param path - path to file
	 */
	public static void writeFileLine(String line, String path) {
		if (!line.equals("")) {
			if (firstLine) firstLine = false;
			else line = " \n " + line;
			
			BufferedWriter bw = null;  
			try {  
				bw = new BufferedWriter(new FileWriter(path, true));	 
				bw.write(line); 
			    bw.flush();   
			} catch (IOException e) { System.err.println( "Konnte Datei nicht erstellen" );
			} finally {
				if (bw != null) try { bw.close(); } catch (IOException e) { e.printStackTrace(); }
			}
		}
	}
	
	/**
	 * This method converts a file into a document.
	 * 
	 * @param file
	 * @return document
	 */
	public static Document convert(File file) {
		try{
			FileInputStream fis = new FileInputStream(file);
			BufferedInputStream stream = new BufferedInputStream(fis); 
			DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
			fac.setNamespaceAware(true);  
			Document doc = null;
		 
			doc = fac.newDocumentBuilder().parse(stream);
			return doc;
		} catch (SAXException e) { e.printStackTrace();  
		} catch (ParserConfigurationException e) { e.printStackTrace();		 
		} catch (IOException e) { e.printStackTrace(); }
		return null;	
	}
	
	/**
	 * this method creates a document with given text.
	 * 
	 * @param xmlString - text of the document
	 * @return document
	 */
	public static Document createDocument(String xmlString) {
		DocumentBuilderFactory fac = DocumentBuilderFactory.newInstance();
		fac.setNamespaceAware(true);
		Document doc = null;
		try {
			doc = fac.newDocumentBuilder().parse(new InputSource(new StringReader(xmlString)));
		} catch (SAXException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			e.printStackTrace();
		}
		return doc;
	}

	/**
	 * Method to print an xml document on console (formatted).
	 * @param doc
	 */
	public static void printXML(Document doc) {
		try {
			DOMSource domSource = new DOMSource(doc);
			StringWriter writer = new StringWriter();
			StreamResult result = new StreamResult(writer);
			TransformerFactory tf = TransformerFactory.newInstance();
			Transformer transformer = tf.newTransformer();
			transformer.transform(domSource, result);
			//System.out.println(writer.toString());
		} catch (TransformerException ex) {
			ex.printStackTrace();
		}
	}
}
