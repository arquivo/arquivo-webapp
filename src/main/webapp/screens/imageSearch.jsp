<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<%@page import="java.net.URL"%>
<%@ page
  session="true"
  contentType="text/html; charset=UTF-8"
  pageEncoding="UTF-8"

  import="java.io.File"
  import="java.io.IOException"
  import="java.util.Calendar"
  import="java.util.Date"
  import="java.util.GregorianCalendar"
  import="java.net.URLEncoder"
  import= "java.net.*"
  import= "java.io.*"
  import="java.text.DateFormat"
  import="java.text.SimpleDateFormat"
  import="java.util.TimeZone"
  import="java.util.regex.Matcher"
  import="java.util.regex.Pattern"
  import="org.apache.commons.lang.StringEscapeUtils"
  import="java.util.Properties"
  import="java.util.HashSet"
  import="java.net.MalformedURLException"

%>
<% // Set the character encoding to use when interpreting request values.
  request.setCharacterEncoding("UTF-8");
%>
<%
response.setHeader("Cache-Control","public, max-age=600");
%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn" %>
<%@ include file="/include/logging_params.jsp" %>
<%@ include file="/include/i18n.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%!

  //Remove http and https before testing against this url pattern
  private static final Pattern URL_PATTERN = Pattern.compile("^. ?(([a-zA-Z\\d][-\\w\\.]+)\\.([a-zA-Z\\.]{2,6})([-\\/\\w\\p{L}\\.~,;:%&=?+$#*]*)*\\/?) ?.*$");
%>

<%
  // configurations
  String waybackURL = pt.arquivo.webapp.Configuration.get("wayback.url", "examples.com");
  pageContext.setAttribute("waybackURL", waybackURL);

  String showContameHistoriasButton = pt.arquivo.webapp.Configuration.get("webapp.showContameHistoriasButton", "false");
  pageContext.setAttribute("showContameHistoriasButton", showContameHistoriasButton);

  String hideImageResultsOnError = pt.arquivo.webapp.Configuration.get("webapp.hideImageResultsOnError", "true");
  pageContext.setAttribute("hideImageResultsOnError", hideImageResultsOnError);

  String resizeURL = pt.arquivo.webapp.Configuration.get("resize.url", "");
  pageContext.setAttribute("resizeURL", resizeURL);
%>

