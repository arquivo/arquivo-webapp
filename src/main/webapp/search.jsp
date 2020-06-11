<%
response.sendRedirect( 
	request.getContextPath() + "/page/search" + (request.getQueryString() != null ? "?" + request.getQueryString() : "") 
);
%>
