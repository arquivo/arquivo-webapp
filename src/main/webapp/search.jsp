<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<%@page import="java.net.URL"%>
<%@ page
  session="true"
  contentType="text/html; charset=UTF-8"
  pageEncoding="UTF-8"

  import="java.io.File"
  import="java.io.IOException"
  import= "java.net.*"
  import= "java.io.*"
  import="java.net.URLEncoder"
  import="java.text.DateFormat"
  import="java.util.Calendar"
  import="java.util.TimeZone"
  import="java.util.Date"
  import="java.util.regex.Matcher"
  import="java.util.regex.Pattern"
  import="java.util.GregorianCalendar"
  import="org.apache.commons.lang.StringEscapeUtils"
  import="java.util.Properties"
%>
<% // Set the character encoding to use when interpreting request values.
  request.setCharacterEncoding("UTF-8");
%>
<%
response.setHeader("Cache-Control","public, max-age=600");
%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ include file="/include/logging_params.jsp" %>
<%@ include file="/include/i18n.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%!
  private static final String COLLECTION_KEY = "collection";
  private static final String COLLECTION_QUERY_PARAM_KEY = COLLECTION_KEY + ":";
  private static final Pattern URL_PATTERN = Pattern.compile("^.*? ?((https?:\\/\\/)?([a-zA-Z\\d][-\\w\\.]+)\\.([a-zA-Z\\.]{2,6})([-\\/\\w\\p{L}\\.~,;:%&=?+$#*\\(?\\)?]*)*\\/?) ?.*$");
%>

<%-- Get the application beans --%>
<%
  // configurations
  String waybackURL = pt.arquivo.webapp.Configuration.get("wayback.url", "examples.com");
  pageContext.setAttribute("waybackURL", waybackURL);
%>
<%-- Handle the url parameters --%>
<%
  // get query from request

  String queryString = request.getParameter("query");
