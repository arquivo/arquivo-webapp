/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// A COPY OF hadoop's TaskLog but with hadoop-1199 patch applied.
// package org.apache.hadoop.mapred;
package org.archive.mapred;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Vector;

import org.apache.commons.logging.*;

/**
 * A simple logger to handle the task-specific user logs.
 * This class uses the system property <code>hadoop.log.dir</code>.
 * 
 * <p>A COPY OF hadoop's TaskLog but with hadoop-1199 patch applied.
 * 
 * @author Arun C Murthy
 */
public class ArchiveTaskLog {
  private static final Log LOG =
    LogFactory.getLog(ArchiveTaskLog.class.getName());

  public static final File LOG_DIR = 
    new File(System.getProperty("hadoop.log.dir"), "userlogs");
  
  private static final String SPLIT_INDEX_NAME = "split.idx";
  
  static {
    if (!LOG_DIR.exists()) {
      LOG_DIR.mkdirs();
    }
  }

  private static File getTaskLogDir(String taskid, LogFilter filter) {
    return new File(new File(LOG_DIR, taskid), filter.getPrefix());
  }
  
  /**
   * The filter for userlogs.
   */
  public static enum LogFilter {
    /** Log on the stdout of the task. */
    STDOUT ("stdout"),

    /** Log on the stderr of the task. */
    STDERR ("stderr"),
    
    /** Log on the map-reduce system logs of the task. */
    SYSLOG ("syslog");
    
    private String prefix;
    
    private LogFilter(String prefix) {
      this.prefix = prefix;
    }
    
    String getPrefix() {
      return prefix;
    }
  }
  
  /**
   * The log-writer responsible for handling writing user-logs
   * and maintaining splits and ensuring job-specifc limits 
   * w.r.t logs-size etc. are honoured.
   *  
   * @author Arun C Murthy
   */
  static class Writer {
    private String taskId;
    private LogFilter filter;

    private final File taskLogDir;
    private final int noKeepSplits;
    private final long splitFileSize;
    private final boolean purgeLogSplits;
    private final int logsRetainHours;

    private boolean initialized = false;
    private long splitOffset = 0;
    private long splitLength = 0;
    private int noSplits = 0;
    
    private File currentSplit;            // current split filename
    private OutputStream out;               // current split
    private OutputStream splitIndex;        // split index file
    
    private int flushCtr = 0;
    private final static int FLUSH_BYTES = 256;

    /**
     * Creates a new TaskLog writer.
     * @param conf configuration of the task
     * @param taskId taskid of the task
     * @param filter the {@link LogFilter} to apply on userlogs.
     */
    Writer(String taskId, LogFilter filter, 
            int noKeepSplits, long totalLogSize, boolean purgeLogSplits, int logsRetainHours) {
      this.taskId = taskId;
      this.filter = filter;
      
      this.taskLogDir = getTaskLogDir(this.taskId, this.filter);
      
      this.noKeepSplits = noKeepSplits;
      this.splitFileSize = (totalLogSize / noKeepSplits);
      this.purgeLogSplits = purgeLogSplits;
      this.logsRetainHours = logsRetainHours;
    }
    
    private static class TaskLogsPurgeFilter implements FileFilter {
      long purgeTimeStamp;
    
      TaskLogsPurgeFilter(long purgeTimeStamp) {
        this.purgeTimeStamp = purgeTimeStamp;
      }

      public boolean accept(File file) {
        LOG.debug("PurgeFilter - file: " + file + ", mtime: " + file.lastModified() + ", purge: " + purgeTimeStamp);
        return file.lastModified() < purgeTimeStamp;
      }
    }

    private File getLogSplit(int split) {
      String splitName = "part-" + String.format("%1$06d", split);
      return new File(taskLogDir, splitName); 
    }
    
    private void deleteDir(File dir) throws IOException {
      File[] files = dir.listFiles();
      if (files != null) {
        for (int i=0; i < files.length; ++i) {
          if (files[i].isDirectory()) {
            deleteDir(files[i]);
          }
          files[i].delete();
        }
      }
      boolean del = dir.delete();
      LOG.debug("Deleted " + dir + ": " + del);
    }
    
