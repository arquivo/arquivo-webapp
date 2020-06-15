<%
response.sendRedirect( 
	request.getContextPath() + "/image/search" + (request.getQueryString() != null ? "?" + request.getQueryString() : "") 
);
%>
