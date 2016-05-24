/* LocalResourceIndex
 *
 * $Id: LocalResourceIndex.java 2232 2008-04-11 04:07:18Z bradtofel $
 *
 * Created on 5:02:21 PM Aug 17, 2006.
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
package org.archive.wayback.resourceindex;

import java.io.IOException;
import java.util.Iterator;

import org.apache.commons.httpclient.URIException;
import org.archive.net.UURI;
import org.archive.net.UURIFactory;
import org.archive.wayback.ResourceIndex;
import org.archive.wayback.UrlCanonicalizer;
import org.archive.wayback.WaybackConstants;
import org.archive.wayback.resourceindex.filters.CaptureToUrlResultFilter;
import org.archive.wayback.resourceindex.filters.CounterFilter;
import org.archive.wayback.resourceindex.filters.DateRangeFilter;
import org.archive.wayback.resourceindex.filters.DuplicateRecordFilter;
import org.archive.wayback.resourceindex.filters.EndDateFilter;
import org.archive.wayback.resourceindex.filters.GuardRailFilter;
import org.archive.wayback.resourceindex.filters.HostMatchFilter;
import org.archive.wayback.resourceindex.filters.SelfRedirectFilter;
import org.archive.wayback.resourceindex.filters.UrlMatchFilter;
import org.archive.wayback.resourceindex.filters.UrlPrefixMatchFilter;
import org.archive.wayback.resourceindex.filters.WindowEndFilter;
import org.archive.wayback.resourceindex.filters.WindowStartFilter;
import org.archive.wayback.core.CaptureSearchResults;
import org.archive.wayback.core.SearchResult;
import org.archive.wayback.core.SearchResults;
import org.archive.wayback.core.Timestamp;
import org.archive.wayback.core.UrlSearchResults;
import org.archive.wayback.core.WaybackRequest;
import org.archive.wayback.exception.AccessControlException;
import org.archive.wayback.exception.BadQueryException;
import org.archive.wayback.exception.ResourceIndexNotAvailableException;
import org.archive.wayback.exception.ResourceNotInArchiveException;
import org.archive.wayback.util.AdaptedIterator;
import org.archive.wayback.util.CloseableIterator;
import org.archive.wayback.util.ObjectFilter;
import org.archive.wayback.util.ObjectFilterChain;
import org.archive.wayback.util.url.AggressiveUrlCanonicalizer;

/**
 * 
 * 
 * @author brad
 * @version $Date: 2008-04-11 05:07:18 +0100 (Sex, 11 Abr 2008) $, $Revision: 2232 $
 */
public class LocalResourceIndex implements ResourceIndex {

	/**
	 * maximum number of records to return
	 */		
	private int maxRecords = NutchResourceIndex.MAX_RECORDS;

	protected SearchResultSource source;
	
	private UrlCanonicalizer canonicalizer = null;
	
	private boolean dedupeRecords = false;

	public LocalResourceIndex() {
		canonicalizer = new AggressiveUrlCanonicalizer();
	}
	
	private void filterRecords(Iterator<SearchResult> itr,
			ObjectFilter<SearchResult> filter, SearchResults results,
			boolean forwards) throws IOException {

		if(dedupeRecords) {
			itr = new AdaptedIterator<SearchResult, SearchResult>(itr,
					new DeduplicationSearchResultAnnotationAdapter());
		}
		while (itr.hasNext()) {
			SearchResult result = itr.next();
			int ruling = filter.filterObject(result);
			if (ruling == ObjectFilter.FILTER_ABORT) {
				break;
			} else if (ruling == ObjectFilter.FILTER_INCLUDE) {
				results.addSearchResult(result, forwards);
			}
		}
		if(itr instanceof CloseableIterator) {
			CloseableIterator<SearchResult> citr =
				(CloseableIterator<SearchResult>) itr;
			source.cleanup(citr);
		}
	}

	private String getRequired(WaybackRequest wbRequest, String field,
			String defaultValue) throws BadQueryException {

		String value = wbRequest.get(field);
		if (value == null) {
			if (defaultValue == null) {
				throw new BadQueryException("No " + field + " specified");
			} else {
				value = defaultValue;
			}
		}
		return value;
	}

	private String getRequired(WaybackRequest wbRequest, String field)
			throws BadQueryException {
		return getRequired(wbRequest, field, null);
	}