String[] queryString_splitted=null;


  if ( queryString != null ) {
        queryString = queryString.trim();


  } else {
        // Check if the 'query' params exists
        // else check if the advanced params exist and process them
        queryString = "";
        if ( request.getParameter("adv_and") != null && request.getParameter("adv_and") != "") {
                queryString += request.getParameter("adv_and");
                queryString += " ";
        }
        if ( request.getParameter("adv_phr") != null && request.getParameter("adv_phr") != "") {
                queryString += "\""+ request.getParameter("adv_phr").replaceAll("\"", "") +"\"";
                queryString += " ";
        }
        if ( request.getParameter("adv_not") != null && request.getParameter("adv_not") != "") {
                String notStr = request.getParameter("adv_not");
                if (!notStr.startsWith("-"))
                        notStr = "-" + notStr;
                notStr = notStr.replaceAll("[ ]+", " -") +" ";
                queryString += notStr;
        }
        if ( request.getParameter("adv_mime") != null && request.getParameter("adv_mime") != "" ) {
                queryString += "filetype:"+ request.getParameter("adv_mime");
                queryString += " ";
        }
        if (request.getParameter("site") != null && request.getParameter("site") != "") {
                queryString += "site:";
                String siteParameter = request.getParameter("site"); //here split hostname and put it to lowercase

                if (siteParameter.startsWith("http://")) {
                        URL siteURL = new URL(siteParameter);
                        String siteHost = siteURL.getHost();
                        siteParameter = siteParameter.replace(siteHost, siteHost.toLowerCase()); // hostname to lowercase
                        queryString += siteParameter.substring("http://".length());
                } else if (siteParameter.startsWith("https://")) {
                        URL siteURL = new URL(siteParameter);
                        String siteHost = siteURL.getHost();
                        siteParameter = siteParameter.replace(siteHost, siteHost.toLowerCase()); // hostname to lowercase
                        queryString += siteParameter.substring("https://".length());
                } else {
                        URL siteURL = new URL("http://"+siteParameter);
                        String siteHost = siteURL.getHost();
                        siteParameter = siteParameter.replace(siteHost, siteHost.toLowerCase()); // hostname to lowercase
                        queryString += siteParameter;
                }
                /*queryStringParameter = queryString.length();
                if (siteParameter.startsWith("http://") && siteParameter.startsWith("https://")) {
                  queryString +=NutchwaxQuery.encodeExacturl("exacturlexpand:"+siteParameter);
                } else {
                   queryString +=NutchwaxQuery.encodeExacturl("exacturlexpand:http://"+siteParameter);
                       // queryString += "exacturlexpand:http://"+siteParameter;
                }
                String aux = request.getParameter("site");
                pt.arquivo.webapp.LOG.debug("\nQueryString : "+ queryString+"\n*****************************\n");
                String aux_ ="exacturlexpand:http://"+aux;
                aux = NutchwaxQuery.encodeExacturl(aux_);*/

                pt.arquivo.webapp.LOG.debug("\nQueryString exactExpand URL: "+ siteParameter+"\n*****************************\n");
                queryString += " ";
        }
        if (request.getParameter("format") != null && request.getParameter("format") != "" && !request.getParameter("format").equals("all")) {
                queryString += "type:" + request.getParameter("format");
                queryString += " ";
        }
  }

  /*****************    'hitsPerDup' param      ***************************/
  int hitsPerDup = 2;
  String hitsPerDupString = request.getParameter("hitsPerDup");
  if (hitsPerDupString != null && hitsPerDupString.length() > 0) {
    hitsPerDup = Integer.parseInt(hitsPerDupString);
  } else {
    // If 'hitsPerSite' present, use that value.
    String hitsPerSiteString = request.getParameter("hitsPerSite");
    if (hitsPerSiteString != null && hitsPerSiteString.length() > 0) {
      hitsPerDup = Integer.parseInt(hitsPerSiteString);
    }
  }

  /*****************    'sort' param    ***************************/
  String sort = null;
  boolean reverse = false;


  if (!queryString.contains("sort:")) {
        sort = request.getParameter("sort");

        if ("relevance".equals(sort)) {
                sort = null;
        } else if ("new".equals(sort)) {
                sort = "date";
                reverse = true;
                queryString += "sort:new";
                hitsPerDup = 0;
        } else if ("old".equals(sort)) {
                sort = "date";
                queryString += "sort:old";
                hitsPerDup = 0;
        } else {
                sort = null;
        }
  } else if (queryString.contains("sort:new")) {
        sort = "date";
        reverse = true;
        hitsPerDup = 0;
  } else if (queryString.contains("sort:old")) {
        sort = "date";
        hitsPerDup = 0;
  }

  // De-Duplicate handling.  Look for duplicates field and for how many
  // duplicates per results to return. Default duplicates field is 'site'
  // and duplicates per results default is '1' (Used to be '2' but now
  // '1' so can have an index with dups not show dups when used doing
  // straight searches).
  String dedupField = request.getParameter("dedupField");
  if (dedupField == null || dedupField.length() == 0) {
    dedupField = "site";
  }

  int hitsPerVersion = 1;
  String hitsPerVersionString = request.getParameter("hitsPerVersion");
  if (hitsPerVersionString != null && hitsPerVersionString.length() > 0) {
        hitsPerVersion = Integer.parseInt(hitsPerVersionString);
  }

  if (queryString.contains("site:")) {
        hitsPerDup = 0;

        queryString = queryString.replaceAll("site:http://", "site:");
        queryString = queryString.replaceAll("site:https://", "site:");
  }

  /***************** Save the query string for further use ***********/
  request.setAttribute("query", queryString.trim());

  /***************** Clean the query for Backend search *************/
  if (queryString.contains("sort:new")) {
        queryString = queryString.replace("sort:new","");
  } else if (queryString.contains("sort:old")) {
        queryString = queryString.replace("sort:old","");
  }

  /*****************    Offset param    ***************************/
  int start = 0;          // first hit to display
  String startString = request.getParameter("start");
  if (startString != null)
    start = Integer.parseInt(startString);

  /*****************    Hits/page param ***************************/
  int hitsPerPage = 10;          // number of hits to display
  String hitsString = request.getParameter("hitsPerPage");
  if (hitsString != null) {
        try {
                hitsPerPage = Integer.parseInt(hitsString);
        } catch (NumberFormatException e) {
                pt.arquivo.webapp.LOG.debug("WRONG VALUE of hitsPerPage:"+ hitsString +"|");
        }
  }

  // If a 'collection' parameter present, always add to query.
  String collection = request.getParameter(COLLECTION_KEY);
  if (collection != null && queryString != null && queryString.length() > 0) {
      int collectionIndex = queryString.indexOf(COLLECTION_QUERY_PARAM_KEY);
      if (collectionIndex < 0) {
        queryString = queryString + " " + COLLECTION_QUERY_PARAM_KEY +
            collection;
      }
  }

  // Prepare the query values to be presented on the page, preserving the session
  String htmlQueryString = "";

  if ( request.getAttribute("query") != null ) {
        htmlQueryString = request.getAttribute("query").toString();
        request.setAttribute("htmlQueryString", htmlQueryString);
  }

  // Make up query string for use later drawing the 'rss' logo.
  String params = "&hitsPerPage=" + hitsPerPage +
    (sort == null ? "" : "&sort=" + sort + (reverse? "&reverse=true": "") +
    (dedupField == null ? "" : "&dedupField=" + dedupField));

