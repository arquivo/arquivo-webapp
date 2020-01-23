<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<%@page import="java.net.URL"%>

<%@ page
	session="true"
	contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"

	import="java.io.File"
	import="java.io.IOException"
	import="java.net.URLEncoder"
	import="java.text.DateFormat"
	import="java.util.Calendar"
	import="java.util.Date"
	import="java.util.regex.Matcher"
	import="java.util.regex.Pattern"
	import="java.util.GregorianCalendar"
%>

<!-- Main Menu Dependencies -->
<link rel="stylesheet" href="/css/swiper.min.css" />
<link rel="stylesheet" href="/css/MainMenu.css?build=<c:out value='${initParam.buildTimeStamp}'/>" />
<%@ include file="MainMenu.jsp" %>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/dojo/1.13.0/dojo/dojo.js"></script>
<script type="text/javascript">MENU.init()</script>
<script type="text/javascript" src="/js/js.cookie.js"></script>
<script type="text/javascript">
	localStorage.setItem("language", "<%=language%>".toUpperCase());
</script>
<div class="main-content">
	<div class="container-fluid">
		 <div class="row text-center logo-main-div">
		                    <a href="/?l=<%=language%>"><img src="/img/01_preto.png" id="arquivoLogo" alt="Logo Arquivo.pt" class="text-center logo-main"></a>
		                    <a class="pull-right main-menu" id="menuButton"><i class="fa fa-bars line-height"></i></a>
		 </div>
	</div>
</div>
<script type="text/javascript">
$('#languageSelection').click( function(e) {
		e.preventDefault();
		window.location = toggleLanguage();
		return false; } );
</script>