<%
  int queryStringParameter= 0;
  // Prepare the query values to be presented on the page, preserving the session
  String htmlQueryString = "";
  String query ="";
  boolean safe =true;
  boolean unsafe = false;
  String safeSearchString ="on";
  String type = ""; /*Default mimetype*/
  String size = "all"; /*Default image size*/
  String tools = "off"; /*Show toolbar*/
  int startPosition = 0;
  String startString = request.getParameter("start");
  if (startString != null)
    startPosition = Integer.parseInt(startString);



  if( request.getParameter("safeSearch") != null && request.getParameter("safeSearch").contains("off") ){
    safeSearchString = "off";
  }
  if ( request.getParameter("size") != null && request.getParameter("size") != "") {
          size = request.getParameter("size");
          if(! "sm".equals(size) && !"md".equals(size) && ! "lg".equals(size)){
            size = "all";
          }
  }

  if ( request.getParameter("type") != null && request.getParameter("type") != "") {
          type = request.getParameter("type");
          if(! "jpg".equals(type) && !"png".equals(type) && ! "gif".equals(type) && ! "bmp".equals(type) && ! "webp".equals(type)){
            type = "";
          }
  }



  if( ! "".equals(type) || ! "all".equals(size) || ! "on".equals(safeSearchString)){
    tools = "on";
  }else if ( request.getParameter("tools") != null && request.getParameter("tools") != "") {
    tools = request.getParameter("tools");
    if(! "on".equals(tools)){
      tools = "off";
    }
  }


  if ( request.getParameter("query") != null ) {
        htmlQueryString = request.getParameter("query").toString();
        query= htmlQueryString;
        query = URLEncoder.encode(query, "UTF-8");
  }
  else{
        htmlQueryString = "";
        if ( request.getParameter("adv_and") != null && request.getParameter("adv_and") != "") {
                htmlQueryString += request.getParameter("adv_and");
                htmlQueryString += " ";
        }
        if ( request.getParameter("adv_phr") != null && request.getParameter("adv_phr") != "") {
                htmlQueryString += "\"" +request.getParameter("adv_phr") + "\"";
                htmlQueryString += " ";
        }
        if ( request.getParameter("adv_not") != null && request.getParameter("adv_not") != "") {
                String notStr = request.getParameter("adv_not");
                if (!notStr.startsWith("-"))
                        notStr = "-" + notStr;
                notStr = notStr.replaceAll("[ ]+", " -") +" ";
                htmlQueryString += notStr;
        }
        if ( request.getParameter("adv_mime") != null && request.getParameter("adv_mime") != "" ) {
                htmlQueryString += "filetype:"+ request.getParameter("adv_mime");
                htmlQueryString += " ";
        }
        if (request.getParameter("site") != null && request.getParameter("site") != "") {
                htmlQueryString += "site:";
                String siteParameter = request.getParameter("site"); //here split hostname and put it to lowercase

                if (! siteParameter.contains("://")) {
                  siteParameter = "http://" + siteParameter;
                }
                URL siteURL = new URL(siteParameter);
                String siteHost = siteURL.getHost();
                // site parameter should have only the host on image search
                siteParameter = siteHost.toLowerCase();
                htmlQueryString += siteParameter + " ";
                query = htmlQueryString;
        }
        if (request.getParameter("type") != null && request.getParameter("type") != "" && !request.getParameter("type").toLowerCase().equals("all")) {
          htmlQueryString += "type:" + request.getParameter("type") + " " ;
        }
        String sizeParam = request.getParameter("size");
        if (sizeParam != null && sizeParam != "") {
          sizeParam = sizeParam.toLowerCase();
          if(sizeParam.equals("sm") || sizeParam.equals("md") || sizeParam.equals("lg")){
            htmlQueryString += "size:" + sizeParam + " " ;
          }
        }
        if (request.getParameter("safeSearch") != null && request.getParameter("safeSearch").toLowerCase().equals("off")) {
          htmlQueryString += "safe:off ";
        }

    }
  //htmlQueryString= StringEscapeUtils.escapeHtml(htmlQueryString);
  //request.setAttribute("htmlQueryString", htmlQueryString);

  // Prepare the query values to be presented on the page, preserving the session
  //htmlQueryString = "";

  if ( request.getParameter("query") != null ) {
        pt.arquivo.webapp.LOG.debug("Received Query input");
        //htmlQueryString = request.getParameter("query").toString();
        String [] inputWords = htmlQueryString.split("\\s+");
        StringBuilder reconstructedInputString = new StringBuilder();

        for (String word: inputWords){
          pt.arquivo.webapp.LOG.debug("WORD: "+ word);
          if( word.startsWith("https://")){
            word= word.substring(8, word.length());
          }else if (word.startsWith("http://")){
            word = word.substring(7, word.length());
          }

          Matcher matcher = URL_PATTERN.matcher(word);

          if (matcher.find()) {

            try {
              pt.arquivo.webapp.LOG.debug("Attempting URL "+ word);
              URL myURL = new URL("http://" + word);
              String host = myURL.getHost();
              String[] domainNameParts = host.split("\\.");
              String tldString ="."+domainNameParts[domainNameParts.length-1].toUpperCase();
              pt.arquivo.webapp.LOG.debug("TLD:"+ tldString);
              if(pt.arquivo.webapp.TopLevelDomainUtil.contains(tldString)){
                word = "site:" + host.toLowerCase();
              }
              else{
                pt.arquivo.webapp.LOG.debug("Invalid tld in word:"+ word);
              }
            } catch (MalformedURLException e) {

              //NOT a valid URL we will not consider it just add the word without the site:
            }
          }
          reconstructedInputString.append(word).append(" ");
        }
        htmlQueryString = reconstructedInputString.toString().substring(0, reconstructedInputString.toString().length()-1);
  }
  request.setAttribute("htmlQueryString", htmlQueryString);

  int numrows = 24;
  String homeMessageClass= (htmlQueryString.equals("")) ? "" :  "hidden";
  String loaderDefaultClass = (homeMessageClass.equals("")) ? "hidden" : "";

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
  
