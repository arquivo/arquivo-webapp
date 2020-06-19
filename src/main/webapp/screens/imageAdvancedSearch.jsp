<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" >
<%@ page
	session="true"
	contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"

	import="java.io.File"
	import="java.net.URLDecoder"
	import="java.util.Calendar"
	import="java.util.Date"
	import="java.util.GregorianCalendar"
	import="java.util.regex.Pattern"
	import="java.util.regex.Matcher"
%>
<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ include file="/include/logging_params.jsp" %>
<%@ include file="/include/i18n.jsp" %>
<%@ include file="/include/simple-params-processing.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%!	//To please the compiler since logging need those -- check [page/search]
	private static int hitsTotal = -10;		// the value -10 will be used to mark as being "advanced search"
%>
<%---------------------- Start of HTML ---------------------------%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
  <title><fmt:message key='advancedImages.meta.title'/></title>
  <meta name="Keywords" content="<fmt:message key='advancedImages.meta.keywords'/>" />
  <meta name="Description" content="<fmt:message key='advancedImages.meta.description'/>" />

  <jsp:include page="/include/headerDefault.jsp" />
  <%@ include file="/include/dates.jsp" %>
  <%@ include file="/include/i18njs.jsp" %>

</head>
<body id="advanced-images">
	<%@ include file="/include/topbar.jsp" %>
    <div class="container-fluid topcontainer col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4 " id="headerSearchDiv" >
		<div id="info-texto-termos" class="row">
		</div>
		<!-- Formulario -->
		<div id="main" class="main-form-advanced">
			<div id="conteudo-pesquisa">
				<form method="get" id="searchForm" action="/image/search">
					<input type="hidden" name="l" value="<%= language %>" />
		            <div class="expandable-div box-content container-fluid">
						<div class="topActionsOnAdvancedSearch">
                            <script type="text/javascript">
                              document.write(ARQUIVO.getSearchButtonsHTML());
                            </script>
                        </div>

						<div id="label-palavras-1">
							<label for="adv_and" class="row  col-xs-12 no-padding-left label-padding-top"><fmt:message key='advancedImages.terms.all'/>:</label>
							<div class="withTip ">
								<input type="text" id="adv_and" class="row  col-xs-10" name="adv_and" value="<%= (request.getParameter("adv_and") != null && !(request.getParameter("adv_and").equals(""))) ? request.getParameter("adv_and") : and.toString()%>" />
								<div class="row  col-xs-10 no-padding-left">
									<span class="tip"><fmt:message key='advancedImages.terms.all.hint'/></span>
								</div>
							</div>
						</div>

						<div id="label-palavras-2">
							<label class="row  col-xs-12 no-padding-left label-padding-top" for="adv_phr"><fmt:message key='advancedImages.terms.phrase'/>:</label>
							<div class="withTip">
								<input type="text" class="row  col-xs-10" id="adv_phr" name="adv_phr" value="<%= (request.getParameter("adv_phr") != null && !(request.getParameter("adv_phr").equals(""))) ? request.getParameter("adv_phr") : phrase.toString()%>" />
								<div class="row  col-xs-10 no-padding-left">
									<span class="tip"><fmt:message key='advancedImages.terms.phrase.hint'/></span>
								</div>
							</div>
						</div>

						<div id="label-palavras-3">
							<label class="row  col-xs-12 no-padding-left label-padding-top" for="adv_not"><fmt:message key='advancedImages.terms.not'/>:</label>
							<div class="withTip">
								<input type="text" class="row  col-xs-10" id="adv_not" name="adv_not" value="<%= (request.getParameter("adv_not") != null && !(request.getParameter("adv_not").equals(""))) ? request.getParameter("adv_not") : not.toString()%>" />
								<div class="row  col-xs-10 no-padding-left">
									<span class="tip"><fmt:message key='advancedImages.terms.not.hint'/></span>
								</div>
							</div>
						</div>

						<div id="advancedSearchDatesContainer">
                            <label class="row  col-xs-12 no-padding-left label-padding-top" for=""><fmt:message key='advanced.date'/>:</label>
                            <div id="label-data-1">
                                <%@ include file="/include/datePickerComponent.jsp" %>
                            </div>
                        </div>
					</div>
					<div class="expandable-div box-content container-fluid">
						<label class="row  col-xs-12 no-padding-left label-padding-top" for="formatType"><fmt:message key='advancedImages.format.label'/>:</label>
						<select id="formatType" interface="action-sheet" placeholder="<fmt:message key='advancedImages.select.one'/>"  class="row  col-xs-10 no-padding-left formatTypeDropdown" name="type">
						<%
							String[] mimeList = {"jpg", "png", "gif", "bmp", "webp"};
							String[] mimeListDetail = {"Joint Photographic Experts Group (.jpeg)", "Portable Network Graphics (.png)", "Graphics Interchange Format (.gif)", "Bitmap Image File (.bmp)", "WEBP (.webp)"};

							if (format == null || "all".equals(format)) {%>
								<option value="all" selected><fmt:message key='advancedImages.format.all'/></option>
							<%} else {%>
								<option value="all"><fmt:message key='advancedImages.format.all'/></option>
							<%}

							for (int i=0; i < mimeList.length; i++) {
								if (mimeList[i].equals(format.trim())) {
									out.print("<option value=\""+ mimeList[i] +"\" selected>"+ mimeListDetail[i] +"</option");
								} else {
									out.print("<option value=\""+ mimeList[i] +"\">"+ mimeListDetail[i] +"</option>");
								}
							}
						%>
						</select>
					</div>
					<div class="expandable-div box-content container-fluid">
						<label for="size" class="row  col-xs-12 no-padding-left label-padding-top"><fmt:message key='advancedImages.size'/>:</label>
						<select id="size" name="size" interface="action-sheet" placeholder="<fmt:message key='advancedImages.select.one'/>"  class="row  col-xs-10 no-padding-left formatTypeDropdown">
							<option value="all" <%= imagesSize.trim().equals("") || imagesSize.trim().equals("all") ? "selected" : "" %> ><fmt:message key='images.showAll'/></option>
							<option value="sm"  <%= imagesSize.trim().equals("sm") ? "selected" : "" %> ><fmt:message key='images.tools.sm'/></option>
							<option value="md"  <%= imagesSize.trim().equals("md") ? "selected" : "" %> ><fmt:message key='images.tools.md'/></option>
							<option value="lg" <%= imagesSize.trim().equals("lg") ? "selected" : "" %>  ><fmt:message key='images.tools.lg'/></option>
						</select>
					</div>
					<div class="expandable-div box-content container-fluid">
						<label for="safeSearch" class="row  col-xs-12 no-padding-left label-padding-top"><fmt:message key='images.safeSearch'/>:</label>
						<select id="safeSearch" interface="action-sheet" placeholder="<fmt:message key='advancedImages.select.one'/>" name="safeSearch" class="row  col-xs-10 no-padding-left formatTypeDropdown">
							<option value="on" <%= safeSearch.equals("") || safeSearch.equals("on") ? "selected" : "" %>  ><fmt:message key='images.safeOnLabel'/></option>
							<option value="off" <%= safeSearch.equals("off") ? "selected" : "" %>   ><fmt:message key='images.safeOffLabel'/></option>
						</select>
					</div>
					<div class="expandable-div box-content container-fluid">
						<div id="label-domains-1">
							<label class="row  col-xs-12 no-padding-left label-padding-top" for="site"><fmt:message key='advancedImages.website'/>:</label>
							<div class="withTip">
								<input class="row  col-xs-10 no-padding-left" type="text" id="site" name="site" value="<%=site%>" />
								<span class="row  col-xs-10 no-padding-left tip"><fmt:message key='advancedImages.website.hint'/></span>
							</div>
						</div>
					</div>

					<div id="bottom-submit" class="text-center button-advanced">
						<button type="submit" value="<fmt:message key='advancedImages.submit'/>" alt="<fmt:message key='advancedImages.submit'/>" class="myButtonStyle col-xs-offset-3 col-xs-6" name="btnSubmitBottom" id="btnSubmitBottom" accesskey="e" >
						<fmt:message key='advancedImages.search'/>
						</button>
					</div>


				</form>
            </div>
        </div>
		<!-- Fim formulário -->
    </div>

	<script type="text/javascript">
	window.onload = function() {
		const applyCancelFunction = function() { 
	        $(this)[0].cancelText = Content.picker.cancel; 
	    }
		$('#formatType').each( applyCancelFunction );
		$('#num-result').each( applyCancelFunction );
	};
	</script>

<%@ include file="/include/footer.jsp" %>
<%@include file="/include/analytics.jsp" %>
</body>
</html>

<%@include file="/include/logging.jsp" %>
