package tud.time4maps.help;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;
import org.joda.time.DateTime;
import org.joda.time.Period;

/**
 * This class is a helper class for splitting time dimension string given in
 * capabilities doc.
 *  
 * @author Hannes Tressel, Christin Henzen, Daniel Kadner. Professorship of Geoinformation Systems
 * 
 */
public class SplitTimeParams {

	/**
	 * This method splits the time values of the wms capabilities document and returns a map of all needed params.
	 * 
	 * @param dimension_ - the content of the dimension tag of the capabilities document
	 * @param defaultTime_ - the given default time
	 * @return a map with all temporal information
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map<String, Object> splitDimension_(String[] dimension_, String[] defaultTime_) {
		Vector startD = new Vector();
		Vector endD = new Vector();
		Vector steps = new Vector();
		Vector defaultD = new Vector();
		Vector periode = new Vector();
		Vector periodYear = new Vector();
		Vector periodMonth = new Vector();
		Vector periodDay = new Vector();

		Map<String, Object> time = new HashMap<String, Object>();
		Map<String, Object> period = new HashMap<String, Object>();
		period.put("paramName", "periodParam");

		for (int i = 0; i < dimension_.length; i++) {
			String[] timeVals = dimension_[i].split("/");

			startD.add(getStartDate(timeVals));
			steps.add(getSteps(timeVals));
			endD.add(getEndDate(timeVals));

			if (defaultTime_[i] == "" || defaultTime_[i] == null) {
				defaultD.add(getDefaultTime(timeVals));

			} else {
				if (defaultTime_[i].equals("current")) {
					defaultD.add(((Date) startD.get(i)));
				} else {
					defaultD.add(new DateTime(defaultTime_[i]).toDate());
				}

			}

			if (startD.get(i) != null && startD.get(i) != "") {
				if (((Date) startD.get(i)).after(((Date) endD.get(i)))) {
					Date tmp = (Date) endD.get(i);
					endD.setElementAt(startD.get(i), i);
					startD.setElementAt(tmp, i);
					defaultD.setElementAt(tmp, i);
				}

			}

			periode.add(getPeriod(timeVals));

			if (((Period) periode.get(i)) != null) {
				periodYear.add((((Period) periode.get(i)).getYears()));
				periodMonth.add((((Period) periode.get(i)).getMonths()));
				periodDay.add((((Period) periode.get(i)).getDays()));
			} else {
				periodYear.add(null);
				periodMonth.add(null);
				periodDay.add(null);
			}
		}

		period.put("year", periodYear);
		period.put("month", periodMonth);
		period.put("day", periodDay);

		time.put("paramName", "timeParam");
		time.put("start", startD);
		time.put("end", endD);
		time.put("def", defaultD);
		time.put("period", period);
		time.put("steps", steps);
		return time;

	}

	/**
	 * This method extracts the period from the time string of the dimension tag.
	 * 
	 * @param @param timeVals_ - an array with start date, end date and period time or time steps
	 * @return a period object
	 */
	public Period getPeriod(String[] timeVals_) {
		Period periodTime = null;

		if (timeVals_.length == 3) {
			periodTime = new Period(timeVals_[2]);
			return periodTime;
		} else if (timeVals_.length == 2) {
			periodTime = new Period("P1Y");
			return periodTime;
		} else if (timeVals_.length == 1) {
			periodTime = null;
			return periodTime;
		}
		return null;
	}

	/**
	 * This method extracts the time steps from the time string of the dimension tag.
	 * 
	 * @param timeVals_ - an array with start date, end date and period time or time steps
	 * @return time steps, if they are available
	 */
	public String[] getSteps(String[] timeVals_) {
		if (timeVals_.length == 1 && timeVals_ != null && timeVals_[0] != "") {
			if (timeVals_[0].contains(","))
				timeVals_ = timeVals_[0].split(",");
			return timeVals_;
		}
		return null;
	}

