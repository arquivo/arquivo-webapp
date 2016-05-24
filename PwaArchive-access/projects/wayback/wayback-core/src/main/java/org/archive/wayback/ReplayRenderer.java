/* ReplayRenderer
 *
 * $Id: ReplayRenderer.java 2253 2008-04-17 20:39:00Z bradtofel $
 *
 * Created on 5:27:09 PM Nov 1, 2005.
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
package org.archive.wayback;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.archive.wayback.core.Resource;
import org.archive.wayback.core.SearchResult;
import org.archive.wayback.core.SearchResults;
import org.archive.wayback.core.WaybackRequest;
import org.archive.wayback.exception.WaybackException;

/**
 *
 *
 * @author brad
 * @version $Date: 2008-04-17 21:39:00 +0100 (Qui, 17 Abr 2008) $, $Revision: 2253 $
 */
public interface ReplayRenderer {

	/**
	 * return a resource to the user.
	 * 
	 * @param httpRequest the HttpServletRequest
	 * @param httpResponse the HttpServletResponse
	 * @param wbRequest the WaybackRequest that returned the results
	 * @param result actual SearchResult that maps to resource to replay
	 * @param resource resource to replay
	 * @param uriConverter the URI converter to use to translate matching
	 *                      results into replayable URLs
	 * @param results all SearchResults that were returned from the 
	 * 						ResourceIndex, probably including other capture
	 * 						dates of the same URL.
	 * @throws ServletException
	 * @throws IOException
	 * @throws WaybackException 
	 */
	public void renderResource(HttpServletRequest httpRequest,
			HttpServletResponse httpResponse, WaybackRequest wbRequest,
			SearchResult result, Resource resource, 
			ResultURIConverter uriConverter, SearchResults results)
	throws ServletException, IOException, WaybackException;
}