%>

<%---------------------- Start of HTML ---------------------------%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
  <title><fmt:message key='home.meta.title'/></title>
  <meta name="Keywords" content="<fmt:message key='home.meta.keywords'/>" />
  <meta name="Description" content="<fmt:message key='home.meta.description'/>" />
  <meta property="og:title" content="<fmt:message key='home.meta.title'/>"/>
  <meta property="og:description" content="<fmt:message key='home.meta.description'/>"/>
  <meta property="og:image" content="<%=request.getContextPath()%>/img/logoFace.png"/>

  <jsp:include page="/include/headerDefault.jsp" />
  <%@ include file="/include/dates.jsp" %>
  <jsp:include page="/include/i18njs.jsp" />

  <script type="text/javascript">
    <% if (pt.arquivo.webapp.Configuration.get("query.suggestion.api").isPresent()) { %>
      querySuggestionAPI = '<%= pt.arquivo.webapp.Configuration.get("query.suggestion.api", request.getContextPath()+"/spellchecker/checker") %>';
    <% } %>
    textSearchAPI = "<%= pt.arquivo.webapp.Configuration.get("text.search.api", "https://arquivo.pt/textsearch") %>";

    notFoundTitle = '<fmt:message key="search.no-results.title"/>';
    noResultsSuggestions = '<fmt:message key="search.no-results.suggestions"/>';
    noResultsWellWritten = '<fmt:message key="search.no-results.suggestions.well-written"/>';
    noResultsInterval = '<fmt:message key="search.no-results.suggestions.time-interval"/>';
    noResultsKeywords = '<fmt:message key="search.no-results.suggestions.keywords"/>';
    noResultsGenericWords = '<fmt:message key="search.no-results.suggestions.generic-words"/>';

    start = <%=start%>;
    hitsPerPage = <%=hitsPerPage%>;
    dateStartYear = <%=dateStartYear%>;
    waybackURL = "<%=waybackURL%>";
  </script>

</head>

