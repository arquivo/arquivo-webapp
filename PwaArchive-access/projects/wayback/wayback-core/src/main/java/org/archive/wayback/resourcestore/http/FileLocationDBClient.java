/* FileLocationDBClient
 *
 * $Id: FileLocationDBClient.java 2210 2008-03-01 02:03:30Z bradtofel $
 *
 * Created on 5:59:49 PM Aug 21, 2006.
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
package org.archive.wayback.resourcestore.http;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.logging.Logger;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.util.ParameterFormatter;
import org.archive.wayback.resourcestore.http.FileLocationDBServlet;

import org.archive.wayback.util.FileExt;


/**
 *
 *
 * @author brad
 * @version $Date: 2008-03-01 02:03:30 +0000 (Sáb, 01 Mar 2008) $, $Revision: 2210 $
 */
public class FileLocationDBClient {
	private static final Logger LOGGER = Logger.getLogger(FileLocationDBClient
			.class.getName());

	private final static String ARC_SUFFIX = ".arc";
	private final static String ARC_GZ_SUFFIX = ".arc.gz";
	private final static String WARC_SUFFIX = ".warc";
	private final static String WARC_GZ_SUFFIX = ".warc.gz";
	private final static String OK_RESPONSE_PREFIX = "OK ";
    private HttpClient client = null;
	
	private String serverUrl = null;

	/**
	 * @param serverUrl
	 */
	public FileLocationDBClient(final String serverUrl) {
		super();
		this.serverUrl = serverUrl;
		this.client = new HttpClient();
	}
	
	/**
	 * @return long value representing the current end "mark" of the db log
	 * @throws NumberFormatException
	 * @throws IOException
	 */
	public long getCurrentMark() throws NumberFormatException, IOException {
		NameValuePair[] args = {
				new NameValuePair(
						FileLocationDBServlet.OPERATION_ARGUMENT,
						FileLocationDBServlet.GETMARK_OPERATION),
		};		
		return Long.parseLong(doGetMethod(args));
	}
	
	/**
	 * @param start
	 * @param end
	 * @return Iterator of arc file names between marks start and end
	 * @throws IOException
	 */
	public Iterator<String> getArcsBetweenMarks(long start, long end) 
	throws IOException {
		NameValuePair[] args = {
				new NameValuePair(
						FileLocationDBServlet.OPERATION_ARGUMENT,
						FileLocationDBServlet.GETRANGE_OPERATION),
				new NameValuePair(
						FileLocationDBServlet.START_ARGUMENT,
						String.valueOf(start)),
				new NameValuePair(
						FileLocationDBServlet.END_ARGUMENT,
						String.valueOf(end))
		};		
		return Arrays.asList(doGetMethod(args).split("\n")).iterator();
	}
	
	/**
	 * return an array of String URLs for all known locations of the ARC file
	 * in the DB.
	 * @param arcName
	 * @return String[] of URLs to arcName
	 * @throws IOException
	 */
	public String[] arcToUrls(final String arcName) throws IOException {

		NameValuePair[] args = {
				new NameValuePair(
						FileLocationDBServlet.OPERATION_ARGUMENT,
						FileLocationDBServlet.LOOKUP_OPERATION),
					
				new NameValuePair(
						FileLocationDBServlet.NAME_ARGUMENT,
						arcName)
		};
		String locations = doGetMethod(args);
		if(locations != null) {
			return locations.split("\n");
		}
		return null;
	}
	

	/**
	 * add an Url location for an arcName, unless it already exists
	 * @param arcName
	 * @param arcUrl
	 * @throws IOException
	 */
	public void addArcUrl(final String arcName, final String arcUrl) 
	throws IOException {
		doPostMethod(FileLocationDBServlet.ADD_OPERATION, arcName, arcUrl);
	}

	/**
	 * remove a single Url location for an arcName, if it exists
	 * @param arcName
	 * @param arcUrl
	 * @throws IOException
	 */
	public void removeArcUrl(final String arcName, final String arcUrl) 
	throws IOException {
		doPostMethod(FileLocationDBServlet.REMOVE_OPERATION, arcName, arcUrl);
	}
	
