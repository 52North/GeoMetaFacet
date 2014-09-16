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

package tud.geometafacet.helper;
 
import java.io.FileOutputStream;
import java.io.IOException; 
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.GeneralSecurityException;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec; 

/**
 * 
 * This class provides basic evaluation methods for strings or result sets.
 *
 * @author Bernd Grafe. Professorship of Geoinformation Systems
 */
public class EncryptionTest {

	public static void main(String[] args) throws IOException {
		try {
			// !! if u change environmental variable - restart tomcat/eclipse

			// //TEST - encrypt, save in file, decrypt and print

			// Encryption to save password with given key in a file
			// String key = "1234567890123456"; //encryption key - save it in a
			// environment variable
			// or
			final String key = System.getenv("ABC");
			System.out.println(key);
			String path = "C:\\password.txt"; // path to file
			String password = "xx"; // password to encrypt

			encrypt(key, password, path); // password

			// Decryption - reads file and uses key from given environment
			// variable
			String envVar = "ABC"; // environment variable with key as value

			System.out.println("decrypted value:" + (decrypt(envVar, path)));

		} catch (GeneralSecurityException e) {
			e.printStackTrace();
		}
	}

	/**
	 * encrypt value with given key and path
	 * 
	 * @param key
	 *            encryption key - should be saved in environment variables
	 * @param value
	 *            password to encrypt
	 * @param path
	 *            path to save encrypted value
	 * @return
	 * @throws GeneralSecurityException
	 * @throws IOException
	 */
	public static void encrypt(String key, String value, String path) throws GeneralSecurityException, IOException {
		byte[] raw = key.getBytes(Charset.forName("US-ASCII"));
		if (raw.length != 16) {
			throw new IllegalArgumentException("Invalid key size.");
		}

		SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, skeySpec, new IvParameterSpec(new byte[16]));
		FileDocumentMethods.clearFile(path);
		byte[] encrypted = cipher.doFinal(value.getBytes(Charset.forName("US-ASCII")));
		writeFile(encrypted, path);
	}

	/**
	 * 
	 * @param key
	 * @param encrypted
	 * @param path
	 * @return
	 * @throws GeneralSecurityException
	 * @throws IOException
	 */
	public static String decrypt(String env, String path) throws GeneralSecurityException, IOException { 
		final String key = System.getenv(env); // get Key from environment
		// variables 
		byte[] encrypted = readFile(path); 
		byte[] raw = key.getBytes(Charset.forName("US-ASCII"));
		if (raw.length != 16) 
			throw new IllegalArgumentException("Invalid key size.");
		
		SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");

		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, skeySpec, new IvParameterSpec(new byte[16]));
		byte[] original = cipher.doFinal(encrypted);

		return new String(original, Charset.forName("US-ASCII"));
	}

	public static void writeFile(byte[] bytes, String path) throws IOException { 
		FileOutputStream fos = new FileOutputStream(path);
		fos.write(bytes);
		fos.close();
	}

	/**
	 * read file
	 * 
	 * @param path
	 * @return
	 * @throws IOException
	 */
	public static byte[] readFile(String file) throws IOException {
		Path path = Paths.get(file);
		byte[] data = Files.readAllBytes(path);

		return data;
	}

}