%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
  <title><fmt:message key='images.imageTitle'/>:&nbsp; <c:out value = "${htmlQueryString}"/> &nbsp;  &mdash; Arquivo.pt</title>
  <meta name="Keywords" content="resultado, pesquisa, buscar, arquivo, Web, português, portuguesa, Portugal"/>
  <meta name="Description" content="Página de resultados de uma pesquisa de imagens feita no Arquivo.pt."/>

  <jsp:include page="/include/headerDefault.jsp" />
  <%@ include file="/include/dates.jsp" %>
  <%@ include file="/include/i18njs.jsp" %>

  <script type="text/javascript">
    imageSearchAPI = "<%= pt.arquivo.webapp.Configuration.get("image.search.api", "https://arquivo.pt/imagesearch") %>";
  </script>
  <% if (pt.arquivo.webapp.Configuration.get("query.suggestion.api") != null) { %>
    <script type="text/javascript">
      querySuggestionAPI = '<%= pt.arquivo.webapp.Configuration.get("query.suggestion.api", request.getContextPath()+"/spellchecker/checker") %>';
    </script>
  <% } %>

  <script type="text/javascript" src="/js/images2.js?build=<c:out value='${initParam.buildTimeStamp}'/>"></script>
  <script type="text/javascript">
    $(".border-mobile").click(function(e) {
       // Do something
       e.stopPropagation();
       console.log("button clicked");
    });
  </script>

</head>
<body id="homeImages">
<script type="text/javascript">
function searchImages(startIndex){
    var dateStartWithSlashes = '<%=dateStartString%>';
    var dateEndWithSlashes = '<%=dateEndString%>';
    var safeSearchOption = '<%=safeSearchString%>';
    searchImagesJS(dateStartWithSlashes, dateEndWithSlashes, safeSearchOption,startIndex);
}
</script>
<script type="text/javascript">
  var sizeVar = "<%=size%>";
  var typeVar = "<%=type%>";
</script>
<script type="text/javascript">
  startPosition = "<%=startPosition%>";
  numrows ="<%=numrows%>"; /*Number of Images to show by default*/
  waybackURL = "<%=waybackURL%>";
  resizeURL = "<%=resizeURL%>";
  showContameHistoriasButton = "<%=showContameHistoriasButton%>";
  showContameHistoriasButton = (String(showContameHistoriasButton).toLowerCase() == "true");
  hideImageResultsOnError = "<%=hideImageResultsOnError%>";
  hideImageResultsOnError = (String(hideImageResultsOnError).toLowerCase() == "true");
</script>

  <%@ include file="/include/topbar.jsp" %>
  <div class="container-fluid topcontainer" id="headerSearchDiv">
    
  <%
    String formAction = "/image/search";
    String advancedSearchAction = "/image/advanced/search";
  %>
  <%@ include file="/include/searchForm.jsp" %>

  <script type="text/javascript">$('#imagesTab').addClass('selected');$('#imagesTab').addClass('primary-underline');</script>

  <div class="spell hidden"><fmt:message key="search.spellchecker"/> <span class="suggestion"></span></div>
  <%@ include file="/include/estimatedResults.jsp" %>

  <div class="row image-container">
    <div id="loadingDiv" class="loader"><div></div></div>
    <script type="text/javascript">
      $( document ).ready(function() {
        $("#txtSearch").on('mousedown touchstart', function (e) {
          e.stopPropagation();
        });
      });

    var displayResults;

    </script>


    <% if ( (request.getParameter("query") == null || request.getParameter("query").equals("")) &&
            (request.getParameter("adv_and") == null || request.getParameter("adv_and").equals("")) &&
            (request.getParameter("adv_phr") == null || request.getParameter("adv_phr").equals("")) &&
            (request.getParameter("adv_not") == null || request.getParameter("adv_not").equals("")) &&
            (request.getParameter("type") == null || request.getParameter("type").equals("") || request.getParameter("type").toLowerCase().equals("all") ) &&
            (request.getParameter("size") == null || request.getParameter("size").equals("") || request.getParameter("size").toLowerCase().equals("all") ) &&
            (request.getParameter("safeSearch") == null || request.getParameter("safeSearch").equals("") || request.getParameter("safeSearch").toLowerCase().equals("on") ) &&
            (request.getParameter("site") == null || request.getParameter("site").equals(""))
     ){
    %>

      <section id="photos" style="display:none;">
      <script type="text/javascript">
        displayResults = true;
      </script>
    <% } else { %>
      <section id="photos">
      <script type="text/javascript">
        displayResults = false;
      </script>
    <% } %>

  </section>
    <div class="pagesNextPrevious text-center">
    <script type="text/javascript">
      if(displayResults) {
        document.write("<div class=\"pagesNextPrevious text-center\" style=\"display:none\">");
      } else {
        document.write("<div class=\"pagesNextPrevious text-center\">");
      }
    </script>


      <ul class="next-previous-ul">
      <%
      if (startPosition >= numrows) {
          int previousPageStart = startPosition - numrows;
          if(previousPageStart <0){previousPageStart=0;}
          String previousPageUrl = "/image/search?" + "query=" + query +
            "&dateStart="+ dateStartString +
            "&dateEnd="+ dateEndString +
            "&pag=prev" +                             // mark as 'previous page' link
            "&start=" + previousPageStart +
            "&l="+ language;
          previousPageUrl = StringEscapeUtils.escapeHtml(previousPageUrl);
      %>
        <li class="previous previous-image" id="previousImage">
          <a onclick="ga('send', 'event', 'Image search mobile', 'Previous page', document.location.href );" class="myButtonStyle text-center right10" role="button" href="<%=previousPageUrl%>" title="<fmt:message key='search.pager.previous'/>">
            <fmt:message key='search.pager.previous'/>
          </a>
        </li>
      <% } %>

      <%
        if (true) { /*TODO:: add condition check if there are more results */
           long nextPageStart = startPosition + numrows;
           String nextPageUrl = "/image/search?" +
            "query=" + query +
            "&dateStart="+ dateStartString +
            "&dateEnd="+ dateEndString +
            "&pag=next" +
            "&start=" + nextPageStart +
            "&l="+ language;
          nextPageUrl = StringEscapeUtils.escapeHtml(nextPageUrl);
      %>
          <li class="next next-image" id="nextImage">
            <a onclick="ga('send', 'event', 'Image search mobile', 'Next page', document.location.href );" class="myButtonStyle text-center" role="button" href="<%=nextPageUrl%>" title="<fmt:message key='search.pager.next'/>">
              <fmt:message key='search.pager.next'/>
            </a>
          </li>
      <% } %>

      </ul>

    </div>
  </div>

