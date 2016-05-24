/* StartDateFilter
 *
 * $Id: StartDateFilter.java 2063 2007-10-29 21:44:06Z bradtofel $
 *
 * Created on 3:45:28 PM Aug 17, 2006.
 *
 * Copyright (C) 2006 Internet Archive.
 *
 * This file is part of Wayback.
 *
 * Wayback is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * any later version.
 *
 * Wayback is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser Public License for more details.
 *
 * You should have received a copy of the GNU Lesser Public License
 * along with Wayback; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */
package org.archive.wayback.resourceindex.filters;

import org.archive.wayback.WaybackConstants;
import org.archive.wayback.core.SearchResult;
import org.archive.wayback.core.Timestamp;
import org.archive.wayback.util.ObjectFilter;

/**
 * SearchResultFilter which includes all records until 1 is found before start 
 * date then it aborts processing. Assumed usage is for URL matches, when 
 * records will be ordered by capture date and traversed in REVERSE ORDER, in 
 * which case the first record before the startDate provided indicates that no 
 * further records will possibly match.
 *
 * @author brad
 * @version $Date: 2007-10-29 21:44:06 +0000 (Mon, 29 Oct 2007) $, $Revision: 2063 $
 */
public class StartDateFilter implements ObjectFilter<SearchResult> {

	private String startDate = null;
	
	/**
	 * @param startDate String timestamp which marks the end of includable 
	 * 		records
	 */
	public StartDateFilter(final String startDate) {
		this.startDate = Timestamp.parseBefore(startDate).getDateStr();
	}

	/* (non-Javadoc)
	 * @see org.archive.wayback.resourceindex.SearchResultFilter#filterSearchResult(org.archive.wayback.core.SearchResult)
	 */
	public int filterObject(SearchResult r) {
		String captureDate = r.get(WaybackConstants.RESULT_CAPTURE_DATE);
		return (startDate.substring(0,captureDate.length()).compareTo(
				captureDate) > 0) ? 
				FILTER_ABORT : FILTER_INCLUDE; 
	}
}
