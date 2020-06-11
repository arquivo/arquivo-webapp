<%
response.sendRedirect( 
	request.getContextPath() + "/page/advanced/search" + (request.getQueryString() != null ? "?" + request.getQueryString() : "") 
);
%>
