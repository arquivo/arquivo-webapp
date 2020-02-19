<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<%@ page
	session="true"
	contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"	

	import="java.io.File"
	import="java.util.Calendar"
	import="java.util.Date"
	import="java.util.GregorianCalendar"
%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ include file="/include/logging_params.jsp" %>
<%@ include file="/include/i18n.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%---------------------- Start of HTML ---------------------------%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
	<title><fmt:message key='500.meta.title'/></title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
	<%-- TODO: define META lang --%>
	<meta http-equiv="Content-Language" content="<c:out value='${locale}' />" />
	<meta name="Keywords" content="<fmt:message key='500.meta.keywords'/>" />
	<meta name="Description" content="<fmt:message key='500.meta.description'/>" />
	
	<jsp:include page="/include/headerDefault.jsp" />
</head>
<body>
	<%@ include file="/include/topbar.jsp" %>
	<div >
		<div id="main">
			<div id="header">
				<%@ include file="/include/logo.jsp" %>
				<div id="info-texto-termos">
					<h1><fmt:message key='500.title'/></h1>
					<h2><fmt:message key='500.subtitle'/></h2>
				</div>
			</div>

			<div id="conteudo-erro">
								<p>
                                <ul>
                                	 <%	String contactUrl = null;
											if (language.equals("en"))
												contactUrl = "//sobre.arquivo.pt/contact";
											else
												contactUrl = "//sobre.arquivo.pt/contacto";
									%>
                                        <li><fmt:message key='500.suggestions.feedback'><fmt:param value='<%=contactUrl%>'/></fmt:message> </a></li>
                                        <li><a href="./"><fmt:message key='500.suggestions.go-home'/></a></li>
                                </ul>
                                </p>
			</div>
		</div>
	</div>
<%@include file="/include/footer.jsp" %>
<%@include file="/include/analytics.jsp" %>
</body>
</html>

<%@include file="/include/logging.jsp" %>