<body id="home-search">
  <%@ include file="/include/topbar.jsp" %>
  <div class="container-fluid topcontainer" id="headerSearchDiv">
    <script type="text/javascript">
      var language = localStorage.language;
      pagesHref = window.location.href;
      var urlWithoutType = removeParam( 'typeShow', window.location.href );
      imagesHref =  urlWithoutType.toString().replace("search.jsp", "images.jsp");  /*TODO remove from this href parameters that are only appliable to text search*/
      function removeParam(key, sourceURL) {
          var rtn = sourceURL.split("?")[0],
              param,
              params_arr = [],
              queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
          if (queryString !== "") {
              params_arr = queryString.split("&");
              for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                  param = params_arr[i].split("=")[0];
                  if (param === key) {
                      params_arr.splice(i, 1);
                  }
              }
              rtn = rtn + "?" + params_arr.join("&");
          }
          return rtn;
      }
    </script>
    <script type="text/javascript" src="/js/encodeHTML.js"></script>
    
    <%
      String formAction = "/search.jsp";
      String advancedSearchAction = "/advanced.jsp";
    %>
    <%@ include file="/include/searchForm.jsp" %>

    <script type="text/javascript">
      $( document ).ready(function() {
        $("#txtSearch").on('mousedown touchstart', function (e) {
          e.stopPropagation();
        });
      });
    </script>
    <script type="text/javascript">$('#pagesTab').addClass('selected');$('#pagesTab').addClass('primary-underline');</script>
    <script type="text/javascript" src="/js/searchHeaderMobile.js"></script><!-- In progress
  -->




        <%----------------------------------------------------------
        // Check to see which of the 3 mode is presented:
        // (1) result list
        // (2) wayback document's grid
        // (3) result list with tip
        ----------------------------------------------------------%>
        <%
        Matcher urlMatch = null;
        String urlQuery = null;
        boolean showList = false;
        String showTip = null;                  // tip to show
        String allVersions = null;
        int end = -1;
        int hitsLength = 0;
        long hitsTotal = 0;
        boolean hitsTotalIsExact = false;
        String queryExactExpand=null;
        String typeShowParam="";

        typeShowParam = request.getParameter("typeShow");

        if ( request.getAttribute("query") != null && !request.getAttribute("query").toString().equals("") ) {

          if ( (urlMatch = URL_PATTERN.matcher( request.getAttribute("query").toString() )).matches() ) {

            urlQuery = urlMatch.group(1);
            String urlQueryParam = urlQuery;
            int urlLength = urlQuery.length();

            if (!urlQuery.startsWith("http://") && !urlQuery.startsWith("https://") ) {
                    urlQueryParam = "http://" + urlQueryParam;
            }
            pageContext.setAttribute("urlQueryParam", urlQueryParam);

            allVersions = "search.jsp?query="+ URLEncoder.encode(urlQueryParam, "UTF-8");
            if (!language.equals("pt")) {
                    allVersions += "&l="+ language;
            }
                /*
            hostname is not case sensitive, thereby it has to be written with lower case
            the bellow provide a solution to this problem
            arquivo.PT will be equal to arquivo.pt
            Converts hostname to small letters
            */

            URL url_queryString=new URL(urlQueryParam);
            String path=url_queryString.getPath();
            String hostname=url_queryString.getHost().toLowerCase();

            String protocol=url_queryString.getProtocol();
            String fileofUrl = url_queryString.getFile();

            if ( request.getParameter("query") != null && 
                 urlLength == request.getParameter("query").trim().length() && 
                 pt.arquivo.webapp.TopLevelDomainUtil.hostnameEndsWithValidTld(hostname)) {

              // option: (2)
              showList = false;
              usedWayback = true;

              urlQueryParam= protocol+"://"+hostname+fileofUrl;

              queryString=urlQueryParam; //Querying wayback servlet
              urlQuery=urlQueryParam; //Querying pyWB
              request.setAttribute("urlQuery", urlQuery);

              pageContext.setAttribute("urlQueryParam", urlQueryParam);
              allVersions = "search.jsp?query="+ URLEncoder.encode(urlQueryParam, "UTF-8");
              //pageContext.setAttribute("dateStartWayback", FORMAT.format( dateStart.getTime() ) );
              //pageContext.setAttribute("dateEndWayback", FORMAT.format( dateEnd.getTime() ) );
            }
%>

            <input type="hidden" id="typeShow" value="<%=typeShowParam%>" />
            <%-- #search_stats & #result_list for this case are generated by WB --%>
            <%
                    boolean seeHistory = false;             // This variable is used to indicate that link to see the history was clicked
                    if( request.getParameter("pos") != null) {
                            seeHistory = true;
                    }
                    pageContext.setAttribute("seeHistory", seeHistory);
            %>

<%
          }
        }
%>

<% if (usedWayback) { %>
  <script>
    // add event listener thar receive messages from url search iframe.
    if (window.addEventListener) {
        window.addEventListener("message", onMessage, false);        
    } 
    else if (window.attachEvent) {
        window.attachEvent("onmessage", onMessage, false);
    }
    // generic function that receive multiple messages from url search iframe and calls different king on functions.
    function onMessage(event) {
        // Check sender origin to be trusted
        if (!event.isTrusted) return;

        var data = event.data;
        if (typeof(window[data.func]) == "function") {
            window[data.func].call(null, data.message);
        }
    }
    // called from url search iframe when the user clicks a specific version
    // the message is the url clicked
    function urlSearchClickOnVersion(message) {
      // send event to google analytics
      ga('send', 'event', 'Versions List', 'Version Click', message);
      //  go to the url clicked by the user on iframe
      window.location = message;
    }
    // get the height of the iframe content
    function getDocHeight(doc) {
        doc = doc || document;
        // stackoverflow.com/questions/1145850/
        var body = doc.body, html = doc.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight, 
            html.clientHeight, html.scrollHeight, html.offsetHeight );
        return height;
    }
    // resize the url search iframe so the iframe has the same size of its content then isn't the need of a scroll.
    // it is like the iframe doesn't exist.
    function resizeIframe() {
      const id = "url_search_iframe";
        var ifrm = document.getElementById(id);
        var doc = ifrm.contentDocument? ifrm.contentDocument: 
            ifrm.contentWindow.document;
        ifrm.style.visibility = 'hidden';
        //ifrm.style.height = "10px"; // reset to minimal height ...
        // IE opt. for bing/msn needs a bit added or scrollbar appears
        ifrm.style.height = getDocHeight( doc ) + 4 + "px";
        ifrm.style.visibility = 'visible';
    }
  </script>
  <div class="url-search-iframe-container">
    <iframe
      name="url_search_iframe" 
      id="url_search_iframe"
      allowFullScreen="true"
      scrolling="no"
      onload="resizeIframe(this)"
      src="<%=request.getContextPath()%>/url/search/<%=dateStartYear%><%=dateStartMonth%><%=dateStartDay%>-<%=dateEndYear%><%=dateEndMonth%><%=dateEndDay%>/<%=urlQuery%>"></iframe>
  </div>

