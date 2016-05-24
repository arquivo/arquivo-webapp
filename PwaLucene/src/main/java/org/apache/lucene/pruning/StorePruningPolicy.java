package org.apache.lucene.pruning;
/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import java.util.logging.Logger;

import org.apache.lucene.document.Document;
import org.apache.lucene.document.FieldSelector;
import org.apache.lucene.document.FieldSelectorResult;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.*;



/**
 * This class implements rules for removing stored fields from documents.
 */
public class StorePruningPolicy extends PruningPolicy {
  private static final Logger LOG = Logger.getLogger(StorePruningPolicy.class.getName());
  protected Map<String, Integer> fieldFlags;
  protected Set<String> deleteAll;
  protected DelFieldSelector fs;
  protected IndexReader in;
  protected int delFields;
  
  /**
   * Constructs a policy.
   * @param in input reader.
   * @param fieldFlags a map where keys are field names, and flags are
   * bitwise-OR values of flags defined in {@link PruningPolicy}.
   */
  @SuppressWarnings("unchecked")
  public StorePruningPolicy(IndexReader in, Map<String, Integer> fieldFlags) {
    if (fieldFlags != null) {
      this.fieldFlags = fieldFlags;
      deleteAll = new HashSet<String>();
      for (Entry<String, Integer> e : fieldFlags.entrySet()) {
        if (e.getValue() == PruningPolicy.DEL_ALL) {
          deleteAll.add(e.getKey());
        }
      }
    } else {
      this.fieldFlags = Collections.EMPTY_MAP;
      deleteAll = Collections.EMPTY_SET;
    }
    fs = new DelFieldSelector(fieldFlags);
    this.in = in;
  }
  
  @SuppressWarnings("unchecked")
  public Collection getFieldNames(Collection allFields) {
    // for simplicity remove only fields with DEL_ALL
    if (!deleteAll.isEmpty()) {
      allFields.removeAll(deleteAll);
    }
    return allFields;    
  }
  
  /**
   * Prune stored fields of a document. Note that you can also arbitrarily
   * change values of the retrieved fields, so long as the field names belong
   * to a list of fields returned from {@link #getFieldNames(Collection)}.
   * @param doc document number
   * @param parent original field selector that limits what fields will be
   * retrieved.
   * @return a pruned instance of a Document.
   * @throws IOException
   */
  public Document pruneDocument(int doc, FieldSelector parent) throws IOException {
    if (fieldFlags.isEmpty()) {
      return in.document(doc, parent);
    } else {
      fs.setParent(parent);
      return in.document(doc, fs);
    }    
  }
  
  @SuppressWarnings("serial")
  class DelFieldSelector implements FieldSelector {    
    private FieldSelector parent;
    private Map<String, Integer> remove;
    
    public DelFieldSelector(Map<String, Integer> remove) {
      this.remove = remove;
    }
    
    public void setParent(FieldSelector parent) {
      this.parent = parent;
    }
    
    @Override
    public FieldSelectorResult accept(String fieldName) {
      if (!remove.isEmpty() && remove.containsKey(fieldName) &&
              ((remove.get(fieldName) & DEL_STORED) > 0)) {
        delFields++;
        if (delFields % 10000 == 0) {
          LOG.info(" - stored fields: removed " + delFields + " fields.");
        }
        return FieldSelectorResult.NO_LOAD;
      } else if (parent != null) {
        return parent.accept(fieldName);
      } else return FieldSelectorResult.LOAD;
    }
  };

}
