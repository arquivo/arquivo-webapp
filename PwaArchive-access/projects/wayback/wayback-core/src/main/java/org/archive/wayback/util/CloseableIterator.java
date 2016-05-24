/* Cleanable
 *
 * $Id: CloseableIterator.java 1872 2007-07-25 00:34:39Z bradtofel $
 *
 * Created on 1:44:45 PM Aug 18, 2006.
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
package org.archive.wayback.util;

import java.io.Closeable;
import java.util.Iterator;

/**
 * Iterator with a close method that frees up any resources associated with 
 * the Iterator.
 *
 * @author brad
 * @version $Date: 2007-07-25 01:34:39 +0100 (Wed, 25 Jul 2007) $, $Revision: 1872 $
 * @param <E> 
 */
public interface CloseableIterator<E> extends Iterator<E>, Closeable {
}