<% } else {
  if (  (request.getParameter("query") == null || request.getParameter("query").equals("")) &&
        (request.getParameter("adv_and") == null || request.getParameter("adv_and").equals("")) &&
        (request.getParameter("adv_phr") == null || request.getParameter("adv_phr").equals("")) &&
        (request.getParameter("adv_not") == null || request.getParameter("adv_not").equals("")) &&
        (request.getParameter("format") == null || request.getParameter("format").equals("") ) &&
        (request.getParameter("site") == null || request.getParameter("site").equals("")) ){
  %>
    <%@ include file="/include/intro.jsp" %>
    
  <% } else { %>
    <div id="loadingDiv" class="loader"><div></div></div>

    <script type="text/javascript" src="/js/page-search.js?build=<c:out value='${initParam.buildTimeStamp}' />"></script>

    <div id="conteudo-resultado" class="container-fluid col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4">
      <p id="estimated-results" style="display: none;"><fmt:message key="search.results.estimated.results.1"/> <span id="estimated-results-value"></span> <fmt:message key="search.results.estimated.results.2"/> <%= dateStartYear %></p>

      <div class="spell hidden"><fmt:message key="search.spellchecker"/> <span class="suggestion"></span></div>

      <%-- Show search tip if the showTip option is active --%>
      <% if (showTip != null) { %>
        <div id="resultados-url">
            <%-- TODO: change this URL --%>
            <fmt:message key='search.suggestion'><fmt:param value='<%=allVersions%>'/><fmt:param value='<%=showTip%>'/></fmt:message>
        </div>
      <% } %>

      <div id="resultados-lista">
        <ul>
        </ul>
      </div>

      <div class="pagesNextPrevious text-center">
        <ul>
          <%
            if (start > 0) {
              int previousPageStart = start - hitsPerPage;
              String previousPageUrl = "search.jsp?" +
                "query=" + URLEncoder.encode(request.getAttribute("query").toString(), "UTF-8") +
                "&dateStart="+ dateStartString +
                "&dateEnd="+ dateEndString +
                "&pag=prev" +                             // mark as 'previous page' link
                "&start=" + previousPageStart +
                "&hitsPerPage=" + hitsPerPage +
                "&hitsPerDup=" + hitsPerDup +
                "&dedupField=" + dedupField +
                "&l="+ language;
              if (sort != null) {
                previousPageUrl = previousPageUrl +
                "&sort=" + sort +
                "&reverse=" + reverse;
              }
              previousPageUrl = StringEscapeUtils.escapeHtml(previousPageUrl);
          %>
            <li class="previous"><a id="previousPageSearch" style="display: none;" onclick="ga('send', 'event', 'Full-text search', 'Previous page', document.location.href );" class="myButtonStyle text-center right10" role="button" href="<%=previousPageUrl%>" title="<fmt:message key='search.pager.previous'/>">&larr; <fmt:message key='search.pager.previous'/></a></li>
          <% } %>
        <%
            long nextPageStart = start + hitsPerPage;
            String nextPageUrl = "search.jsp?" +
              "query=" + URLEncoder.encode(request.getAttribute("query").toString(), "UTF-8") +
              "&dateStart="+ dateStartString +
              "&dateEnd="+ dateEndString +
              "&pag=next" +
              "&start=" + nextPageStart +
              "&hitsPerPage=" + hitsPerPage +
              "&hitsPerDup=" + hitsPerDup +
              "&dedupField=" + dedupField +
              "&l="+ language;
            if (sort != null) {
              nextPageUrl = nextPageUrl +
              "&sort=" + sort +
              "&reverse=" + reverse;
            }
            nextPageUrl = StringEscapeUtils.escapeHtml(nextPageUrl);
        %>
            <li class="next"><a id="nextPageSearch" style="display: none;" onclick="ga('send', 'event', 'Full-text search', 'Next page', document.location.href );" class="myButtonStyle text-center" role="button" href="<%=nextPageUrl%>" title="<fmt:message key='search.pager.next'/>"><fmt:message key='search.pager.next'/> &rarr;</a></li>
        </ul>
      </div>
    </div>
  <% } %>
<% } %>

<%@include file="/include/analytics.jsp" %>
<%@include file="/include/footer.jsp" %>
</body>
</html>

<%@include file="/include/logging.jsp" %>
