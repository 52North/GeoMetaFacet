package tud.metaviz.connection;

/**
 * 
 * Connection interface.
 * This interface is implemented by @see JDBCConnection, CSWConnection, FileConnection
 * 
 * @author Christin Henzen. Professorship of Geoinformation Systems
 *
 */
public interface Connection {	 
	public String getRecordDetails(String id);
	public String getRecordNames();
}
