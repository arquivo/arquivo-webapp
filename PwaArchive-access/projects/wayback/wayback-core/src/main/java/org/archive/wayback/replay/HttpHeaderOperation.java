/* HttpHeaderProcessor
 *
 * $Id$
 *
 * Created on 6:44:10 PM Aug 8, 2007.
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
package org.archive.wayback.replay;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.archive.wayback.ResultURIConverter;
import org.archive.wayback.core.Resource;
import org.archive.wayback.core.SearchResult;
import org.archive.wayback.exception.BadContentException;

/**
 *
 *
 * @author brad
 * @version $Date$, $Revision$
 */
public class HttpHeaderOperation {
	
	public final static String HTTP_LENGTH_HEADER = "Content-Length";
    public final static String HTTP_LENGTH_HEADER_UP = HTTP_LENGTH_HEADER.toUpperCase();
    public final static String HTTP_TRANSFER_ENC_HEADER = "Transfer-Encoding".toUpperCase();
    public final static String HTTP_CHUNKED_ENCODING_HEADER = "chunked".toUpperCase();
	
	/**
	 * @param resource
	 * @param httpResponse
	 * @throws BadContentException
	 */
	public static void copyHTTPMessageHeader(Resource resource, 
			HttpServletResponse httpResponse) throws BadContentException {

		// set status code from original resource (which will definitely confuse
		// many clients...)
		int code = resource.getStatusCode();
		// Only return legit status codes -- don't return any minus
		// codes, etc.
		if (code <= HttpServletResponse.SC_CONTINUE) {
			throw new BadContentException("Bad status code " + code);
		}
		httpResponse.setStatus(code);
	}
	
	/**
	 * @param resource
	 * @param result
	 * @param uriConverter
	 * @param filter 
	 * @return
	 */
	public static Map<String,String> processHeaders(Resource resource, 
			SearchResult result, ResultURIConverter uriConverter, 
			HttpHeaderProcessor filter) {
		HashMap<String,String> output = new HashMap<String,String>();
		
		// copy all HTTP headers, as-is, sending "" instead of nulls.
		Map<String,String> headers = resource.getHttpHeaders();
		if (headers != null) {
            Iterator<Map.Entry<String,String>> itr = headers.entrySet().iterator();
			while(itr.hasNext()) {
                Map.Entry<String,String> entry = itr.next();
				String key = entry.getKey();
				String value = entry.getValue();

				value = (value == null) ? "" : value;
				filter.filter(output, key, value, uriConverter, result);
			}
		}
		return output;
	}

	/**
	 * @param headers
	 * @param response
	 */
	public static void sendHeaders(Map<String,String> headers, 
			HttpServletResponse response) {
        Iterator<Map.Entry<String,String>> itr = headers.entrySet().iterator();
		while(itr.hasNext()) {
            Map.Entry<String,String> entry = itr.next();
			String key = entry.getKey();
			String value = entry.getValue();

			value = (value == null) ? "" : value;
			response.setHeader(key,value);
		}
	}
}
