/* WindowStartFilter
 *
 * $Id: WindowStartFilter.java 1876 2007-07-25 00:40:16Z bradtofel $
 *
 * Created on 3:54:12 PM Aug 17, 2006.
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

import org.archive.wayback.core.SearchResult;
import org.archive.wayback.util.ObjectFilter;

/**
 * SearchResultFitler that omits the first N records seen.
 *
 * @author brad
 * @version $Date: 2007-07-25 01:40:16 +0100 (Wed, 25 Jul 2007) $, $Revision: 1876 $
 */
public class WindowStartFilter implements ObjectFilter<SearchResult> {

	private int windowStart = 0;
	private int numSeen = 0;
	
	/**
	 * @param windowStart int number of records to skip before including any
	 */
	public WindowStartFilter(int windowStart) {
		this.windowStart = windowStart;
		this.numSeen = 0;
	}

	/* (non-Javadoc)
	 * @see org.archive.wayback.resourceindex.SearchResultFilter#filterSearchResult(org.archive.wayback.core.SearchResult)
	 */
	public int filterObject(SearchResult r) {
		numSeen++;
		if(numSeen > windowStart) {
			return FILTER_INCLUDE;
		}
		return FILTER_EXCLUDE;
	}
}
