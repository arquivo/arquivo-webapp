/* Timestamp
 *
 * Created on 2005/10/18 14:00:00
 *
 * Copyright (C) 2005 Internet Archive.
 *
 * This file is part of the Wayback Machine (crawler.archive.org).
 *
 * Wayback Machine is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * any later version.
 *
 * Wayback Machine is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser Public License for more details.
 *
 * You should have received a copy of the GNU Lesser Public License
 * along with Wayback Machine; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

package org.archive.wayback.core;

import java.io.File;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Properties;
import java.util.SimpleTimeZone;
import java.util.TimeZone;


/**
 * Represents a moment in time as a 14-digit string, and interally as a Date.
 * 
 * @author Brad Tofel
 * @version $Date: 2008-02-06 01:13:42 +0000 (Wed, 06 Feb 2008) $, $Revision: 2174 $
 */
public class Timestamp {

	private final static String LOWER_TIMESTAMP_LIMIT = "10000000000000";
	private final static String UPPER_TIMESTAMP_LIMIT = "29991939295959";
	private final static String YEAR_LOWER_LIMIT      = "1996";
	private final static String YEAR_UPPER_LIMIT      = 
		String.valueOf(Calendar.getInstance().get(Calendar.YEAR));
	private final static String MONTH_LOWER_LIMIT     = "01";
	private final static String MONTH_UPPER_LIMIT     = "12";
	private final static String DAY_LOWER_LIMIT       = "01";
	private final static String HOUR_UPPER_LIMIT      = "23";
	private final static String HOUR_LOWER_LIMIT      = "00";
	private final static String MINUTE_UPPER_LIMIT    = "59";
	private final static String MINUTE_LOWER_LIMIT    = "00";
	private final static String SECOND_UPPER_LIMIT    = "59";
	private final static String SECOND_LOWER_LIMIT    = "00";
	
	private final static int SSE_1996                 = 820454400;