    /**
     * Initialize the task log-writer.
     * 
     * @throws IOException
     */
    public synchronized void init() throws IOException {
      if (!initialized) {
        // Purge logs of tasks on this tasktracker if their  
        // mtime has exceeded "mapred.task.log.retain" hours
        long purgeTimeStamp = System.currentTimeMillis() - 
                              (logsRetainHours*60*60*1000);
        File[] oldTaskLogs = LOG_DIR.listFiles(
                                new TaskLogsPurgeFilter(purgeTimeStamp)
                              );
        if (oldTaskLogs != null) {
          for (int i=0; i < oldTaskLogs.length; ++i) {
            deleteDir(oldTaskLogs[i]);
          }
        }

        // Initialize the task's log directory
        if (taskLogDir.exists()) {
          deleteDir(taskLogDir);
        }
        taskLogDir.mkdirs();
        
        // Create the split index
        splitIndex = new BufferedOutputStream(
            new FileOutputStream(new File(taskLogDir, SPLIT_INDEX_NAME))
            );

        out = createLogSplit(noSplits);
        initialized = true;
      }
    }
    
    /**
     * Write a log message to the task log.
     * 
     * @param b bytes to be writter
     * @param off start offset
     * @param len length of data
     * @throws IOException
     */
    public synchronized void write(byte[] b, int off, int len) 
    throws IOException {
      // Check if we need to rotate the log
      if (splitLength > splitFileSize) {
        LOG.debug("Total no. of bytes written to split#" + noSplits + 
            " -> " + splitLength);
        logRotate();
      }
      
      // Periodically flush data to disk
      if (flushCtr > FLUSH_BYTES) {
        out.flush();
        flushCtr = 0;
      }
      
      // Write out to the log-split
      out.write(b, off, len);
      splitLength += len;
      flushCtr += len;
    }
    
    /**
     * Close the task log.
     * 
     * @throws IOException
     */
    public synchronized void close() throws IOException {
      // Close the final split
      if (out != null) {
        out.close();
      }

      // Close the split-index
      if (splitIndex != null) {
        writeIndexRecord();
        splitIndex.close();
      }
    }

    private synchronized OutputStream createLogSplit(int split) 
    throws IOException {
      currentSplit =  getLogSplit(split);
      LOG.debug("About to create the split: " + currentSplit);
      return new BufferedOutputStream(new FileOutputStream(currentSplit));
    }
    
    private synchronized void writeIndexRecord() throws IOException {
      String indexRecord = new String(currentSplit + "|" + 
          splitOffset + "|" + splitLength + "\n");
      splitIndex.write(indexRecord.getBytes());
      splitIndex.flush();
    }
    
    private synchronized void logRotate() throws IOException {
      // Close the current split
      LOG.debug("About to rotate-out the split: " + noSplits);
      out.close();
      
      // Record the 'split' in the index
      writeIndexRecord();
      
      // Re-initialize the state
      splitOffset += splitLength;
      splitLength = 0;
      flushCtr = 0;

      // New 'split'
      ++noSplits;

      // Check if we need to purge an old split
      if (purgeLogSplits) {
        if (noSplits >= noKeepSplits) {   // noSplits is zero-based
          File purgeLogSplit = getLogSplit((noSplits-noKeepSplits));
          purgeLogSplit.delete();
          LOG.debug("Purged log-split #" + (noSplits-noKeepSplits) + " - " + 
              purgeLogSplit);
        }
      }
      
      // Rotate the log
      out = createLogSplit(noSplits); 
    }
    
  } // TaskLog.Writer

  /**
   * The log-reader for reading the 'split' user-logs.
   *
   * @author Arun C Murthy
   */
  public static class Reader {
    private URL taskLogDir;
    private boolean initialized = false;
    
    private IndexRecord[] indexRecords = null;
    private BufferedReader splitIndex;
    
    private long logFileSize = 0;
    
    /**
     * Create a new task log reader.
     * 
     * @param taskId task id of the task.
     * @param filter the {@link LogFilter} to apply on userlogs.
     */
    public Reader(String taskId) {
      try {
        this.taskLogDir = getTaskLogDir(taskId, LogFilter.SYSLOG).toURL();
      } catch (MalformedURLException e) {
        throw new RuntimeException("Failed getting URL to taskLogDir: " +
          taskId + ", " + LogFilter.SYSLOG.toString(), e);
      }
    }
    
    /**
     * Create a new task log reader.
     * 
     * @param u URL that is inclusive of <code>taskid</code> and
     * <code>filter</code>: e.g.
     * <code>file:///hadoop/logs/userlogs/task0001_m_00000_0/stdout/</code>
     * @throws IOException
     */
    public Reader(final URL u) throws IOException {
        // Append a slash if absent.  Otherwise, last part of URL is dropped
        // when we make a new URL out of taskLogDir plus log part-XXXXX (See
        // init and getLogSplit below.
        this.taskLogDir = u.getPath().endsWith("/")? u:
            new URL(u.toString() + "/");
    }

