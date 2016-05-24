/* BadQueryException
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

package org.archive.wayback.exception;

import javax.servlet.http.HttpServletResponse;

/**
 * Exception class for malformed user query.
 * 
 * @author Brad Tofel
 * @version $Date: 2007-03-02 00:40:42 +0000 (Fri, 02 Mar 2007) $, $Revision: 1538 $
 */
public class BadQueryException extends WaybackException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected static final String ID = "badQuery";

	/**
	 * Constructor
	 * 
	 * @param message
	 */
	public BadQueryException(String message) {
		super(message,"Bad Query");
		id = ID;
	}
	/** 
	 * Constructor with message and details
	 * 
	 * @param message
	 * @param details
	 */
	public BadQueryException(String message, String details) {
		super(message,"Bad Query",details);
		id = ID;
	}
	/**
	 * @return the HTTP status code appropriate to this exception class.
	 */
	public int getStatus() {
		return HttpServletResponse.SC_BAD_REQUEST;
	}
}
