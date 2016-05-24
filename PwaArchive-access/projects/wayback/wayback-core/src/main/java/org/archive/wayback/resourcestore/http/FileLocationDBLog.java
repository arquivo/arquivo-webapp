/* FileLocationDBLog
 *
 * $Id: FileLocationDBLog.java 1856 2007-07-25 00:17:15Z bradtofel $
 *
 * Created on 2:38:18 PM Aug 18, 2006.
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
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.RandomAccessFile;

import org.archive.wayback.exception.ConfigurationException;
import org.archive.wayback.util.CloseableIterator;
import org.archive.wayback.util.flatfile.RecordIterator;


/**
 * 
 * 
 * @author brad
 * @version $Date: 2007-07-25 01:17:15 +0100 (Wed, 25 Jul 2007) $, $Revision: 1856 $
 */
public class FileLocationDBLog extends File {

	/**
	 * 
	 */
	private static final long serialVersionUID = -9128222006544481378L;

	/**
	 * @param pathname
	 * @throws ConfigurationException
	 */
	public FileLocationDBLog(String pathname) throws ConfigurationException {
		super(pathname);
		if (!isFile()) {
			if (exists()) {
				throw new ConfigurationException("path(" + pathname
						+ ") exists but is not a file!");
			}
			try {
				if (!createNewFile()) {
					throw new ConfigurationException(
							"Unable to create empty file " + pathname);
				}
			} catch (IOException e) {
				e.printStackTrace();
				throw new ConfigurationException("Unable to create empty file "
						+ pathname);
			}
		}
	}

	/**
	 * @return long value indicating the current end position of the log
	 */
	public long getCurrentMark() {
		return length();
	}

	/**
	 * @param start
	 * @param end
	 * @return CleanableIterator that returns all arcs between start and end
	 * @throws IOException
	 */
	public CloseableIterator<String> getArcsBetweenMarks(long start, long end)
			throws IOException {

		RandomAccessFile raf = new RandomAccessFile(this, "r");
		raf.seek(start);
		BufferedReader is = new BufferedReader(new FileReader(raf.getFD()));
		return new BufferedRangeIterator(new RecordIterator(is),end - start);
	}

	/**
	 * @param arcName
	 * @throws IOException
	 */
	public synchronized void addArc(String arcName) throws IOException {
		FileWriter writer = new FileWriter(this, true);
		writer.write(arcName + "\n");
		writer.flush();
		writer.close();
	}

	private class BufferedRangeIterator implements CloseableIterator<String> {
		private RecordIterator itr;
		private long bytesToSend;
		private long bytesSent;
		private String next;
		private boolean done;
		/**
		 * @param itr
		 * @param bytesToSend
		 */
		public BufferedRangeIterator(RecordIterator itr, long bytesToSend) {
			this.itr = itr;
			this.bytesToSend = bytesToSend;
			bytesSent = 0;
			next = null;
			done = false;
		}
		/* (non-Javadoc)
		 * @see org.archive.wayback.util.CleanableIterator#clean()
		 */
		public void close() throws IOException {
			if(done == false) {
				itr.close();
				done = true;
			}
		}

		/* (non-Javadoc)
		 * @see java.util.Iterator#hasNext()
		 */
		public boolean hasNext() {
			if(done) return false;
			if(next != null) return true;
			if((bytesSent >= bytesToSend) || !itr.hasNext()) {
				try {
					close();
				} catch (IOException e) {
					// TODO This is lame. What is the right way?
					throw new RuntimeException(e);
				}
				return false;
			}
			next = (String) itr.next();
			return true;
		}

		/* (non-Javadoc)
		 * @see java.util.Iterator#next()
		 */
		public String next() {
			String returnString = next;
			next = null;
			bytesSent += returnString.length() + 1; // TODO: not X-platform!
			return returnString;
		}

		/* (non-Javadoc)
		 * @see java.util.Iterator#remove()
		 */
		public void remove() {
			throw new RuntimeException("not implemented");
		}
	}
}
