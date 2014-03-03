package tud.geometafacet.script;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

/**
 * 
 * This class provide an autorun script to update the underlying HSQL periodically.
 *
 * @author Christin Henzen. Professorship of Geoinformation Systems
 */
public class AutoRunScript extends TimerTask {

	/**
	 * 
	 * @param args
	 */
	public static void main(String[] args){
		try {
			//TODO: change timer codes.
			
			//the Date and time at which you want to execute
		    DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		    Date date = dateFormatter.parse("2014-02-06 10:06:45");

		    //Now create the time and schedule it
		    Timer timer = new Timer();

		    //Use this if you want to execute it once
		    timer.schedule(new AutoRunScript(), date);

		    //Use this if you want to execute it repeatedly
		    int period = 10000;//10secs
		    timer.schedule(new AutoRunScript(), date, period );
		} catch (ParseException e) {  e.printStackTrace(); } 
	}
	
	public static void print() {
		DBCreater.getData();
	}
 
	public void run() {
		print();
	} 
}
