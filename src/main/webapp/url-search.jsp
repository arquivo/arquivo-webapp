<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

<%
  String language = "";
  // configurations
  String waybackURL = pt.arquivo.webapp.Configuration.get("wayback.url", "examples.com");
  pageContext.setAttribute("waybackURL", waybackURL);

  // attributes from servlet
  String urlQuery = (String) request.getAttribute("urlQuery");

  String startTs = (String) request.getAttribute("startTs");
  String endTs = (String) request.getAttribute("endTs");
  String timestampToOpen = (String) request.getAttribute("timestampToOpen");
  String typeShow = (String) request.getAttribute("typeShow");
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title><fmt:message key='url.search.meta.title'><fmt:param value="<%=urlQuery%>"/></fmt:message></title>
  <meta name="Keywords" content="<fmt:message key='url.search.meta.keywords'/>" />
  <meta name="Description" content="<fmt:message key='url.search.meta.description'/>" />

  <link rel="stylesheet" href="/static/jquery-ui-1.12.1.custom/jquery-ui.min.css" media="none" onload="if(media!='all')media='all'" /><%-- Lazy load css download --%>
  <script src="/static/jquery-3.5.1.min.js"></script>
  <script src="/static/jquery-ui-1.12.1.custom/jquery-ui.js"></script>

  <link rel="stylesheet" href="/css/urlSearch.css?build=<c:out value='${initParam.buildTimeStamp}'  />" media="none" onload="if(media!='all')media='all'" /><%-- Lazy load css download --%>
  
  <%@ include file="/include/i18njs.jsp" %>

  <script type="text/javascript">
    waybackURL = "<%= pt.arquivo.webapp.Configuration.get("wayback.url", "examples.com") %>";
  </script>

  <script type="text/javascript" src="/js/url-search.js?build=<c:out value='${initParam.buildTimeStamp}' />"></script>
</head>
<body>
  <div class="urlSearchEstimatedResultsContainer">
    <p class="urlSearchEstimatedResults" id="estimatedResults" style="display: none;">
      <fmt:message key="search.results.estimated.results.1"/>
      <span id="estimatedResultsValue"></span> 
      <fmt:message key="search.results.estimated.results.2">
        <fmt:param value="<%= startTs.substring(0, 4) %>"/>
        <fmt:param value="<%= endTs.substring(0, 4) %>"/>
      </fmt:message>
    </p>
  </div>

  <div id="urlSearchContainer" class="urlSearchContainer">
  </div>
  <div id="loadingDiv" class="loader"><div></div></div>
  <script type="text/javascript">
    initializeUrlSearch("<%=waybackURL%>", "<%=urlQuery%>", "<%=startTs%>", "<%=endTs%>", 'urlSearchContainer', 'loadingDiv', "<%=typeShow%>", "<%=timestampToOpen%>");
  </script>
</body>
</html>