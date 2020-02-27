<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

<script type="text/javascript">
  var language = '<%= language %>';
  
  // if not defined on server side then try to get previous client choosen language.
  if (!language || language.length == 0) {
  	language = localStorage.getItem("language");
  }
  
  // save choosen language on local storage
  localStorage.setItem("language", language.toUpperCase());
  
  if( language.toUpperCase() == 'EN'){
    document.write('<script type="text/javascript" language="JavaScript" src="<%=request.getContextPath()%>/js/properties/ConstantsEN.js?build=<c:out value='${initParam.buildTimeStamp}' />"><\/script>');
  }
  else{
    document.write('<script type="text/javascript" language="JavaScript" src="<%=request.getContextPath()%>/js/properties/ConstantsPT.js?build=<c:out value='${initParam.buildTimeStamp}' />"><\/script>');
  }
</script>
<% if (language.equals("pt")) { %>
	<script type="text/javascript" src="/static/jquery-ui-1.12.1.custom/datepicker-pt.js"></script>
<% } %>
