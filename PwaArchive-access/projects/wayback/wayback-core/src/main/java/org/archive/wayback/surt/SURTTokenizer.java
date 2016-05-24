/* SURTTokenizer
 *
 * $Id: SURTTokenizer.java 1748 2007-05-29 21:15:55Z bradtofel $
 *
 * Created on 3:21:49 PM May 11, 2006.
 *
 * Copyright (C) 2006 Internet Archive.
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
package org.archive.wayback.surt;

import org.apache.commons.httpclient.URIException;
import org.archive.net.UURI;
import org.archive.net.UURIFactory;
import org.archive.util.ArchiveUtils;
import org.archive.util.SURT;

/**
 * provides iterative Url reduction for prefix matching to find ever coarser
 * grained URL-specific configuration. Assumes that a prefix binary search is
 * being attempted for each returned value. First value is the entire SURT
 * url String, with TAB appended. Second removes CGI ARGs. Then each subsequent
 * path segment ('/' separated) is removed. Then the login:password, if present
 * is removed. Then the port, if not :80 or omitted on the initial URL. Then
 * each subsequent authority segment(. separated) is removed.
 * 
 * the nextSearch() method will return null, finally, when no broader searches
 * can be attempted on the URL.
 *
 * @author brad
 * @version $Date: 2007-05-29 22:15:55 +0100 (Tue, 29 May 2007) $, $Revision: 1748 $
 */
public class SURTTokenizer {

	private final static String EXACT_SUFFIX = "\t";
	private String remainder;
	private boolean triedExact;
	private boolean triedFull;
	private boolean choppedArgs;
	private boolean choppedPath;
	private boolean choppedLogin;
	private boolean choppedPort;
	
	/**
	 * constructor
	 * 
	 * @param url String URL
	 * @throws URIException 
	 */
	public SURTTokenizer(final String url) throws URIException {
		if(url.startsWith("(")) {
			remainder = url;
		} else {
			remainder = getKey(url,false);
		}
	}
	/**
	 * update internal state and return the next smaller search string
	 * for the url
	 * 
	 * @return string to lookup for prefix match for relevant information.
	 */
	public String nextSearch() {
		if(!triedExact) {
			triedExact = true;
			return remainder + EXACT_SUFFIX;
		}
		if(!triedFull) {
			triedFull = true;
			if(remainder.endsWith(")/")) {
				choppedPath = true;
			}
			return remainder;
		}
		if(!choppedArgs) {
			choppedArgs = true;
			int argStart = remainder.indexOf('?');
			if(argStart != -1) {
				remainder = remainder.substring(0,argStart);
				return remainder;
			}
		}
		// we have already returned remainder as-is, so we have slightly
		// special handling here to make sure we continue to make progress:
		// (com,foo,www,)/         => (com,foo,www,
		// (com,foo,www,)/bar      => (com,foo,www,)/
		// (com,foo,www,)/bar/     => (com,foo,www,)/bar
		// (com,foo,www,)/bar/foo  => (com,foo,www,)/bar
		// (com,foo,www,)/bar/foo/ => (com,foo,www,)/bar/foo
		if(!choppedPath) {
			int lastSlash = remainder.lastIndexOf('/');
			if(lastSlash != -1) {
				if(lastSlash == (remainder.length()-1)) {
					if(remainder.endsWith(")/")) {
						String tmp = remainder;
						remainder = remainder.substring(0,lastSlash-1);
						choppedPath = true;
						return tmp;
					} else {
						remainder = remainder.substring(0,lastSlash);
						return remainder;
					}
				}
				if(remainder.charAt(lastSlash-1) == ')') {
					String tmp = remainder.substring(0,lastSlash+1);
					remainder = remainder.substring(0,lastSlash-1);
					return tmp;
				} else {
					remainder = remainder.substring(0,lastSlash);
					return remainder;
				}
			}
			choppedPath = true;
		}
		if(!choppedLogin) {
			choppedLogin = true;
			int lastAt = remainder.lastIndexOf('@');
			if(lastAt != -1) {
				String tmp = remainder;
				remainder = remainder.substring(0,lastAt);
				return tmp;
			}
		}
		if(!choppedPort) {
			choppedPort = true;
			int lastColon = remainder.lastIndexOf(':');
			if(lastColon != -1) {
				return remainder;
			}
		}
		// now just remove ','s
		int lastComma = remainder.lastIndexOf(',');
		if(lastComma == -1) {
			return null;
		}
		remainder = remainder.substring(0,lastComma);
		return remainder;
	}
	
	/**
	 * @param url
	 * @return String SURT which will match exactly argument url
	 * @throws URIException
	 */
	public static String exactKey(String url) throws URIException {
		return getKey(url,false);
	}

	/**
	 * @param url
	 * @return String SURT which will match urls prefixed with the argument url
	 * @throws URIException
	 */
	public static String prefixKey(String url) throws URIException {
		return getKey(url,true);
	}
	
	private static String getKey(String url, boolean prefix)
	throws URIException {

		String key = ArchiveUtils.addImpliedHttpIfNecessary(url);
		UURI uuri = UURIFactory.getInstance(key);
		key = uuri.getScheme() + "://" + uuri.getAuthority() + 
			uuri.getEscapedPathQuery();

		key = SURT.fromURI(key);
		
		int hashPos = key.indexOf('#');
		if(hashPos != -1) {
			key = key.substring(0,hashPos);
		}
		
		if(key.startsWith("http://")) {
			key = key.substring(7);
		}
		if(prefix) {
			if(key.endsWith(",)/")) {
				key = key.substring(0,key.length()-3);
			}
		}
		return key;
	}
}
