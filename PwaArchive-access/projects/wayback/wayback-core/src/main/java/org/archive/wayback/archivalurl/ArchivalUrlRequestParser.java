/* ArchivalUrlRequestParser
 *
 * $Id$
 *
 * Created on 4:11:52 PM Apr 24, 2007.
 *
 * Copyright (C) 2007 Internet Archive.
 *
 * This file is part of wayback-core.
 *
 * wayback-core is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * any later version.
 *
 * wayback-core is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser Public License for more details.
 *
 * You should have received a copy of the GNU Lesser Public License
 * along with wayback-core; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */
package org.archive.wayback.archivalurl;

import org.archive.wayback.RequestParser;
import org.archive.wayback.archivalurl.requestparser.PathDatePrefixQueryRequestParser;
import org.archive.wayback.archivalurl.requestparser.PathDateRangeQueryRequestParser;
import org.archive.wayback.archivalurl.requestparser.PathPrefixDatePrefixQueryRequestParser;
import org.archive.wayback.archivalurl.requestparser.PathPrefixDateRangeQueryRequestParser;
import org.archive.wayback.archivalurl.requestparser.ReplayRequestParser;
import org.archive.wayback.archivalurl.requestparser.ReplayIdRequestParser;
import org.archive.wayback.requestparser.CompositeRequestParser;
import org.archive.wayback.requestparser.FormRequestParser;
import org.archive.wayback.requestparser.OpenSearchRequestParser;

/**
 * CompositeRequestParser that handles Archival Url Replay and Query requests,
 * in addition to "standard" OpenSearch and Form RequestParsers.
 *
 * @author brad
 * @version $Date$, $Revision$
 */
public class ArchivalUrlRequestParser extends CompositeRequestParser {
	protected RequestParser[] getRequestParsers() {
		RequestParser[] theParsers = {
				new ReplayRequestParser(),
				new ReplayIdRequestParser(), /* BUG wayback 0000155 */
				new PathDatePrefixQueryRequestParser(),
				new PathDateRangeQueryRequestParser(),
				new PathPrefixDatePrefixQueryRequestParser(),
				new PathPrefixDateRangeQueryRequestParser(),
				new OpenSearchRequestParser(),
				new FormRequestParser() 
				};
		return theParsers;
	}
}
