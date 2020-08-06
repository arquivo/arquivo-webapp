
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<%@ page
  session="true"
  contentType="text/html; charset=UTF-8"
  pageEncoding="UTF-8"

  import="java.io.File"
  import="java.util.Calendar"
  import="java.util.Date"
  import="java.util.regex.Matcher"
  import="java.util.regex.Pattern"
  import="java.util.GregorianCalendar"
  import="pt.arquivo.webapp.DateUtils"
%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ include file="/include/logging_params.jsp" %>
<%@ include file="/include/i18n.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%!
  private static int hitsTotal = -10;   // the value -10 will be used to mark as being "advanced search"
  int hitsPerPage = 10;
%>

<%---------------------- Start of HTML ---------------------------%>

<!-- test HM -->

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
  <title><fmt:message key='home.meta.title'/></title>
  <meta name="Keywords" content="<fmt:message key='home.meta.keywords'/>" />
  <meta name="Description" content="<fmt:message key='home.meta.description'/>" />
  <meta property="og:title" content="<fmt:message key='home.meta.title'/>"/>
  <meta property="og:description" content="<fmt:message key='home.meta.description'/>"/>

  <jsp:include page="/include/headerDefault.jsp" />
  <%@ include file="/include/dates.jsp" %>
  <%@ include file="/include/i18njs.jsp" %>

  <!-- starts New style to override less styles -->
  <script type="text/javascript">
    $('input,textarea').focus(function(){
       $(this).removeAttr('placeholder');
    })
  </script>

 <!-- starts closing Welcome blue div on homepage -->
 <script type="text/javascript">
 $(document).ready(function(){
  $("#closeMessage").click(function(){
    $('#welcomeMessage').hide();
    localStorage.setItem('welcomeMessage', 'false')
  });

  $('.pageLink, .imageLink ').click(function() {

    var pageClass = $(this).hasClass("pageLink");
    var imageClass = $(this).hasClass("imageLink");

    var pagesHref = (imageClass === true ? "/image/search?l=<%=language%>" : "/page/search?l=<%=language%>");

    var query = $('#txtSearch').val();
    var dateStart = $('#dateStart_top').val();
    var dateEnd = $('#dateEnd_top').val();

    var newUrl = addParameters(query, dateStart, dateEnd, pagesHref);

    if(newUrl)
      window.location.href = newUrl;

  }); //end PageButton and ImageButton click

  $('#advancedSearchButton').click(function() {
      var newURL = "";
      var txtSearch = document.getElementById('txtSearch').value.toString();
      if(txtSearch !='' && txtSearch != undefined){
               newURL = "/page/advanced/search?l=<%=language%>&query="+ARQUIVO.encodeHtmlEntities(txtSearch);

      } else {
        newURL = "/page/advanced/search?l=<%=language%>";
      }

      console.log('newURL => ' + newURL);
      window.location.href = newURL;

  }); //end advancedSearchButton click


  });  //end document ready

function addParameters(query, dateStart, dateEnd, pageToLink) {
    var oldUrl =  location.protocol + '//' + location.host;
    if( oldUrl.substr(oldUrl.length - 1) === '/') {
      oldUrl = oldUrl.substr(0, oldUrl.length - 1);
    }

    var newUrl = updateQueryStringParameter(oldUrl + pageToLink, "query", encodeURI(query));
    newUrl = updateQueryStringParameter(newUrl, "dateStart", encodeURIComponent(dateStart));
    newUrl = updateQueryStringParameter(newUrl, "dateEnd", encodeURIComponent(dateEnd));

    return newUrl;
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

 </script>
 <!-- ends closing Welcome blue div on homepage -->

</head>
<body id="homepage-landing">
  <%@ include file="/include/topbar.jsp" %>

  <div class="container-fluid topcontainer" id="headerSearchDiv">
    
    <%
      String formAction = "/page/search";
      String advancedSearchAction = "/page/advanced/search";
    %>
    <%@ include file="/include/searchForm.jsp" %>

    <script type="text/javascript">$('#pagesTab').addClass('selected');$('#pagesTab').addClass('primary-underline');</script>
  </div>

  <%@ include file="/include/intro.jsp" %>

  <%@include file="/include/analytics.jsp" %>
  <%@include file="/include/footer.jsp" %>
</body>
</html>

<%@include file="/include/logging.jsp" %>
