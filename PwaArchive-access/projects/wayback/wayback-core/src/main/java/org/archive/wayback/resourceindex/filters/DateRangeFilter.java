/* DateRangeFilter
 *
 * $Id: DateRangeFilter.java 2063 2007-10-29 21:44:06Z bradtofel $
 *
 * Created on 3:24:21 PM Aug 17, 2006.
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
 * SearchResultFilter that excludes records outside of start and end range.
 *
 * @author brad
 * @version $Date: 2007-10-29 21:44:06 +0000 (Mon, 29 Oct 2007) $, $Revision: 2063 $
 */

public class DateRangeFilter implements ObjectFilter<SearchResult> {
	
	private String first = null;
	private String last = null;
	
	/**
	 * @param first String earliest date to include
	 * @param last String latest date to include
	 */
	public DateRangeFilter(final String first, final String last) {
		this.first = Timestamp.parseBefore(first).getDateStr();
		this.last = Timestamp.parseAfter(last).getDateStr();
	}

	/* (non-Javadoc)
	 * @see org.archive.wayback.resourceindex.SearchResultFilter#filterSearchResult(org.archive.wayback.core.SearchResult)
	 */
	public int filterObject(SearchResult r) {
		String captureDate = r.get(WaybackConstants.RESULT_CAPTURE_DATE);
		return ((first.compareTo(captureDate) > 0) ||
				(last.compareTo(captureDate) < 0)) ? 
						FILTER_EXCLUDE : FILTER_INCLUDE;
	}
}
