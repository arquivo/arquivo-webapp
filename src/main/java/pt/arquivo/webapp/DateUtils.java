package pt.arquivo.webapp;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Extracted and refactored from jsp's.
 *
 * @author Ivo Branco <ivo.branco@fccn.pt>
 *
 */
public class DateUtils {

	private static final Pattern OFFSET_PARAMETER = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})");

	private static final String inputDateFormatter = "dd/MM/yyyy";

	private Calendar fixedDateStart;
	private Calendar fixedDateEnd;

	private Calendar dateStart;
	private Calendar dateEnd;

	public DateUtils(String dateStartRequestParameter, String dateEndRequestParameter) {
		this.fixedDateStart = new GregorianCalendar(1996, 1 - 1, 1);
		this.dateStart = (Calendar) fixedDateStart.clone();
		parseDateFromRequest(this.dateStart, dateStartRequestParameter);

		fixedDateEnd = new GregorianCalendar();
		this.dateEnd = (Calendar) fixedDateEnd.clone();
		parseDateFromRequest(this.dateEnd, dateEndRequestParameter);

		// swap dates if they are on inverse order
		if (dateStart.getTime().compareTo(dateEnd.getTime()) > 0) {
			Calendar auxCal = dateStart;
			dateStart = dateEnd;
			dateEnd = auxCal;
		}

		// this.fixedDateEnd.set(Calendar.YEAR, this.fixedDateEnd.get(Calendar.YEAR));
		// this.fixedDateEnd.set(Calendar.MONTH, 12 - 1);
		// this.fixedDateEnd.set(Calendar.DAY_OF_MONTH, 31);
		// this.fixedDateEnd.set(Calendar.HOUR_OF_DAY, 23);
		// this.fixedDateEnd.set(Calendar.MINUTE, 59);
		// this.fixedDateEnd.set(Calendar.SECOND, 59);
		/**
		 * Read the embargo offset value from the configuration page. If not present,
		 * default to: -1 year
		 */
		/*
		try {
			String offsetDateString = Configuration.get("embargo-offset", "0001-00-00");

			Matcher offsetMatcher = OFFSET_PARAMETER.matcher(offsetDateString);
			offsetMatcher.matches();
			int offsetYear = Integer.parseInt(offsetMatcher.group(1));
			int offsetMonth = Integer.parseInt(offsetMatcher.group(2));
			int offsetDay = Integer.parseInt(offsetMatcher.group(3));

			this.fixedDateEnd.set(Calendar.YEAR, this.fixedDateEnd.get(Calendar.YEAR) - offsetYear);
			this.fixedDateEnd.set(Calendar.MONTH, this.fixedDateEnd.get(Calendar.MONTH) - offsetMonth);
			this.fixedDateEnd.set(Calendar.DAY_OF_MONTH, this.fixedDateEnd.get(Calendar.DAY_OF_MONTH) - offsetDay);
		} catch (IllegalStateException e) {
			// Set the default embargo period to: 1 year
			this.fixedDateEnd.set(Calendar.YEAR, this.fixedDateEnd.get(Calendar.YEAR) - 1);
			LOG.error("Embargo offset parameter isn't in a valid format");
		} catch (NullPointerException e) {
			// Set the default embargo period to: 1 year
			this.fixedDateEnd.set(Calendar.YEAR, this.fixedDateEnd.get(Calendar.YEAR) - 1);
			LOG.error("Embargo offset parameter isn't present");
		}
		*/
	}

	public Calendar getDateStart() {
		return this.dateStart;
	}

	public Calendar getDateEnd() {
		return this.dateEnd;
	}

	private static void parseDateFromRequest(Calendar calendar, String dateFromRequestParameter) {
		if (dateFromRequestParameter != null && !dateFromRequestParameter.trim().isEmpty()) {
			Date d = null;
			try {
				d = new SimpleDateFormat(inputDateFormatter).parse(dateFromRequestParameter.trim());
			} catch (ParseException e) {
				LOG.debug("Invalid Date:" + dateFromRequestParameter);
			}
			if (d != null) {
				calendar.setTime(d);
			}
		}
	}

	public String getDateEndYear() {
		String dateEndString = getDateEndString();
		return dateEndString.substring(dateEndString.length() - 4);
	}

	public String getDateEndString() {
		return new SimpleDateFormat(inputDateFormatter).format(getDateEnd().getTime());
	}

	public String getDateEndDay() {
		return getDateEndString().substring(0, 2);
	}

	public String getDateEndMonth() {
		return getDateEndString().substring(3, 5);
	}

	public String getDateEndStringIonic() {
		return getDateEndYear() + "-" + getDateEndMonth() + "-" + getDateEndDay();
	}

	public String getDateStartString() {
		return new SimpleDateFormat(inputDateFormatter).format(getDateStart().getTime());
	}

	public String getDateStartDay() {
		return getDateStartString().substring(0, 2);
	}

	public String getDateStartMonth() {
		return getDateStartString().substring(3, 5);
	}

	public String getDateStartYear() {
		return getDateStartString().substring(getDateStartString().length() - 4);
	}

	public String getDateStartStringIonic() {
		return getDateStartYear() + "-" + getDateStartMonth() + "-" + getDateStartDay();
	}

	public Calendar getFixedDateStart() {
		return fixedDateStart;
	}

	public Calendar getFixedDateEnd() {
		return fixedDateEnd;
	}
}
