/* RecordIterator
 *
 * $Id: RecordIterator.java 1873 2007-07-25 00:35:07Z bradtofel $
 *
 * Created on 2:12:37 PM Aug 17, 2006.
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
package org.archive.wayback.util.flatfile;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.NoSuchElementException;

import org.archive.wayback.util.CloseableIterator;

/**
* Iterator that returns sequential lines from a file.
*
* @author brad
* @version $Date: 2007-07-25 01:35:07 +0100 (Wed, 25 Jul 2007) $, $Revision: 1873 $
*/
public class RecordIterator implements CloseableIterator<String> {
	private BufferedReader br;

	protected String next = null;

	protected boolean done = false;

	/**
	 * @param br
	 */
	public RecordIterator(BufferedReader br) {
		this.br = br;
		if(br == null) {
			done = true;
		}
	}

	public boolean hasNext() {
		if (next != null)
			return true;
		if(done) {
			return false;
		}
		try {
			String nextLine = br.readLine();
			if (nextLine == null) {
				close();
			} else {
				next = nextLine;
			}
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
		return (next != null);
	}

	public String next() {
		if (!hasNext()) {
			throw new NoSuchElementException();
		}
		// 'next' is guaranteed non-null by a hasNext() which returned true
		String returnString = this.next;
		this.next = null;
		return returnString;
	}
	/**
	 * @throws IOException
	 */
	public void close() throws IOException {
		if(done == false) {
			done = true;
			br.close();
		}
	}
	/* (non-Javadoc)
	 * @see java.util.Iterator#remove()
	 */
	public void remove() {
		throw new RuntimeException("unsupported remove");
	}
}
