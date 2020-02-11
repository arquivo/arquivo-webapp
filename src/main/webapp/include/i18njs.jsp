<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

<script type="text/javascript">
  var language = localStorage.language;
  if( language == 'EN'){
    document.write('<script type="text/javascript" language="JavaScript" src="<%=request.getContextPath()%>/js/properties/ConstantsEN.js?build=<c:out value='${initParam.buildTimeStamp}' />"><\/script>');
  }
  else{
    document.write('<script type="text/javascript" language="JavaScript" src="<%=request.getContextPath()%>/js/properties/ConstantsPT.js?build=<c:out value='${initParam.buildTimeStamp}' />"><\/script>');
  }
</script>