</div>



<script type="text/javascript">
  String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
      return this.split(needle).join(replacement);
  };
</script>

<div id="ui-datepicker-div" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div><div id="ui-datepicker-div" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div><div id="ui-datepicker-div" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all ui-helper-hidden-accessible"></div>


</div>

  <% if ( (request.getParameter("query") == null || request.getParameter("query").equals("")) &&
            (request.getParameter("adv_and") == null || request.getParameter("adv_and").equals("")) &&
            (request.getParameter("adv_phr") == null || request.getParameter("adv_phr").equals("")) &&
            (request.getParameter("adv_not") == null || request.getParameter("adv_not").equals("")) &&
            (request.getParameter("type") == null || request.getParameter("type").equals("") || request.getParameter("type").toLowerCase().equals("all") ) &&
            (request.getParameter("size") == null || request.getParameter("size").equals("") || request.getParameter("size").toLowerCase().equals("all") ) &&
            (request.getParameter("safeSearch") == null || request.getParameter("safeSearch").equals("") || request.getParameter("safeSearch").toLowerCase().equals("on") ) &&
            (request.getParameter("site") == null || request.getParameter("site").equals(""))
     ){
    %>
      <%@ include file="/include/intro.jsp" %>
      <script type="text/javascript">
        $( document ).ready(function() {
          $('#loadingDiv').hide();
        });
      </script>
    <% } %>

</div></div>

  <script type="text/javascript">
    function rafAsync() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve); //faster than set time out
        });
    }

    function checkElement(selector) {
        if (document.querySelector(selector) === null) {
            return rafAsync().then(() => checkElement(selector));
        } else {
            return Promise.resolve(true);
        }
    }
  </script>
  <script type="text/javascript">
    $('<div id="showSlides"><button onclick="previousImage()" class="left-image-viewer-arrow clean-button-no-fill"> <ion-icon name="ios-arrow-back" class="left-icon"></ion-icon></button><button onclick="nextImage()" class="right-image-viewer-arrow clean-button-no-fill"><ion-icon name="ios-arrow-forward" class="right-icon"></ion-icon></button><ion-slides id="expandedImageViewers" onload=slidesLoaded();></ion-slides></div>').insertBefore('.curve-background');

    checkElement('#expandedImageViewers > .swiper-wrapper')
      .then((element) => {
        if($('#txtSearch').val().length){doInitialSearch();}
      });

      document.querySelector('ion-slides').addEventListener("ionSlideDidChange", slideChanged);
  </script>

  <script type="text/javascript">
    $('#showSlides').hide();
  </script>

  <script type="text/javascript" src="/js/annotation.js?build=<c:out value='${initParam.buildTimeStamp}'/>"></script>

<%@include file="/include/analytics.jsp" %>
<%@include file="/include/footer.jsp" %>
</body>
</html>

