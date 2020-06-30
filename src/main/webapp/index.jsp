<%
response.sendRedirect( 
	request.getContextPath() + "/" + (request.getQueryString() != null ? "?" + request.getQueryString() : "") 
);
%>