	private String doGetMethod(NameValuePair[] data) throws IOException {
		ParameterFormatter formatter = new ParameterFormatter();
		formatter.setAlwaysUseQuotes(false);
		StringBuilder finalUrl = new StringBuilder(serverUrl);
		if(data.length > 0) {
			finalUrl.append("?");
		}
		for(int i = 0; i < data.length; i++) {
			if(i == 0) {
				finalUrl.append("?");
			} else {
				finalUrl.append("&");
			}
			finalUrl.append(formatter.format(data[i]));
		}

		GetMethod method = new GetMethod(finalUrl.toString()); 
		
        int statusCode = client.executeMethod(method);
        if (statusCode != HttpStatus.SC_OK) {
            throw new IOException("Method failed: " + method.getStatusLine());
        }
        String responseString = method.getResponseBodyAsString();
        if(!responseString.startsWith(OK_RESPONSE_PREFIX)) {
        	if(responseString.startsWith(FileLocationDBServlet.NO_LOCATION_PREFIX)) {
        		return null;
        	}
        	throw new IOException(responseString);
        }
        return responseString.substring(OK_RESPONSE_PREFIX.length()+1); 
	}
	
	private void doPostMethod(final String operation, final String arcName,
			final String arcUrl) 
	throws IOException {
	    PostMethod method = new PostMethod(serverUrl);
        NameValuePair[] data = {
                new NameValuePair(FileLocationDBServlet.OPERATION_ARGUMENT,
                		operation),
                new NameValuePair(FileLocationDBServlet.NAME_ARGUMENT,
                   		arcName),
                new NameValuePair(FileLocationDBServlet.URL_ARGUMENT,
                   		arcUrl)
              };
        method.setRequestBody(data);
        int statusCode = client.executeMethod(method);
        if (statusCode != HttpStatus.SC_OK) {
            throw new IOException("Method failed: " + method.getStatusLine());
        }
        String responseString = method.getResponseBodyAsString();
        if(!responseString.startsWith(OK_RESPONSE_PREFIX)) {
        	throw new IOException(responseString);
        }
	}

	private static void USAGE(String message) {
		System.err.print("USAGE: " + message + "\n" +
				"\t[lookup|add|remove|sync] ...\n" +
				"\n" +
				"\t lookup LOCATION-DB-URL ARC\n" +
				"\t\temit all known URLs for arc ARC\n" +
				"\n" +
				"\t add LOCATION-DB-URL ARC URL\n" +
				"\t\tinform locationDB that ARC is located at URL\n" +
				"\n" +
				"\t remove LOCATION-DB-URL ARC URL\n" +
				"\t\tremove reference to ARC at URL in locationDB\n" +
				"\n" +
				"\t sync LOCATION-DB-URL DIR DIR-URL\n" +
				"\t\tscan directory DIR, and submit all ARC files therein\n" +
				"\t\tto locationDB at url DIR-URL/ARC\n" +
				"\n" +
				"\t get-mark LOCATION-DB-URL\n" +
				"\t\temit an identifier for the current marker in the \n" +
				"\t\tlocationDB log. These identifiers can be used with the\n" +
				"\t\tmark-range operation.\n" +
				"\n" +
				"\t mark-range LOCATION-DB-URL START END\n" +
				"\t\temit to STDOUT one line with the name of all ARC files\n" +
				"\t\tadded to the locationDB between marks START and END\n" +
				"\n" +
				"\t add-stream LOCATION-DB-URL\n" +
				"\t\tread lines from STDIN formatted like:\n" +
				"\t\t\tNAME<SPACE>URL\n" +
				"\t\tand for each line, inform locationDB that file NAME is\n" +
				"\t\tlocated at URL\n"
				);
		System.exit(2);
	}
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		if(args.length < 2) {
			USAGE("");
			System.exit(1);
		}
		String operation = args[0];
		String url = args[1];
		if(!url.startsWith("http://")) {
			USAGE("URL argument 1 must begin with http://");
		}

		FileLocationDBClient locationClient = new FileLocationDBClient(url);
		
