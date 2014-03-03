package tud.geometafacet.helper;

import java.util.ArrayList;

/**
 * This class provides help functions to prepare strings, such as skip special characters or trim text.
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
public class HelpMethods {
	/**
	 * Method evaluates a string and replaces all special/additional characters
	 * 
	 * @param incoming - string that should be evaluated 
	 * @return special character free string
	 */
	public static String prepareString(String incoming) {
		if (incoming != null) {
			incoming = incoming.replaceAll("&", "&#38;"); 
			incoming = incoming.replaceAll("'", "&lsquo;")
					.replaceAll("\"", "&quot;")
					.replaceAll("\\(", "&#40;")
					.replaceAll("\\)", "&#41;")
					.replaceAll(",", "&#44;")
					.replaceAll(":", "&#58;")
					.replaceAll("%", "&#37;")
					.replaceAll("\\[", "&#91;")
					.replaceAll("\\]", "&#93;")
					.replaceAll("  ", " ")
					.replaceAll("@", "&#64;")
					.replaceAll("\\+", "&#42;")
					.replaceAll("\\n", " ")
					.replaceAll("\\\n", " ")
					.replaceAll("-", "&#45;")
					.replaceAll("�", "ae")
					.replaceAll("�", "oe").replaceAll("�", "ue")
					.replaceAll("�", "Ae").replaceAll("�", "Oe")
					.replaceAll("�", "Ue").replaceAll("�", "A")
					.replaceAll("�", "a").replaceAll("�", "e")
					.replaceAll("�", "e").replaceAll("�", "a")
					.replaceAll("�", "a").replaceAll("�", "o")
					.replaceAll("�", "o").replaceAll("�", "o")
					.replaceAll("�", "&#x00df;").replaceAll("�", "e")
		            .replaceAll("�", "e").replaceAll("�", "e")
		            .replaceAll("�", "e").replaceAll("�", "o")
		            .replaceAll("�", "A").replaceAll("�", "A")
		            .replaceAll("�", "A").replaceAll("�", "A")
		            .replaceAll("�", "C").replaceAll("�", "E")
		            .replaceAll("�", "E").replaceAll("�", "E")
		            .replaceAll("�", "E").replaceAll("�", "a")
		            .replaceAll("�", "a").replaceAll("�", "a")
		            .replaceAll("�", "a").replaceAll("�", "ae")
		            .replaceAll("�", "c").replaceAll("�", "O")
		            .replaceAll("�", "A").replaceAll("�", "a")
		            .replaceAll("�", "A").replaceAll("�", "a")
		            .replaceAll("�", "N").replaceAll("�", "n")
		            .replaceAll("�", "O").replaceAll("�", "o")
		            .replaceAll("�", "Ae").replaceAll("�", "o")
		            .replaceAll("�", "o").replaceAll("�", "o") 
		            .replaceAll("�", "O").replaceAll("�", "O")
		            .replaceAll("�", "O").replaceAll("�", "i")
		            .replaceAll("�", "i").replaceAll("�", "i")
		            .replaceAll("�", "I").replaceAll("�", "I")
		            .replaceAll("�", "I").replaceAll("�", "u")
		            .replaceAll("�", "u").replaceAll("�", "u")
		            .replaceAll("�", "U").replaceAll("�", "U")
					.replaceAll("\\*", "").replaceAll("\"", "'"); 
			
			while (incoming.indexOf("  ") >= 0)
				incoming = incoming.replaceAll("  ", " ");
			
			incoming = incoming.replaceAll("\\s+", " ");
			incoming = incoming.replaceAll(" +", " ");
			
			return incoming;
		} else return incoming;
	}
	
	/**
	 * Metho evaluates string and replace escaped characters back.
	 * 
	 * @param incoming
	 * @return unescaped text
	 */
	public static String reReplaceString(String incoming) {	 
		incoming = incoming.replaceAll("&#38;", "&"); 
		incoming = incoming.replaceAll("&lsquo;", "'")
				.replaceAll("&quot;", "")
				.replaceAll("&#40;", "\\(")
				.replaceAll("&#41;", "\\)")
				.replaceAll("&#44;", ",")
				.replaceAll("&#58;", ":")
				.replaceAll("&#37;", "%")
				.replaceAll("&#91;", "\\[")
				.replaceAll("&#93;", "\\]") 
				.replaceAll("&#64;", "@")
				.replaceAll("&#42;", "\\+") 
				.replaceAll("&#45;", "-"); 
		incoming = incoming.replaceAll("&#38;", "&");  
		return incoming;
	}
	
	/**
	 * This method replace special characters in a given string.
	 * 
	 * @param text
	 * @return string without special characters
	 */
	public static String replaceSpecialCharacters(String text) { 
		text = text.replaceAll("'", "&lsquo;").replaceAll("\"", "&quot;").replaceAll("\\(", "&#40;").replaceAll("\\)", "&#41;").replaceAll(",", "&#44;").replaceAll(":", "&#58;");
		if (!text.equals("-"))
			text = text.replaceAll("-", "&#45;");
		return text;
	}
	
	/**
	 * This methods replaces double spaces and line breaks \n in a given string.
	 * The spaces lead to errors in JSON objects.
	 * 
	 * @param incoming
	 * @return string without double spaces and line breaks 
	 */
	public static String replaceSpaces(String incoming) {
		while (incoming.indexOf("  ") >= 0)
			incoming = incoming.replaceAll("  ", " ");
		incoming = incoming.replaceAll("\\\n", "");
		incoming = incoming.replaceAll("\\s+", " ");
		incoming = incoming.replaceAll(" +", " ");
		return incoming;
	}
	
	/**
	 * This method replaces spaces and special characters, and trims a text based on given number.
	 * 
	 * @param input - string
	 * @param trim - number (string length)
	 * @return string
	 */
	public static String trimText(String input, Integer trim) {
		input = input.replace("\'", " ");
		input = input.replace("\"", " ");
		input = input.replace("\n", "");
		input = input.replace("\r", "");
		input = input.trim();
		if (input.length() > 500)
			input = input.substring(0, trim) + "...";
		return input;
	}
	
	/**
	 * This method converts and array list to an array.
	 * 
	 * @param elementlist - array list
	 * @return array
	 */
	public static Object[] fillArray(@SuppressWarnings("rawtypes") ArrayList elementlist) {
		Object[] elements = new Object[elementlist.size()];
		for (int i=0; i<elementlist.size(); i++) elements[i] = elementlist.get(i);
		return elements;
	}
}