    private static class IndexRecord {
      String splitName;
      long splitOffset;
      long splitLength;
      
      IndexRecord(String splitName, long splitOffset, long splitLength) {
        this.splitName = splitName;
        this.splitOffset = splitOffset;
        this.splitLength = splitLength;
      }
    }
    
    private synchronized void init() throws IOException {
      URL u = new URL(this.taskLogDir, SPLIT_INDEX_NAME); 
      this.splitIndex = new BufferedReader(new InputStreamReader(u.openStream()));
      // Parse the split-index and store the offsets/lengths
      ArrayList<IndexRecord> records = new ArrayList<IndexRecord>();
      String line;
      while ((line = splitIndex.readLine()) != null) {
        String[] fields = line.split("\\|");
        if (fields.length != 3) {
          throw new IOException("Malformed split-index with " + 
              fields.length + " fields");
        }
        
        IndexRecord record = new IndexRecord(
                                fields[0], 
                                Long.valueOf(fields[1]).longValue(), 
                                Long.valueOf(fields[2]).longValue()
                              );
        LOG.debug("Split: <" + record.splitName + ", " + record.splitOffset + 
            ", " + record.splitLength + ">");
        
        // Save 
        records.add(record);
        logFileSize += record.splitLength;
      }

      indexRecords = new IndexRecord[records.size()];
      indexRecords = records.toArray(indexRecords);
      initialized = true;
      LOG.debug("Log size: " + logFileSize);
    }

    /**
     * Return the total 'logical' log-size written by the task, including
     * purged data.
     * 
     * @return the total 'logical' log-size written by the task, including
     *         purged data.
     * @throws IOException
     */
    public long getTotalLogSize() throws IOException {
      if (!initialized) {
        init();
      }
      
      return logFileSize;
    }
    