		if(operation.equalsIgnoreCase("add-stream")) {
			BufferedReader r = new BufferedReader(
					new InputStreamReader(System.in));
			String line;
			try {
				while((line = r.readLine()) != null) {
					String parts[] = line.split(" ");
					if(parts.length != 2) {
						System.err.println("Bad input(" + line + ")");
						System.exit(2);
					}
					locationClient.addArcUrl(parts[0],parts[1]);
					System.out.println("Added\t" + parts[0] + "\t" + parts[1]);
				}
			} catch (IOException e) {
				e.printStackTrace();
				System.exit(1);
			}
			
		} else {
			if(args.length < 3) {
				USAGE("");
				System.exit(1);
			}
			String arc = args[2];
			if(operation.equalsIgnoreCase("lookup")) {
				if(args.length < 3) {
					USAGE("lookup LOCATION-URL ARC");
				}
				try {
					String[] locations = locationClient.arcToUrls(arc);
					if(locations == null) {
						System.err.println("No locations for " + arc);
						System.exit(1);
					}
					for(int i=0; i <locations.length; i++) {
						System.out.println(locations[i]);
					}
				} catch (IOException e) {
					System.err.println(e.getMessage());
					System.exit(1);
				}
				
			} else if(operation.equalsIgnoreCase("get-mark")) {
				if(args.length != 2) {
					USAGE("get-mark LOCATION-URL");
				}
				try {
					long mark = locationClient.getCurrentMark();
					System.out.println(mark);
				} catch (IOException e) {
					System.err.println(e.getMessage());
					System.exit(1);
				}
				
			} else if(operation.equalsIgnoreCase("mark-range")) {
				if(args.length != 4) {
					USAGE("mark-range LOCATION-URL START END");
				}
				long start = Long.parseLong(args[3]);
				long end = Long.parseLong(args[4]);
				try {
					Iterator<String> it = 
						locationClient.getArcsBetweenMarks(start,end);
					while(it.hasNext()) {
						String next = (String) it.next();
						System.out.println(next);
					}
				} catch (IOException e) {
					System.err.println(e.getMessage());
					System.exit(1);
				}
				
				
			} else if(operation.equalsIgnoreCase("add")) {
				if(args.length != 4) {
					USAGE("add LOCATION-URL ARC ARC-URL");
				}
				String arcUrl = args[3];
				if(!arcUrl.startsWith("http://")) {
					USAGE("ARC-URL argument 4 must begin with http://");
				}
				try {
					locationClient.addArcUrl(arc,arcUrl);
					System.out.println("OK");
				} catch (IOException e) {
					System.err.println(e.getMessage());
					System.exit(1);
				}
				
			} else if(operation.equalsIgnoreCase("remove")) {
				
				if(args.length != 4) {
					USAGE("remove LOCATION-URL ARC ARC-URL");
				}
				String arcUrl = args[3];
				if(!arcUrl.startsWith("http://")) {
					USAGE("ARC-URL argument 4 must begin with http://");
				}
				try {
					locationClient.removeArcUrl(arc,arcUrl);
					System.out.println("OK");
				} catch (IOException e) {
					System.err.println(e.getMessage());
					System.exit(1);
				}
	
			} else if(operation.equalsIgnoreCase("sync")) {
				
				if(args.length != 4) {
					USAGE("sync LOCATION-URL DIR DIR-URL");
				}
				File dir = new File(arc);
				String dirUrl = args[3];
				if(!dirUrl.startsWith("http://")) {
					USAGE("DIR-URL argument 4 must begin with http://");
				}
				try {
					if(!dir.isDirectory()) {
						USAGE("DIR " + arc + " is not a directory");
					}
					
					FileFilter filter = new FileFilter() {
						public boolean accept(File daFile) {
							return daFile.isFile() && 
							(daFile.getName().endsWith(ARC_SUFFIX) ||
								daFile.getName().endsWith(ARC_GZ_SUFFIX) ||
								daFile.getName().endsWith(WARC_SUFFIX) ||
								daFile.getName().endsWith(WARC_GZ_SUFFIX));
						}
					};
					
					//File[] files = dir.listFiles(filter);
					ArrayList<File> filesArray = FileExt.listFilesRecursively(dir, filter); // TODO MC
					File[] files = (File[])filesArray.toArray(new File[filesArray.size()]); // TODO MC		
					
					if(files == null) {
						throw new IOException("Directory " + dir.getAbsolutePath() +
								" is not a directory or had an IO error");
					}
					for(int i = 0; i < files.length; i++) {
						File file = files[i];
						String name = file.getName();
																	
						//String fileUrl = dirUrl + name;
						String fileUrl = dirUrl + file.getAbsolutePath().replaceFirst(dir.getAbsolutePath(),"");	// TODO MC
						LOGGER.info("Adding location " + fileUrl + " for file " + name);
						locationClient.addArcUrl(name,fileUrl);
					}
				} catch (IOException e) {
					System.err.println(e.getMessage());
					System.exit(1);
				}
				
			} else {
				USAGE(" unknown operation " + operation);
			}
		}
	}
}
