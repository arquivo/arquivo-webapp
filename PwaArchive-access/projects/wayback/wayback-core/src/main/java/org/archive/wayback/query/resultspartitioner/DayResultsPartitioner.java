/* DayResultsPartitioner
 *
 * $Id: DayResultsPartitioner.java 1483 2007-02-12 21:49:36Z bradtofel $
 *
 * Created on 3:51:16 PM Jan 11, 2006.
 *
 * Copyright (C) 2006 Internet Archive.
 *
 * This file is part of wayback.
 *
 * wayback is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * any later version.
 *
 * wayback is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser Public License for more details.
 *
 * You should have received a copy of the GNU Lesser Public License
 * along with wayback; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */
package org.archive.wayback.query.resultspartitioner;

import java.util.Calendar;

import org.archive.wayback.core.WaybackRequest;

/**
 *
 *
 * @author brad
 * @version $Date: 2007-02-12 21:49:36 +0000 (Mon, 12 Feb 2007) $, $Revision: 1483 $
 */
public class DayResultsPartitioner extends ResultsPartitioner {
	private static int MAX_SECONDS_SPANNED = 60 * 60 * 24 * 8;
	public int maxSecondsSpanned() {
		return MAX_SECONDS_SPANNED;
	}
	/* (non-Javadoc)
	 * @see org.archive.wayback.resultspartitioner.ResultsPartitioner#alignStart(java.util.Calendar)
	 */
	protected void alignStart(Calendar start) {
		start.set(Calendar.HOUR_OF_DAY,0);
		start.set(Calendar.MINUTE,0);
		start.set(Calendar.SECOND,0);
	}

	/* (non-Javadoc)
	 * @see org.archive.wayback.resultspartitioner.ResultsPartitioner#endOfPartition(java.util.Calendar)
	 */
	protected Calendar incrementPartition(Calendar start, int count) {
		Calendar end = getCalendar();
		end.setTime(start.getTime());
		end.add(Calendar.DAY_OF_YEAR,1 * count);
		return end;
	}

	/* (non-Javadoc)
	 * @see org.archive.wayback.resultspartitioner.ResultsPartitioner#rangeToTitle(java.util.Calendar, java.util.Calendar)
	 */
	protected String rangeToTitle(Calendar start, Calendar end,
			WaybackRequest wbRequest) {
		return wbRequest.getFormatter().format("ResultPartitions.day", 
				start.getTime());
	}
}
