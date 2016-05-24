/* SearchResults
 *
 * $Id: SearchResults.java 1771 2007-07-16 22:32:47Z bradtofel $
 *
 * Created on 12:52:13 PM Nov 9, 2005.
 *
 * Copyright (C) 2005 Internet Archive.
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
package org.archive.wayback.core;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;

/**
 *
 *
 * @author brad
 * @version $Date: 2007-07-16 23:32:47 +0100 (Mon, 16 Jul 2007) $, $Revision: 1771 $
 */
public abstract class SearchResults {
	/**
	 * List of SearchResult objects for index records matching a query
	 */
	protected ArrayList<SearchResult> results = null;
	/**
	 * 14-digit timestamp of first capture date contained in the SearchResults
	 */
	protected String firstResultDate;
	/**
	 * 14-digit timestamp of last capture date contained in the SearchResults
	 */
	protected String lastResultDate;
		
	
	/**
	 * Expandable data bag for tuples associated with the search results, 
	 * likely examples might be "total matching documents", "index of first 
	 * document returned", etc. 
	 */
	private Properties filters = new Properties();
	
	/**
	 * Constructor
	 */
	public SearchResults() {
		super();
		results = new ArrayList<SearchResult>();
	}
	/**
	 * @return true if no SearchResult objects, false otherwise.
	 */
	public boolean isEmpty() {
		return results.isEmpty();
	}
	
	/**
	 * @param result
	 * @param append
	 */
	public void addSearchResultRaw(final SearchResult result, 
			final boolean append) {

		if(append) {
			results.add(result);
		} else {
			results.add(0,result);
		}
	}
	
	/**
	 * @return one of "Url" or "Capture" depending on the type of results
	 * contained in this object
	 */
	public abstract String getResultsType();
	
	/**
	 * append a result
	 * @param result
	 */
	public abstract void addSearchResult(final SearchResult result);
	/**
	 * add a result to this results, at either the begginning or at the end,
	 * depending on the append argument
	 * @param result
	 *            SearchResult to add to this set
	 * @param append 
	 */
	public abstract void addSearchResult(final SearchResult result, 
			final boolean append);
	
	/**
	 * @return number of SearchResult objects contained in these SearchResults
	 */
	public int getResultCount() {
		return results.size();
	}
	
	/**
	 * @return an Iterator that contains the SearchResult objects
	 */
	public Iterator<SearchResult> iterator() {
		return results.iterator();
	}
	/**
	 * @return Returns the firstResultDate.
	 */
	public String getFirstResultDate() {
		return firstResultDate;
	}
	/**
	 * @return Returns the lastResultDate.
	 */
	public String getLastResultDate() {
		return lastResultDate;
	}
	
	/* BUG 0000155 */
	/**
	 * @return Returns the url of the first result.
	 */
	public String getFirstResultUrl() {
		return results.get(0).getUrl();
	}
	/* BUG 0000155 */

	/**
	 * @param key
	 * @return boolean, true if key 'key' exists in filters
	 */
	public boolean containsFilter(String key) {
		return filters.containsKey(key);
	}

	/**
	 * @param key
	 * @return value of key 'key' in filters
	 */
	public String getFilter(String key) {
		return filters.getProperty(key);
	}

	/**
	 * @param key
	 * @param value
	 * @return previous String value of key 'key' or null if there was none
	 */
	public String putFilter(String key, String value) {
		return (String) filters.setProperty(key, value);
	}
	/**
	 * @return Returns the filters.
	 */
	public Properties getFilters() {
		return filters;
	}
}
