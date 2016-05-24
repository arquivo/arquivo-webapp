/* SelfRedirectFilter
 *
 * $Id: SelfRedirectFilter.java 2138 2008-01-15 03:03:21Z bradtofel $
 *
 * Created on 6:23:31 PM Oct 16, 2006.
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

import org.apache.commons.httpclient.URIException;
import org.archive.wayback.UrlCanonicalizer;
import org.archive.wayback.WaybackConstants;
import org.archive.wayback.core.SearchResult;
import org.archive.wayback.util.ObjectFilter;
import org.archive.wayback.util.url.AggressiveUrlCanonicalizer;

/**
 * SearchResultFilter which INCLUDEs all records, unless they redirect to 
 * themselves, via whatever URL purification schemes are in use.
 *
 * @author brad
 * @version $Date: 2008-01-15 03:03:21 +0000 (Tue, 15 Jan 2008) $, $Revision: 2138 $
 */
public class SelfRedirectFilter implements ObjectFilter<SearchResult> {

	private UrlCanonicalizer canonicalizer = new AggressiveUrlCanonicalizer();
	public SelfRedirectFilter() {
		canonicalizer = new AggressiveUrlCanonicalizer();
	}
	/* (non-Javadoc)
	 * @see org.archive.wayback.resourceindex.SearchResultFilter#filterSearchResult(org.archive.wayback.core.SearchResult)
	 */
	public int filterObject(SearchResult r) {
		String httpCode = r.get(WaybackConstants.RESULT_HTTP_CODE);
		// only filter real 3XX http response codes:
		if(httpCode.startsWith("3")) {
			String redirect = r.get(WaybackConstants.RESULT_REDIRECT_URL);
			if(redirect.compareTo("-") != 0) {
				String urlKey = r.get(WaybackConstants.RESULT_URL_KEY);
				try {
					String redirectKey = canonicalizer.urlStringToKey(redirect);
					if(redirectKey.compareTo(urlKey) == 0) {
						return FILTER_EXCLUDE;
					}
				} catch (URIException e) {
					// emit message (is that right?) and continue
					e.printStackTrace();
				}
			}
		}
		return FILTER_INCLUDE;
	}
	public UrlCanonicalizer getCanonicalizer() {
		return canonicalizer;
	}
	public void setCanonicalizer(UrlCanonicalizer canonicalizer) {
		this.canonicalizer = canonicalizer;
	}
}
