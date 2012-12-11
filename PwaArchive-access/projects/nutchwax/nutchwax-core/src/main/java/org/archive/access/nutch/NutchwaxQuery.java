/* Query.java
 *
 * $Id: NutchwaxQuery.java 1896 2007-08-01 21:44:31Z jlee-archive $
 *
 * Created Jul 26, 2005
 *
 * Copyright (C) 2005 Internet Archive.
 * 
 * This file is part of the archive-access tools project
 * (http://sourceforge.net/projects/archive-access).
 * 
 * The archive-access tools are free software; you can redistribute them and/or
 * modify them under the terms of the GNU Lesser Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or any
 * later version.
 * 
 * The archive-access tools are distributed in the hope that they will be
 * useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser
 * Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser Public License along with
 * the archive-access tools; if not, write to the Free Software Foundation,
 * Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 */
package org.archive.access.nutch;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.logging.Logger;
import java.util.regex.Matcher;

import org.apache.hadoop.conf.Configuration;
import org.apache.nutch.searcher.Query;
import org.archive.util.Base32;
import org.archive.util.TextUtils;

import org.archive.access.nutch.jobs.EntryPageExpansion;


/**
 * Handle exacturl when present in queries.
 */
public class NutchwaxQuery
{
  private static Logger LOGGER =
    Logger.getLogger(NutchwaxQuery.class.getName());

  // Look for an exacturl clause that begins with a 
  private static final String EXACTURL_PATTERN =
    "(.*(?:\\(\\s*|\\s|^)exacturl:)([^ ]+)(.*)";
  
  // Look for an exacturlexpand clause that begins with a 
  private static final String EXACTURLEXPAND_PATTERN = // TODO MC
    "(.*(?:\\(\\s*|\\s|^)exacturlexpand:)([^ ]+)(.*)";

  //Look for an exacturlexpandmin clause that begins with a 
  private static final String EXACTURLEXPANDMIN_PATTERN = // TODO MC
    "(.*(?:\\(\\s*|\\s|^)exacturlexpandmin:)([^ ]+)(.*)";

  
  private static MessageDigest md = null;
  
  static
  {
    try
    {
      md = MessageDigest.getInstance("MD5");
    }
    catch (NoSuchAlgorithmException e)
    {
      LOGGER.severe("Failed to get md5 digester: " + e.getMessage());
    }
  }

  /**
   * Does fixup on the passed in query before giving it into nutch.
   * Preprocess the query to do special handling of 'exacturl' clause if
   * present. Split on spaces and then for each term, look for one that
   * begins 'exacturl'. If we find one, special-encode its value.
   * Do an encoding that is neither url nor html.  Same encoding must be done
   * in index-exacturl.  This custom encoding is necessary because
   * NutchAnalysis will not let through '?' or '=' characters in clause values
   * and the '&' character can't be passed in a query string because it'll
   * confuse request.getParameter.
   * @param queryString Query string.
   * @param conf 
   * @return Analyzed query.
   * @throws IOException
   */
  public static Query parse(String queryString, final Configuration conf)
    throws IOException
  {
    return Query.parse(encodeExacturl(queryString), conf);
  }

  public static String encodeExacturl(final String queryString)
  {	  
    Matcher m = TextUtils.getMatcher(EXACTURL_PATTERN, queryString);
    Matcher mexpand = null;
    Matcher mexpandmin = null;
    StringBuffer sb = new StringBuffer(queryString.length());
    
    if (m == null || !m.matches()) {
        mexpand = TextUtils.getMatcher(EXACTURLEXPAND_PATTERN, queryString); // TODO MC - BUG wayback 0000035
        if (mexpand == null || !mexpand.matches()) {
    	    mexpandmin = TextUtils.getMatcher(EXACTURLEXPANDMIN_PATTERN, queryString); // TODO MC - BUG nutchwax 0000357 
            if (mexpandmin == null || !mexpandmin.matches()) { 
                return queryString;
            }      
        }
    }
    
    if (m!=null && m.matches()) {
    	sb.append(m.group(1));    	    	   
    	String urls[]=EntryPageExpansion.expandwww(m.group(2)); // TODO MC - BUG nutchwax 0000566 - add search with and witout www variations  
    	for (int i=0;i<urls.length;i++) {
    		String encoded = Base32.encode(md.digest(urls[i].getBytes()));         	    	
        	if (i==0) {
       			sb.append(encoded);
    		}
    		else {
                       sb.append(" exacturl:").append(encoded);
    		}
    	}
    	sb.append(m.group(3));
    }
    else if (mexpand!=null && mexpand.matches()) { // TODO MC - BUG wayback 0000035 - expand exacturl search with url variations        
    	sb.append(mexpand.group(1));
    	String urls[]=EntryPageExpansion.expand(mexpand.group(2));
    	for (int i=0;i<urls.length;i++) {
    		String encoded = Base32.encode(md.digest(urls[i].getBytes()));
    		if (i==0) {
       			sb.append(encoded);
    		}
    		else {
                       sb.append(" exacturlexpand:").append(encoded);
    		}
    	}
        sb.append(mexpand.group(3));
    }                  
    else { // TODO MC - BUG nutchwax 0000357 
    	sb.append(mexpandmin.group(1).substring(0, mexpandmin.group(1).length()-4)); // remove "min:" and use only exacturlexpand   	
    	String encoded = Base32.encode(md.digest(mexpandmin.group(2).getBytes()));    	
        sb.append(":").append(encoded);
    	encoded = Base32.encode(md.digest((mexpandmin.group(2)+"/").getBytes()));        
        sb.append(" exacturlexpand:").append(encoded);
    	sb.append(mexpandmin.group(3));    	   
    }

    return sb.toString();
  }
}