	private final static String[] months = { "Jan", "Feb", "Mar", "Apr", "May",
			"Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
        
    // Acts as a mapping between an ID and a timestamp to surf at.
    // The dir should probably be configurable somehow.
    private static String BDB_DIR = System.getProperty("java.io.tmpdir") +
    	"/wayback/bdb";
    private static Properties bdbMaps = new Properties();
    
	private String dateStr = null;
	private Date date = null;

	/**
	 * Constructor
	 */
	public Timestamp() {
		super();
	}
	
	/**
	 * Construct and initialize structure from a 14-digit String timestamp. If
	 * the argument is too short, or specifies an invalid timestamp, cleanup
	 * will be attempted to create the earliest legal timestamp given the input.
	 * @param dateStr
	 */
	public Timestamp(final String dateStr) {
		super();

		Calendar cal = dateStrToCalendar(dateStr);
		setDate(cal.getTime());
	}

	/**
	 * Construct and initialize structure from an integer number of seconds
	 * since the epoch.
	 * @param sse
	 */
	public Timestamp(final int sse) {
		super();
		setSse(sse);
	}

	/**
	 * Construct and initialize structure from an Date
	 * @param date
	 */
	public Timestamp(final Date date) {
		super();
		setDate(date);
	}

	/**
	 * set internal structure using Date argument
	 * @param date
	 */
	public void setDate(final Date date) {
		this.date = (Date) date.clone();
		Calendar cal = getCalendar();
		cal.setTime(this.date);
		dateStr = calendarToDateStr(cal);		
	}
	
	
	/**
	 * @return Date for this Timestamp
	 */
	public Date getDate() {
		return date;
	}

	/**
	 * set internal structure using seconds since the epoch integer argument
	 * @param sse
	 */
	public void setSse(final int sse) {
		setDate(new Date(((long)sse) * 1000));
	}
	
	/**
	 * initialize interal data structures for this Timestamp from the 14-digit
	 * argument. Will clean up timestamp as needed to yield the ealiest
	 * possible timestamp given the possible partial or wrong argument.
	 * 
	 * @param dateStr
	 */
	public void setDateStr(String dateStr) {
		Calendar cal = dateStrToCalendar(dateStr);
		setDate(cal.getTime());
	}

	/**
	 * @return the 14-digit String representation of this Timestamp.
	 */

	public String getDateStr() {
		return dateStr;
	}

	/**
	 * @return the integer number of seconds since epoch represented by this
	 *         Timestamp.
	 */
	public int sse() {
		return Math.round(date.getTime() / 1000);
	}

	/**
	 * function that calculates integer seconds between this records
	 * timeStamp and the arguments timeStamp. result is the absolute number of
	 * seconds difference.
	 * 
	 * @param otherTimeStamp
	 * @return int absolute seconds between the argument and this records
	 *         timestamp.
	 */
	public int absDistanceFromTimestamp(final Timestamp otherTimeStamp) {
		return Math.abs(distanceFromTimestamp(otherTimeStamp));
	}

	/**
	 * function that calculates integer seconds between this records
	 * timeStamp and the arguments timeStamp. result is negative if this records
	 * timeStamp is less than the argument, positive if it is greater, and 0 if
	 * the same.
	 * 
	 * @param otherTimeStamp
	 * @return int milliseconds
	 */
	public int distanceFromTimestamp(final Timestamp otherTimeStamp) {
		return otherTimeStamp.sse() - sse();
	}

	/**
	 * @return the year portion(first 4 digits) of this Timestamp
	 */
	public String getYear() {
		return this.dateStr.substring(0, 4);
	}

	/**
	 * @return the month portion(digits 5-6) of this Timestamp
	 */
	public String getMonth() {
		return this.dateStr.substring(4, 6);
	}

	/**
	 * @return the day portion(digits 7-8) of this Timestamp
	 */
	public String getDay() {
		return this.dateStr.substring(6, 8);
	}

	/**
	 * @return user friendly String representation of the date of this
	 *         Timestamp. eg: "Jan 13, 1999"
	 */
	public String prettyDate() {
		StringBuilder prettyDate = new StringBuilder();
		String month = dateStr.substring(4, 6);
		int monthInt = Integer.parseInt(month) - 1;
		String prettyMonth = "UNK";

		if ((monthInt >= 0) && (monthInt < months.length)) {
			prettyMonth = months[monthInt];
		}

		prettyDate.append(prettyMonth);                 // month
		prettyDate.append(" ");
		prettyDate.append(dateStr.substring(0, 4));     // day
		prettyDate.append(", ");
		prettyDate.append(dateStr.substring(6, 8));     // year

		return prettyDate.toString();
	}

	/**
	 * @return user friendly String representation of the Time of this
	 *         Timestamp.
	 */
	public String prettyTime() {
		return dateStr.substring(8, 10) + ":" + dateStr.substring(10, 12) + ":"
				+ dateStr.substring(12, 14);
	}

	/**
	 * @return user friendly String representation of the Date and Time of this
	 *         Timestamp.
	 */
	public String prettyDateTime() {
		return prettyDate() + " " + prettyTime();
	}

	/*
	 * 
	 * ALL STATIC METHOD BELOW HERE:
	 * =============================
	 * 
	 */
	
	private static String frontZeroPad(final String input, final int digits) {
		int missing = digits - input.length();
		StringBuilder padded = new StringBuilder();
		for(int i = 0; i < missing; i++) {
			padded.append("0");
		}
		padded.append(input);
		return padded.toString();
	}
	private static String frontZeroPad(final int input, final int digits) {
		return frontZeroPad(String.valueOf(input), digits);
	}
	
	private static Calendar getCalendar() {
		String[] ids = TimeZone.getAvailableIDs(0);
		if (ids.length < 1) {
			return null;
		}
		TimeZone gmt = new SimpleTimeZone(0, ids[0]);
		return new GregorianCalendar(gmt);		
	}
	
	/**
	 * cleanup the dateStr argument assuming earliest values, and return a
	 * GMT calendar set to the time described by the dateStr.
	 * 
	 * @param dateStr
	 * @return Calendar
	 */
	public static Calendar dateStrToCalendar(final String dateStr) {
		
		String paddedDateStr = padStartDateStr(dateStr);

		Calendar cal = getCalendar();
		int iYear = Integer.parseInt(paddedDateStr.substring(0,4));
		int iMonth = Integer.parseInt(paddedDateStr.substring(4,6));
		int iDay = Integer.parseInt(paddedDateStr.substring(6,8));
		int iHour = Integer.parseInt(paddedDateStr.substring(8,10));
		int iMinute = Integer.parseInt(paddedDateStr.substring(10,12));
		int iSecond = Integer.parseInt(paddedDateStr.substring(12,14));

		cal.set(Calendar.YEAR,iYear);
		cal.set(Calendar.MONTH,iMonth - 1);
		cal.set(Calendar.DAY_OF_MONTH,iDay);
		cal.set(Calendar.HOUR_OF_DAY,iHour);
		cal.set(Calendar.MINUTE,iMinute);
		cal.set(Calendar.SECOND,iSecond);
		
		return cal;
	}

	private static String calendarToDateStr(Calendar cal) {
		StringBuilder date = new StringBuilder();

		date.append(frontZeroPad(cal.get(Calendar.YEAR),4));
		date.append(frontZeroPad(cal.get(Calendar.MONTH) + 1 ,2));
		date.append(frontZeroPad(cal.get(Calendar.DAY_OF_MONTH),2));
		date.append(frontZeroPad(cal.get(Calendar.HOUR_OF_DAY),2));
		date.append(frontZeroPad(cal.get(Calendar.MINUTE),2));
		date.append(frontZeroPad(cal.get(Calendar.SECOND),2));

		return date.toString();
	}

	private static String padDigits(String input, String min, String max, 
			String missing) {
		if(input == null) {
			input = "";
		}
		StringBuilder finalDigits = new StringBuilder();
		for(int i = 0; i < missing.length(); i++) {
			if(input.length() <= i) {
				finalDigits.append(missing.charAt(i));
			} else {
				char inc = input.charAt(i);
				char maxc = max.charAt(i);
				char minc = min.charAt(i);
				if(inc > maxc) {
					inc = maxc;
				} else if (inc < minc) {
					inc = minc;
				}
				finalDigits.append(inc);
			}
		}
		
		return finalDigits.toString();
	}
	
	private static String boundDigits(String input, String min, String max) {
		String bounded = input;
		if(input.compareTo(min) < 0) {
			bounded = min;
		} else if(input.compareTo(max) > 0) {
			bounded = max;
		}
		return bounded;
	}
	
	// check each of YEAR, MONTH, DAY, HOUR, MINUTE, SECOND to make sure they
	// are not too large or too small, factoring in the month, leap years, etc.
	private static String boundTimestamp(String input) {
		StringBuilder boundTimestamp = new StringBuilder();

		if(input == null) {
			input = "";
		}
		// MAKE SURE THE YEAR IS WITHIN LEGAL BOUNDARIES:
		Calendar tmpCal = getCalendar();
		tmpCal.setTime(new Date());

		boundTimestamp.append(boundDigits(input.substring(0,4),
				YEAR_LOWER_LIMIT,YEAR_UPPER_LIMIT));

		// MAKE SURE THE MONTH IS WITHIN LEGAL BOUNDARIES:
		boundTimestamp.append(boundDigits(input.substring(4,6),
				MONTH_LOWER_LIMIT,MONTH_UPPER_LIMIT));
		
		// NOW DEPENDING ON THE YEAR + MONTH, MAKE SURE THE DAY OF MONTH IS
		// WITHIN LEGAL BOUNDARIES:
		Calendar cal = getCalendar();
		cal.clear();
		int iYear = Integer.parseInt(boundTimestamp.substring(0,4));
		int iMonth = Integer.parseInt(boundTimestamp.substring(4,6));
		cal.set(Calendar.YEAR,iYear);
		cal.set(Calendar.MONTH,iMonth - 1);
		cal.set(Calendar.DAY_OF_MONTH,1);

		String maxDayOfMonth = String.valueOf(cal.getActualMaximum(Calendar.DAY_OF_MONTH));
		if(maxDayOfMonth.length() == 1) {
			maxDayOfMonth = "0" + maxDayOfMonth;
		}
		boundTimestamp.append(boundDigits(input.substring(6,8),
				DAY_LOWER_LIMIT,maxDayOfMonth));
		
		// MAKE SURE THE HOUR IS WITHIN LEGAL BOUNDARIES:
		boundTimestamp.append(boundDigits(input.substring(8,10),
				HOUR_LOWER_LIMIT,HOUR_UPPER_LIMIT));
		
		// MAKE SURE THE MINUTE IS WITHIN LEGAL BOUNDARIES:
		boundTimestamp.append(boundDigits(input.substring(10,12),
				MINUTE_LOWER_LIMIT,MINUTE_UPPER_LIMIT));
		
		// MAKE SURE THE SECOND IS WITHIN LEGAL BOUNDARIES:
		boundTimestamp.append(boundDigits(input.substring(12,14),
				SECOND_LOWER_LIMIT,SECOND_UPPER_LIMIT));

		return boundTimestamp.toString();
	}
	
	/**
	 * clean up timestamp argument assuming latest possible values for missing 
	 * or bogus digits.
	 * @param timestamp String
	 * @return String
	 */
	public static String padEndDateStr(String timestamp) {
		return boundTimestamp(padDigits(timestamp,LOWER_TIMESTAMP_LIMIT,
				UPPER_TIMESTAMP_LIMIT,UPPER_TIMESTAMP_LIMIT));
	}

	/**
	 * clean up timestamp argument assuming earliest possible values for missing
	 * or bogus digits.
	 * @param timestamp String
	 * @return String
	 */
	public static String padStartDateStr(String timestamp) {
		return boundTimestamp(padDigits(timestamp,LOWER_TIMESTAMP_LIMIT,
				UPPER_TIMESTAMP_LIMIT,LOWER_TIMESTAMP_LIMIT));
	}

	/**
	 * @param dateStr
	 * @return Timestamp object representing the earliest date represented by
	 *         the (possibly) partial digit-string argument.
	 */
	public static Timestamp parseBefore(final String dateStr) {
		return new Timestamp(padStartDateStr(dateStr));
	}

	/**
	 * @param dateStr
	 * @return Timestamp object representing the latest date represented by the
	 *         (possibly) partial digit-string argument.
	 */
	public static Timestamp parseAfter(final String dateStr) {
		return new Timestamp(padEndDateStr(dateStr));
	}

	/**
	 * @param sse
	 * @return Timestamp object representing the seconds since epoch argument.
	 */
	public static Timestamp fromSse(final int sse) {
		//String dateStr = ArchiveUtils.get14DigitDate(sse * 1000);
		return new Timestamp(sse);
	}

	/**
	 * @return Timestamp object representing the current date.
	 */
	public static Timestamp currentTimestamp() {
		return new Timestamp(new Date());
	}
    
	/**
	 * @return Timestamp object representing the latest possible date.
	 */
	public static Timestamp latestTimestamp() {
		return currentTimestamp();
	}

	/**
	 * @return Timestamp object representing the earliest possible date.
	 */
	public static Timestamp earliestTimestamp() {
		return new Timestamp(SSE_1996);
	}
    
	/**
	 * @param context
	 * @return singleton BDBMap for the context
	 */
	public static BDBMap getContextMap(String context) {
    	if(context == null) context = "";
    	if(context.startsWith("/")) {
    		context = context.substring(1);
    	}
		BDBMap map = null;
    	synchronized(Timestamp.class) {
    		if(!bdbMaps.containsKey(context)) {
    			File bdbDir = new File(BDB_DIR,context);
    			bdbMaps.put(context,new BDBMap(context, 
    					bdbDir.getAbsolutePath()));
    		}
    		map = (BDBMap) bdbMaps.get(context);
    	}
    	return map;
	}
    /**
     * return the timestamp associated with the identifier argument, or now
     * if no value is associated or something goes wrong.
     * @param context 
     * @param ip
     * @return timestamp string value
     */
    public static String getTimestampForId(String context, String ip) {
    	BDBMap bdbMap = getContextMap(context);
        String dateStr = bdbMap.get(ip);
        return (dateStr != null) ? dateStr : currentTimestamp().getDateStr();
    }
    
   /**
    * associate timestamp time with idenfier ip persistantly 
    * @param context 
    * @param ip
    * @param time
    */
    public static void addTimestampForId(String context, String ip, String time) {
    	BDBMap bdbMap = getContextMap(context);
    	bdbMap.put(ip, time);
    }

}
