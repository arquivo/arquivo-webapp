<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%
  // configurations
  String waybackURL = pt.arquivo.webapp.Configuration.get("wayback.url", "examples.com");
  pageContext.setAttribute("waybackURL", waybackURL);

  // attributes from servlet
  String urlQuery = (String) request.getAttribute("urlQuery");

  String startTs = (String) request.getAttribute("startTs");
  String endTs = (String) request.getAttribute("endTs");
  String timestampToOpen = (String) request.getAttribute("timestampToOpen");
  
%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
  <title><fmt:message key='url.search.meta.title'><fmt:param value="${urlQuery}"/></fmt:message></title>
  <meta name="Keywords" content="<fmt:message key='url.search.meta.keywords'/>" />
  <meta name="Description" content="<fmt:message key='url.search.meta.description'/>" />

  <jsp:include page="/include/headerDefault.jsp" />
  <%@ include file="/include/dates.jsp" %>
  <jsp:include page="/include/i18njs.jsp" />

  <script type="text/javascript">
    waybackURL = "<%= pt.arquivo.webapp.Configuration.get("wayback.url", "examples.com") %>";
  </script>

  <script type="text/javascript" src="/js/url-search.js?build=<c:out value='${initParam.buildTimeStamp}' />"></script>
</head>
<body>
  <div class="url-search-container" id="urlSearchContainer">
  </div>
  <div id="loadingDiv" class="loader"><div></div></div>
  <script type="text/javascript">

    initializeUrlSearch("<%=waybackURL%>", "<%=urlQuery%>", "<%=startTs%>", "<%=endTs%>", 'urlSearchContainer', 'loadingDiv', 'list', "<%=timestampToOpen%>");
  </script>
</body>
</html>