	/**
	 * This method extracts the default time from the time string of the dimension tag.
	 * If the time information is malformed or can't be handled by the javascript code the year will be corrected and set to 1800.
	 * 
	 * @param timeVals_ - an array with start date, end date and period time or time steps
	 * @return a date object with default date information
	 */
	public Date getDefaultTime(String[] timeVals_) {
		DateTime defaultDate = null;

		int minYear = 1800; //dojo calendar can't handle earlier years

		if (timeVals_.length == 3 || timeVals_.length == 2) {
			if (timeVals_[0] != "" && timeVals_[0] != null) {

				defaultDate = new DateTime(timeVals_[0]);

				if (defaultDate.getYear() < minYear)
					defaultDate = defaultDate.plusYears(minYear
							- defaultDate.getYear());

				return defaultDate.toDate();
			}
		} else if (timeVals_.length == 1) {
			if (timeVals_[0].contains(","))
				timeVals_ = timeVals_[0].split(",");

			if (timeVals_[0] != "" && timeVals_[0] != null) {
				defaultDate = new DateTime(timeVals_[0]);
				if (defaultDate.getYear() < minYear)
					defaultDate = defaultDate.plusYears(minYear - defaultDate.getYear());

				return defaultDate.toDate();
			}
		}
		return null;
	}

	/**
	 * This method extracts the end date from the time string of the dimension tag.
	 * 
	 * @param timeVals_ - an array with start date, end date and period time or time steps
	 * @return a date object with information about end of given time range
	 */
	public Date getEndDate(String[] timeVals_) {
		DateTime endDate = null;

		if (timeVals_.length == 3 || timeVals_.length == 2) {
			if (timeVals_[1].contains("T00:00:00.000Z"))
				timeVals_[1] = timeVals_[1].replace("T00:00:00.000Z", "");
			endDate = new DateTime(timeVals_[1]);
			return endDate.toDate();
		} else if (timeVals_.length == 1 && timeVals_[0] != null && timeVals_[0] != "") {
			if (timeVals_[0].contains(","))
				timeVals_ = timeVals_[0].split(",");
			if (timeVals_[timeVals_.length - 1] != "") {
				if (timeVals_[timeVals_.length - 1].contains("T00:00:00.000Z"))
					timeVals_[timeVals_.length - 1] = timeVals_[timeVals_.length - 1].replace("T00:00:00.000Z", "");
				endDate = new DateTime(timeVals_[timeVals_.length - 1]);
				return endDate.toDate();
			}
			return null;
		}
		return null;
	}

	/**
	 * This method extracts the start date from the time string of the dimension tag.
	 * 
	 * @param timeVals_ - an array with start date, end date and period time or time steps
	 * @return a date object with information about start of given time range
	 */
	public Date getStartDate(String[] timeVals_) {
		DateTime startDate = null;
		int minYear = 1800;

		if (timeVals_.length == 3 || timeVals_.length == 2) {
			if (timeVals_[0].contains("T00:00:00.000Z"))
				timeVals_[0] = timeVals_[0].replace("T00:00:00.000Z", "");

			startDate = new DateTime(timeVals_[0]);

			if (startDate.getYear() < minYear)
				startDate = startDate.plusYears(minYear - startDate.getYear());
			return startDate.toDate();
		} else if (timeVals_.length == 1 && timeVals_ != null
				&& timeVals_[0] != "") {
			if (timeVals_[0].contains(","))
				timeVals_ = timeVals_[0].split(",");

			if (timeVals_[0] != "") {
				if (timeVals_[0].contains("T0:0:0.0Z"))
					timeVals_[0] = timeVals_[0].replace("T0:0:0.0Z", "");

				if (timeVals_[0].contains("T00:00:00.000Z"))
					timeVals_[0] = timeVals_[0].replace("T00:00:00.000Z", "");

				startDate = new DateTime(timeVals_[0]);
				return startDate.toDate();
			}
			return null;
		}
		return null;
	}
}