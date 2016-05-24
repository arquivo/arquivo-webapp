/* ConfigurationException
 *
 * $Id: ConfigurationException.java 1538 2007-03-02 00:40:42Z bradtofel $
 *
 * Created on 6:35:13 PM Oct 31, 2005.
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
package org.archive.wayback.exception;

import javax.servlet.http.HttpServletResponse;

/**
 * Exception class for configuration-related problems
 *
 * @author brad
 * @version $Date: 2007-03-02 00:40:42 +0000 (Fri, 02 Mar 2007) $, $Revision: 1538 $
 */
public class ConfigurationException extends WaybackException {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected static final String ID = "configuration";

	/**
	 * Constructor
	 * 
	 * @param message
	 */
	public ConfigurationException(String message) {
		super(message,"Configuration Error");
		id = ID;
	}
	/**
	 * Constructor with message and details
	 * 
	 * @param message
	 * @param details
	 */
	public ConfigurationException(String message, String details) {
		super(message,"Configuration Error",details);
		id = ID;
	}
	/**
	 * @return the HTTP status code appropriate to this exception class.
	 */
	public int getStatus() {
		return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
	}
}