    public InputStream getInputStream() throws IOException {
        if (!initialized) {
            init();
        }

        Enumeration<InputStream> e = new Enumeration<InputStream>() {
            private int index = 0;

            public boolean hasMoreElements() {
                return index < indexRecords.length;
            }

            public InputStream nextElement() {
                InputStream is = null;
                try {
                    is = getLogSplit(this.index++);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return is;
            }
        };
        return new SequenceInputStream(e);
    }
    
    /**
     * Return the entire user-log (remaining splits).
     * 
     * @return Returns a <code>byte[]</code> containing the data in user-log.
     * @throws IOException
     */
    public byte[] fetchAll() throws IOException {
      if (!initialized) {
        init();
      }
      
      // Get all splits 
      Vector<InputStream> streams = new Vector<InputStream>();
      int totalLogSize = 0;
      for (int i=0; i < indexRecords.length; ++i) {
        InputStream stream = getLogSplit(i);
        if (stream != null) {
          streams.add(stream);
          totalLogSize += indexRecords[i].splitLength;
          LOG.debug("Added split: " + i);
        }
      }
      LOG.debug("Total log-size on disk: " + totalLogSize + 
          "; actual log-size: " + logFileSize);

      // Copy log data into buffer
      byte[] b = new byte[totalLogSize];
      SequenceInputStream in = new SequenceInputStream(streams.elements());
      int bytesRead = 0, totalBytesRead = 0;
      int off = 0, len = totalLogSize;
      LOG.debug("Attempting to read " + len + " bytes from logs");
      while ((bytesRead = in.read(b, off, len)) > 0) {
        LOG.debug("Got " + bytesRead + " bytes");
        off += bytesRead;
        len -= bytesRead;
        
        totalBytesRead += bytesRead;
      }

      if (totalBytesRead != totalLogSize) {
        LOG.debug("Didn't not read all requisite data in logs!");
      }
      
      return b;
    }
    
    /**
     * Tail the user-log.
     * 
     * @param b the buffer into which the data is read.
     * @param off the start offset in array <code>b</code>
     *            at which the data is written.
     * @param len the maximum number of bytes to read.
     * @param tailSize the no. of bytes to be read from end of file.
     * @param tailWindow the sliding window for tailing the logs.
     * @return the total number of bytes of user-logs dataread into the buffer.
     * @throws IOException
     */
    public synchronized int tail(byte[] b, int off, int len, 
        long tailSize, int tailWindow) 
    throws IOException {
      if (!initialized) {
        init();
      }
      
      LOG.debug("tailSize: " + tailSize + " - tailWindow: " + tailWindow);
      
      if (tailSize*tailWindow > logFileSize) {
        tailSize = logFileSize;
        tailWindow = 1;
      }
      
      return read(b, off, len, 
          (long)(logFileSize-(tailSize*tailWindow)), tailSize);
    }

    /**
     * Read user-log data given an offset/length.
     * 
     * @param b the buffer into which the data is read.
     * @param off the start offset in array <code>b</code>
     *            at which the data is written.
     * @param len the maximum number of bytes to read.
     * @param logOffset the offset of the user-log from which to get data.
     * @param logLength the maximum number of bytes of user-log data to fetch. 
     * @return the total number of bytes of user-logs dataread into the buffer.
     * @throws IOException
     */
    public synchronized int read(byte[] b, int off, int len, 
        long logOffset, long logLength) 
    throws IOException {
      LOG.debug("TaskLog.Reader.read: logOffset: " + logOffset + " - logLength: " + logLength);

      // Sanity check
      if (logLength == 0) {
        return 0;
      }
      
      if (!initialized) {
        init();
      }
      
      // Locate the requisite splits 
      Vector<InputStream> streams = new Vector<InputStream>();
      long offset = logOffset;
      int startIndex = -1, stopIndex = -1;
      boolean inRange = false;
      for (int i=0; i < indexRecords.length; ++i) {
        LOG.debug("offset: " + offset + " - (split, splitOffset) : (" + 
            i + ", " + indexRecords[i].splitOffset + ")");
        
        if (offset <= indexRecords[i].splitOffset) {
          if (!inRange) {
            startIndex = i - ((i > 0) ? 1 : 0);
            LOG.debug("Starting at split: " + startIndex);
            offset += logLength;
            InputStream stream = getLogSplit(startIndex);
            if (stream != null) {
              streams.add(stream);
            }
            LOG.debug("Added split: " + startIndex);
            inRange = true;
          } else {
            stopIndex = i-1;
            LOG.debug("Stop at split: " + stopIndex);
            break;
          }
        }
        
        if (inRange) {
          InputStream stream = getLogSplit(i);
          if (stream != null) {
            streams.add(stream);
          }
          LOG.debug("Added split: " + i);
        }
      }
      if (startIndex == -1) {
        throw new IOException("Illegal logOffset/logLength");
      }
      if (stopIndex == -1) {
        stopIndex = indexRecords.length - 1;
        LOG.debug("Stop at split: " + stopIndex);
        
        // Check if request exceeds the log-file size
        if ((logOffset+logLength) > logFileSize) {
          LOG.debug("logOffset+logLength exceeds log-file size");
          logLength = logFileSize - logOffset;
        }
      }
      
      // Copy requisite data into user buffer
      SequenceInputStream in = new SequenceInputStream(streams.elements());
      if (streams.size() == (stopIndex - startIndex +1)) {
        // Skip to get to 'logOffset' if logs haven't been purged
        long skipBytes = 
          in.skip(logOffset - indexRecords[startIndex].splitOffset);
        LOG.debug("Skipped " + skipBytes + " bytes from " + 
            startIndex + " stream");
      }
      int bytesRead = 0, totalBytesRead = 0;
      len = Math.min((int)logLength, len);
      LOG.debug("Attempting to read " + len + " bytes from logs");
      while ((bytesRead = in.read(b, off, len)) > 0) {
        off += bytesRead;
        len -= bytesRead;
        
        totalBytesRead += bytesRead;
      }
      
      return totalBytesRead;
    }

    private synchronized InputStream getLogSplit(int split) 
    throws IOException {
      String splitName = indexRecords[split].splitName;
      LOG.debug("About to open the split: " + splitName);
      InputStream in = null;
      try {
        in = new BufferedInputStream(new FileInputStream(new File(splitName)));
      } catch (FileNotFoundException fnfe) {
        in = null;
        LOG.debug("Split " + splitName + " not found... probably purged!");
      }
      
      return in;
    }
  } // TaskLog.Reader
  
  /**
   * For testing the TaskLog Reader.
   * @param args
   * @throws IOException
   */
  public static void main(final String args[]) throws IOException {
      if (args.length != 1) {
          System.out.println("Usage: TaskLog.Reader TASK_LOG_DIR_URL");
          System.exit(1);
      }
      ArchiveTaskLog.Reader r = new ArchiveTaskLog.Reader(new URL(args[0]));
      InputStream is = r.getInputStream();
      final int buffersize = 4096;
      byte[] buffer = new byte[buffersize];
      for (int count = -1; (count = is.read(buffer, 0, buffersize)) != -1;) {
          System.out.print(new String(buffer, 0, count));
      }
  }
} // TaskLog
