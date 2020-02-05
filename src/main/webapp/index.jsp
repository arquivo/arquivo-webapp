
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
%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ include file="/include/logging_params.jsp" %>
<%@ include file="/include/i18n.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%! //To please the compiler since logging need those -- check [search.jsp]
  private static final Pattern OFFSET_PARAMETER = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})");
  private static int hitsTotal = -10;   // the value -10 will be used to mark as being "advanced search"
  private static Calendar DATE_START = new GregorianCalendar(1996, 1-1, 1);
    Calendar dateStart = (Calendar)DATE_START.clone();
    SimpleDateFormat inputDateFormatter = new SimpleDateFormat("dd/MM/yyyy");
  /*private static Calendar dateStart = new GregorianCalendar();*/
  private static Calendar dateEnd = new GregorianCalendar();
    String dateStartString = inputDateFormatter.format( dateStart.getTime() );
    String dateStartDay = dateStartString.substring(0,2);

    String dateStartMonth = dateStartString.substring(3,5);

    String dateStartYear = dateStartString.substring(dateStartString.length()-4);

    String dateStartStringIonic =  dateStartYear + "-" + dateStartMonth + "-" + dateStartDay;

    String dateEndString = inputDateFormatter.format( dateEnd.getTime() );

    String dateEndDay = dateEndString.substring(0,2);

    String dateEndMonth = dateEndString.substring(3,5);

    String dateEndYear = dateEndString.substring(dateEndString.length()-4);

    String dateEndStringIonic =  dateEndYear + "-" + dateEndMonth + "-" + dateEndDay;

    String yearStartNoParameter = "1996";

%>

<%-- Get the application beans --%>
<%
  Calendar DATE_END = new GregorianCalendar();
  DATE_END.set( Calendar.YEAR, DATE_END.get(Calendar.YEAR) );
  DATE_END.set( Calendar.MONTH, 12-1 );
  DATE_END.set( Calendar.DAY_OF_MONTH, 31 );
  DATE_END.set( Calendar.HOUR_OF_DAY, 23 );
  DATE_END.set( Calendar.MINUTE, 59 );
  DATE_END.set( Calendar.SECOND, 59 );
  int queryStringParameter= 0;
  String dateEndString="";
  String dateEndYear="";
  /** Read the embargo offset value from the configuration page. If not present, default to: -1 year */
  try {
        String offsetDateString = getServletContext().getInitParameter("embargo-offset");

        Matcher offsetMatcher = OFFSET_PARAMETER.matcher( offsetDateString );
        offsetMatcher.matches();
        int offsetYear = Integer.parseInt(offsetMatcher.group(1));
        int offsetMonth = Integer.parseInt(offsetMatcher.group(2));
        int offsetDay = Integer.parseInt(offsetMatcher.group(3));

        DATE_END.set(Calendar.YEAR, DATE_END.get(Calendar.YEAR) - offsetYear);
        DATE_END.set(Calendar.MONTH, DATE_END.get(Calendar.MONTH) - offsetMonth);
        DATE_END.set(Calendar.DAY_OF_MONTH, DATE_END.get(Calendar.DAY_OF_MONTH) - offsetDay );
        dateEndString = inputDateFormatter.format( DATE_END.getTime() );
      dateEndYear = dateEndString.substring(dateEndString.length()-4);
  } catch(IllegalStateException e) {
        // Set the default embargo period to: 1 year
        DATE_END.set( Calendar.YEAR, DATE_END.get(Calendar.YEAR) - 1);
        pt.arquivo.webapp.LOG.error("Embargo offset parameter isn't in a valid format");
        dateEndString = inputDateFormatter.format( DATE_END.getTime() );
      dateEndYear = dateEndString.substring(dateEndString.length()-4);
  } catch(NullPointerException e) {
        // Set the default embargo period to: 1 year
        DATE_END.set( Calendar.YEAR, DATE_END.get(Calendar.YEAR) - 1);
        dateEndString = inputDateFormatter.format( DATE_END.getTime() );
      dateEndYear = dateEndString.substring(dateEndString.length()-4);
        pt.arquivo.webapp.LOG.error("Embargo offset parameter isn't present");
  }
%>

<%---------------------- Start of HTML ---------------------------%>

<%-- TODO: define XML lang --%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-PT" lang="pt-PT">
<head>
  <title><fmt:message key='home.meta.title'/></title>
  <meta name="Keywords" content="<fmt:message key='home.meta.keywords'/>" />
  <meta name="Description" content="<fmt:message key='home.meta.description'/>" />
  <meta property="og:title" content="<fmt:message key='home.meta.title'/>"/>
  <meta property="og:description" content="<fmt:message key='home.meta.description'/>"/>
  <meta property="og:image" content="<%=request.getContextPath()%>/img/logoFace.png"/>

  <jsp:include page="/include/headerDefault.jsp" />

  <script type="text/javascript">
    var minDate = new Date(<%=DATE_START.getTimeInMillis()%>);
    var maxDate = new Date(<%=DATE_END.getTimeInMillis()%>);
    var minYear = minDate.getFullYear();
    var maxYear = maxDate.getFullYear();
  </script>

  <!-- starts New style to override less styles -->
  <script type="text/javascript">
    $('input,textarea').focus(function(){
       $(this).removeAttr('placeholder');
    })
  </script>

 <!-- starts closing Welcome blue div on homepage -->
 <script type="text/javascript">
 var language =  localStorage.language;
 advancedHref = "advanced.jsp?l=<%=language%>";

 $(document).ready(function(){
  $("#closeMessage").click(function(){
    $('#welcomeMessage').hide();
    localStorage.setItem('welcomeMessage', 'false')
  });

  $('.pageLink, .imageLink ').click(function() {

    var pageClass = $(this).hasClass("pageLink");
    var imageClass = $(this).hasClass("imageLink");

    var pagesHref = (imageClass === true ? "/images.jsp?l=<%=language%>" : "/search.jsp?l=<%=language%>");

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
               newURL = "/advanced.jsp?l=<%=language%>&query="+encodeHtmlEntities(txtSearch);

      } else {
        newURL = "/advanced.jsp?l=<%=language%>";
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
    <%@ include file="/include/homepageHeaderMobile.jsp" %>
    <script type="text/javascript">$('#pagesTab').addClass('selected');$('#pagesTab').addClass('primary-underline');</script>
  </div>

  <%@ include file="/include/intro.jsp" %>

  <%@include file="/include/analytics.jsp" %>
  <%@include file="/include/footer.jsp" %>
</body>
</html>

<%@include file="/include/logging.jsp" %>
