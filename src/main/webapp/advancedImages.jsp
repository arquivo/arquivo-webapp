<%
response.sendRedirect( 
	request.getContextPath() + "/image/advanced/search" + (request.getQueryString() != null ? "?" + request.getQueryString() : "") 
);
%>
