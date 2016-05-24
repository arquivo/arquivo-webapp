/* ObjectFilterChain
 *
 * $Id: ObjectFilterChain.java 1872 2007-07-25 00:34:39Z bradtofel $
 *
 * Created on 3:12:35 PM Aug 17, 2006.
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
package org.archive.wayback.util;

import java.util.ArrayList;

/**
 * ObjectFilterChain implements AND logic to chain together multiple 
 * ObjectFilters into a composite. ABORT and EXCLUDE short circuit the chain, 
 * all filters must INCLUDE for inclusion.
 *
 * @author brad
 * @version $Date: 2007-07-25 01:34:39 +0100 (Wed, 25 Jul 2007) $, $Revision: 1872 $
 * @param <E> 
 */

public class ObjectFilterChain<E> implements ObjectFilter<E> {

	private ArrayList<ObjectFilter<E>> filters = null;

	/**
	 * Constructor
	 */
	public ObjectFilterChain() {
		this.filters = new ArrayList<ObjectFilter<E>>();
	}

	/**
	 * @param filter to be added to the chain. filters are processed in the 
	 * order they are added to the chain.
	 */
	public void addFilter(ObjectFilter<E> filter) {
		filters.add(filter);
	}

	/* (non-Javadoc)
	 * @see org.archive.wayback.cdx.filter.RecordFilter#filterRecord(org.archive.wayback.cdx.CDXRecord)
	 */
	public int filterObject(E o) {

		int size = filters.size();
		int result = FILTER_ABORT;
		for (int i = 0; i < size; i++) {
			result = filters.get(i).filterObject(o);
			if (result == FILTER_ABORT) {
				break;
			} else if (result == FILTER_EXCLUDE) {
				break;
			}
		}
		return result;
	}
}