	private HostMatchFilter getExactHostFilter(WaybackRequest wbRequest) { 

		HostMatchFilter filter = null;
		String exactHostFlag = wbRequest.get(
				WaybackConstants.REQUEST_EXACT_HOST_ONLY);
		if(exactHostFlag != null && 
				exactHostFlag.equals(WaybackConstants.REQUEST_YES)) {

			String searchUrl = wbRequest.get(WaybackConstants.REQUEST_URL);
			try {

				UURI searchURI = UURIFactory.getInstance(searchUrl);
				String exactHost = searchURI.getHost();
				filter = new HostMatchFilter(exactHost);

			} catch (URIException e) {
				// Really, this isn't gonna happen, we've already canonicalized
				// it... should really optimize and do that just once.
				e.printStackTrace();
			}
		}
		return filter;
	}
	/*
	 * (non-Javadoc)
	 * 
	 * @see org.archive.wayback.ResourceIndex#query(org.archive.wayback.core.WaybackRequest)
	 */
	public SearchResults query(WaybackRequest wbRequest)
			throws ResourceIndexNotAvailableException,
			ResourceNotInArchiveException, BadQueryException,
			AccessControlException {

		SearchResults results = null; // return value placeholder

		String startKey; // actual key where search will begin
		String keyUrl; // "purified" URL request
		int startResult; // calculated based on hits/page * pagenum

		// first grab all the info from the WaybackRequest, and validate it:

		int resultsPerPage = wbRequest.getResultsPerPage();
		int pageNum = wbRequest.getPageNum();
		startResult = (pageNum - 1) * resultsPerPage;

		if (resultsPerPage < 1) {
			throw new BadQueryException("resultsPerPage cannot be < 1");
		}
		if (resultsPerPage > maxRecords) {
			throw new BadQueryException("resultsPerPage cannot be > "
					+ maxRecords);
		}
		if (pageNum < 1) {
			throw new BadQueryException("pageNum must be > 0");
		}

		String searchUrl = getRequired(wbRequest, WaybackConstants.REQUEST_URL);
		String searchType = getRequired(wbRequest,
				WaybackConstants.REQUEST_TYPE);
		String startDate = getRequired(wbRequest,
				WaybackConstants.REQUEST_START_DATE, Timestamp
						.earliestTimestamp().getDateStr());
		String endDate = getRequired(wbRequest,
				WaybackConstants.REQUEST_END_DATE, Timestamp.latestTimestamp()
						.getDateStr());
		String exactDate = getRequired(wbRequest,
				WaybackConstants.REQUEST_EXACT_DATE, Timestamp
						.latestTimestamp().getDateStr());

		try {
			keyUrl = canonicalizer.urlStringToKey(searchUrl);
		} catch (URIException e) {
			throw new BadQueryException("invalid "
					+ WaybackConstants.REQUEST_URL + " " + searchUrl);
		}

		// set up the common Filters:

		// makes sure we don't inspect too many records: prevents DOS
		GuardRailFilter guardrail = new GuardRailFilter(maxRecords);

		// checks an exclusion service for every matching record
		ObjectFilter<SearchResult> exclusion = wbRequest.getExclusionFilter();

		// count how many results got to the ExclusionFilter:
		CounterFilter preExCounter = new CounterFilter();
		// count how many results got past the ExclusionFilter, or how
		// many total matched, if there was no ExclusionFilter:
		CounterFilter finalCounter = new CounterFilter();
		
		// has the user asked for only results on the exact host specified?
		HostMatchFilter hostMatchFilter = getExactHostFilter(wbRequest);

		if (searchType.equals(WaybackConstants.REQUEST_REPLAY_QUERY)
				|| searchType.equals(WaybackConstants.REQUEST_CLOSEST_QUERY)) {

			results = new CaptureSearchResults();

			ObjectFilterChain<SearchResult> forwardFilters = 
				new ObjectFilterChain<SearchResult>();

//			ObjectFilterChain<SearchResult> reverseFilters = 
//				new ObjectFilterChain<SearchResult>();

			// use the same guardrail for both:
			forwardFilters.addFilter(guardrail);
//			reverseFilters.addFilter(guardrail);
			
			forwardFilters.addFilter(new DuplicateRecordFilter());
			
			// match URL key:
			forwardFilters.addFilter(new UrlMatchFilter(keyUrl));
//			reverseFilters.addFilter(new UrlMatchFilter(keyUrl));

			if(hostMatchFilter != null) {
				forwardFilters.addFilter(hostMatchFilter);
//				reverseFilters.addFilter(hostMatchFilter);
			}
			
			// be sure to only include records within the date range we want:
			// The bin search may start the forward filters at a record older
			// than we want. Since the fowardFilters only include an abort
			// endDateFilter, we might otherwise include a record before the 
			// requested range.
			DateRangeFilter drFilter = new DateRangeFilter(startDate,endDate);
			forwardFilters.addFilter(drFilter);
//			reverseFilters.addFilter(drFilter);
			
			// abort processing if we hit a date outside the search range:
			forwardFilters.addFilter(new EndDateFilter(endDate));
//			reverseFilters.addFilter(new StartDateFilter(startDate));

			// for replay, do not include records that redirect to
			// themselves.. We'll leave this for both closest and replays,
			// because the only application of closest at the moment is 
			// timeline in which case, we don't want to show captures that
			// redirect to themselves in the timeline if they are not viewable.
			SelfRedirectFilter selfRedirectFilter = new SelfRedirectFilter();
			selfRedirectFilter.setCanonicalizer(canonicalizer);
			forwardFilters.addFilter(selfRedirectFilter);
//			reverseFilters.addFilter(selfRedirectFilter);
			
			// possibly filter via exclusions:
			if(exclusion != null) {
				forwardFilters.addFilter(preExCounter);
				forwardFilters.addFilter(exclusion);

//				reverseFilters.addFilter(preExCounter);
//				reverseFilters.addFilter(exclusion);
			}
			forwardFilters.addFilter(finalCounter);
//			reverseFilters.addFilter(finalCounter);

			forwardFilters.addFilter(new WindowEndFilter(resultsPerPage));
//			int resultsPerDirection = (int) Math.floor(resultsPerPage / 2);
//			reverseFilters.addFilter(new WindowEndFilter(resultsPerDirection));

			startKey = keyUrl;

			try {
//				CloseableIterator<SearchResult> reverse =
//					new AdaptedObjectFilterIterator<SearchResult>(
//					source.getPrefixReverseIterator(startKey),
//					reverseFilters);

//				// reverse the reverseResults:
//				ArrayList<SearchResult> reverseResults = 
//					new ArrayList<SearchResult>();
//				while(reverse.hasNext()) {
//					reverseResults.add(0, reverse.next());
//				}
				
				// now make a composite of the reverse and forwards:
				
				CloseableIterator<SearchResult> forward =
					source.getPrefixIterator(startKey);
//				
//				CompositeIterator<SearchResult> resultsItr =
//					new CompositeIterator<SearchResult>();
//				resultsItr.addComponent(reverseResults.iterator());
//				resultsItr.addComponent(forward);
				
				// and filter:
//				filterRecords(resultsItr, forwardFilters, results, true);
				filterRecords(forward, forwardFilters, results, true);

			} catch (IOException e) {
				throw new ResourceIndexNotAvailableException(
						e.getLocalizedMessage());
			}

		} else if (searchType.equals(WaybackConstants.REQUEST_URL_QUERY)) {

			results = new CaptureSearchResults(); 
			// build up the FilterChain(s):
			ObjectFilterChain<SearchResult> filters = 
				new ObjectFilterChain<SearchResult>();
			filters.addFilter(guardrail);
			filters.addFilter(new DuplicateRecordFilter());

			filters.addFilter(new UrlMatchFilter(keyUrl));
			if(hostMatchFilter != null) {
				filters.addFilter(hostMatchFilter);
			}
			filters.addFilter(new EndDateFilter(endDate));
			// possibly filter via exclusions:
			if (exclusion != null) {
				filters.addFilter(preExCounter);
				filters.addFilter(exclusion);
			}
			filters.addFilter(finalCounter);
			// OPTIMIZ: beginning the search at the startDate causes problems 
			// with deduplicated results. We need to be smarter about rolling
			// backwards a ways if we start on a deduped record.
//			startKey = keyUrl + " " + startDate;
			startKey = keyUrl + " ";

			// add the start and end windowing filters:
			filters.addFilter(new WindowStartFilter(startResult));
			filters.addFilter(new WindowEndFilter(resultsPerPage));
			try {
				filterRecords(source.getPrefixIterator(startKey), filters, results,
						true);
			} catch (IOException e) {
				throw new ResourceIndexNotAvailableException(
						e.getLocalizedMessage());
			}
			

		} else if (searchType.equals(WaybackConstants.REQUEST_URL_PREFIX_QUERY)) {

			results = new UrlSearchResults(); 
			// build up the FilterChain(s):
			ObjectFilterChain<SearchResult> filters = 
				new ObjectFilterChain<SearchResult>();
			filters.addFilter(guardrail);
			filters.addFilter(new DuplicateRecordFilter());

			filters.addFilter(new UrlPrefixMatchFilter(keyUrl));
			if(hostMatchFilter != null) {
				filters.addFilter(hostMatchFilter);
			}
			filters.addFilter(new DateRangeFilter(startDate, endDate));
			// possibly filter via exclusions:
			if (exclusion != null) {
				filters.addFilter(preExCounter);
				filters.addFilter(exclusion);
			}
			filters.addFilter(new CaptureToUrlResultFilter());
			filters.addFilter(finalCounter);
			startKey = keyUrl;

			// add the start and end windowing filters:
			filters.addFilter(new WindowStartFilter(startResult));
			filters.addFilter(new WindowEndFilter(resultsPerPage));
			try {
				filterRecords(source.getPrefixIterator(startKey), filters, results,
						true);
			} catch (IOException e) {
				throw new ResourceIndexNotAvailableException(
						e.getLocalizedMessage());
			}

		} else {
			throw new BadQueryException("Unknown query type(" + searchType
					+ "), must be " + WaybackConstants.REQUEST_REPLAY_QUERY
					+ ", " + WaybackConstants.REQUEST_CLOSEST_QUERY + ", "
					+ WaybackConstants.REQUEST_URL_QUERY + ", or "
					+ WaybackConstants.REQUEST_URL_PREFIX_QUERY);
		}

		int matched = finalCounter.getNumMatched();
		if (matched == 0) {
			if (exclusion != null) {
				if(preExCounter.getNumMatched() > 0) {
					throw new AccessControlException("All results Excluded");
				}
			}
			throw new ResourceNotInArchiveException("the URL " + keyUrl
					+ " is not in the archive.");
		}

		// now we need to set some filter properties on the results:
		results.putFilter(WaybackConstants.REQUEST_URL, keyUrl);
		results.putFilter(WaybackConstants.REQUEST_TYPE, searchType);
		results.putFilter(WaybackConstants.REQUEST_START_DATE, startDate);
		results.putFilter(WaybackConstants.REQUEST_EXACT_DATE, exactDate);
		results.putFilter(WaybackConstants.REQUEST_END_DATE, endDate);

		// window info
		results.putFilter(WaybackConstants.RESULTS_FIRST_RETURNED, String
				.valueOf(startResult));
		results.putFilter(WaybackConstants.RESULTS_REQUESTED, String
				.valueOf(resultsPerPage));

		// how many are actually in the results:
		results.putFilter(WaybackConstants.RESULTS_NUM_RESULTS, String
				.valueOf(matched));

		// how many matched (includes those outside window)
		results.putFilter(WaybackConstants.RESULTS_NUM_RETURNED, String
				.valueOf(results.getResultCount()));

		return results;
	}

	/**
	 * @param maxRecords the maxRecords to set
	 */
	public void setMaxRecords(int maxRecords) {
		this.maxRecords = maxRecords;
	}

	/**
	 * @param source the source to set
	 */
	public void setSource(SearchResultSource source) {
		this.source = source;
	}

	public boolean isDedupeRecords() {
		return dedupeRecords;
	}

	public void setDedupeRecords(boolean dedupeRecords) {
		this.dedupeRecords = dedupeRecords;
	}

	public UrlCanonicalizer getCanonicalizer() {
		return canonicalizer;
	}

	public void setCanonicalizer(UrlCanonicalizer canonicalizer) {
		this.canonicalizer = canonicalizer;
	}

	public void shutdown() throws IOException {
		source.shutdown();
	}
}
