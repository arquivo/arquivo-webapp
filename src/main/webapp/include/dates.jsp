<%-- this file contains a javascript snippet to be included on a couple of pages --%>
<%@ page
  import="java.util.Calendar"
  import="pt.arquivo.webapp.DateUtils"
%>
<%
  final DateUtils dateUtils = new DateUtils(request.getParameter("dateStart"), request.getParameter("dateEnd"));
  Calendar DATE_START = dateUtils.getFixedDateStart();
  Calendar dateStart = dateUtils.getDateStart();
  String dateStartString = dateUtils.getDateStartString();
  String dateStartDay = dateUtils.getDateStartDay();
  String dateStartMonth = dateUtils.getDateStartMonth();
  String dateStartYear = dateUtils.getDateStartYear();
  String dateStartStringIonic = dateUtils.getDateStartStringIonic();

  Calendar DATE_END = dateUtils.getFixedDateEnd();
  Calendar dateEnd = dateUtils.getDateEnd();
  String dateEndString = dateUtils.getDateEndString();
  String dateEndDay = dateUtils.getDateEndDay();
  String dateEndMonth = dateUtils.getDateEndMonth();
  String dateEndYear = dateUtils.getDateEndYear();
  String dateEndStringIonic = dateUtils.getDateEndStringIonic();
  
  String yearStartNoParameter = dateUtils.getDateStartString();

%>
<%--
<script type="text/javascript">
	var minDate = new Date(<%=DATE_START.getTimeInMillis()%>);
	var maxDate = new Date(<%=DATE_END.getTimeInMillis()%>);
	var minYear = minDate.getFullYear();
	var maxYear = maxDate.getFullYear();
</script>
--%>
