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

<%!    //To please the compiler since logging need those -- check [search.jsp]
    private static int hitsTotal = -10;        // the value -10 will be used to mark as being "advanced search"
%>

<%---------------------- Start of HTML ---------------------------%>

<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="<c:out value='${locale}' />" lang="<c:out value='${locale}' />">
<head>
    <title><fmt:message key='advanced.meta.title'/></title>
    <meta name="Keywords" content="<fmt:message key='advanced.meta.keywords'/>" />
    <meta name="Description" content="<fmt:message key='advanced.meta.description'/>" />

    <jsp:include page="/include/headerDefault.jsp" />
    <%@ include file="/include/dates.jsp" %>
    <%@ include file="/include/i18njs.jsp" %>

</head>
<body id="advanced">
    <%@ include file="/include/topbar.jsp" %>
    <div>
    <div class="container-fluid topcontainer col-sm-offset-1 col-sm-10 col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6 col-xl-offset-4 col-xl-4 " id="headerSearchDiv" >
        <div id="info-texto-termos" class="row">
        </div>
        <!-- Formulario -->
        <div id="main" class="main-form-advanced">
            <div id="conteudo-pesquisa">
                <form  id="searchForm" method="get" action='<%= request.getContextPath() + "/search.jsp" %>'>
                    <input type="hidden" name="l" value="<%= language %>" />
                    <div class="expandable-div">
                        <fieldset id="words">
                            <legend><fmt:message key='advanced.terms'/><i class="fa iCarret yearCarret fa-caret-down pull-right right-15" aria-hidden="true"></i></legend>
                            <div class="box-content container-fluid">
                                <div id="label-palavras-1">
                                    <label for="adv_and" class="row  col-xs-12 no-padding-left label-padding-top"><fmt:message key='advanced.terms.all'/></label>
                                    <div class="withTip ">
                                        <input type="text" id="adv_and" class="row  col-xs-10" name="adv_and" value="<%= (request.getParameter("adv_and") != null && !(request.getParameter("adv_and").equals(""))) ? request.getParameter("adv_and") : and.toString()%>" />
                                        <div class="row  col-xs-10 no-padding-left">
                                            <span class="tip"><fmt:message key='advanced.terms.all.hint'/></span>
                                        </div>
                                    </div>
                                </div>

                                <div id="label-palavras-2">
                                    <label class="row  col-xs-12 no-padding-left label-padding-top" for="adv_phr"><fmt:message key='advanced.terms.phrase'/></label>
                                    <div class="withTip">
                                        <input type="text" class="row  col-xs-10" id="adv_phr" name="adv_phr" value="<%= (request.getParameter("adv_phr") != null && !(request.getParameter("adv_phr").equals(""))) ? request.getParameter("adv_phr") : phrase.toString()%>" />
                                        <div class="row  col-xs-10 no-padding-left">
                                            <span class="tip"><fmt:message key='advanced.terms.phrase.hint'/></span>
                                        </div>
                                    </div>
                                </div>

                                <div id="label-palavras-3">
                                    <label class="row  col-xs-12 no-padding-left label-padding-top" for="adv_not"><fmt:message key='advanced.terms.not'/></label>
                                    <div class="withTip">
                                        <input type="text" class="row  col-xs-10" id="adv_not" name="adv_not" value="<%= (request.getParameter("adv_not") != null && !(request.getParameter("adv_not").equals(""))) ? request.getParameter("adv_not") : not.toString()%>" />
                                        <div class="row  col-xs-10 no-padding-left">
                                            <span class="tip"><fmt:message key='advanced.terms.not.hint'/></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="expandable-div">
                        <fieldset id="date">
                            <legend><fmt:message key='advanced.date'/><i class="fa iCarret yearCarret fa-caret-down pull-right right-15" aria-hidden="true"></i></legend>
                            <div class="container-fluid">
                                <div id="label-data-1">
                                    <%@ include file="/include/datePickerComponent.jsp" %>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                    <div class="expandable-div">
                        <fieldset id="format">
                            <legend><fmt:message key='advanced.format'/><i class="fa iCarret yearCarret fa-caret-down pull-right right-15" aria-hidden="true"></i></legend>
                            <div class="box-content container-fluid ">
                                <div id="label-format-1">
                                    <label class="row  col-xs-12 no-padding-left label-padding-top" for="formatType"><fmt:message key='advanced.format.label'/></label>
                                    <ion-select id="formatType" name="format" interface="action-sheet" placeholder="<fmt:message key='advanced.select.one'/>"  class="row  col-xs-10 no-padding-left formatTypeDropdown">
                                    <%
                                        String[] mimeList = {"pdf", "ps", "html", "xls", "ppt", "doc", "rtf"};
                                        String[] mimeListDetail = {"Adobe PDF (.pdf)", "Adobe PostScript (.ps)", "HTML (.htm, .html)", "Microsoft Excel (.xls)", "Microsoft PowerPoint (.ppt)", "Microsoft Word (.doc)", "Rich Text Format (.rtf)"};

                                        if (format == null || "all".equals(format)) {%>
                                            <ion-select-option value="all" selected><fmt:message key='advanced.format.all'/></ion-select-option>
                                        <%} else {%>
                                            <ion-select-option value="all"><fmt:message key='advanced.format.all'/></ion-select-option>
                                        <%}

                                        for (int i=0; i < mimeList.length; i++) {
                                            if (mimeList[i].trim().equals(format.trim())) {
                                                out.print("<ion-select-option value=\""+ mimeList[i] +"\" selected>"+ mimeListDetail[i] +"</ion-select-option>");
                                            } else {
                                                out.print("<ion-select-option value=\""+ mimeList[i] +"\">"+ mimeListDetail[i] +"</ion-select-option>");
                                            }
                                        }
                                    %>
                                    </ion-select>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="expandable-div">
                        <fieldset id="domains">
                            <legend><fmt:message key='advanced.website'/><i class="fa iCarret yearCarret fa-caret-down pull-right right-15" aria-hidden="true"></i></legend>
                            <div class="box-content container-fluid ">
                                <div id="label-domains-1">
                                    <label class="row  col-xs-12 no-padding-left label-padding-top" for="site"><fmt:message key='advanced.website.label'/></label>
                                    <div class="withTip">
                                        <input class="row  col-xs-10 no-padding-left" type="text" id="site" name="site" value="<%=site%>" />
                                        <span class="row  col-xs-10 no-padding-left tip"><fmt:message key='advanced.website.hint'/></span>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div class="expandable-div">
                        <fieldset id="num_result_fieldset">
                            <legend><fmt:message key='advanced.results'/><i class="fa iCarret yearCarret fa-caret-down pull-right right-15" aria-hidden="true"></i></legend>
                            <div class="box-content container-fluid ">
                                <div id="label-num-result-fieldset-1">
                                    <label class="row  col-xs-12 no-padding-left label-padding-top" for="num-result"><fmt:message key='advanced.results.label'/></label>
                                    <div>
                                        <ion-select id="num-result" interface="action-sheet" placeholder="<fmt:message key='advanced.select.one'/>" class="row  col-xs-10 no-padding-left formatTypeDropdown" id="num-result" name="hitsPerPage">
                                        <%
                                        int[] hitsPerPageValues = {10, 20, 30, 50, 100};
                                        for (int i=0; i < hitsPerPageValues.length; i++) {
                                            if (hitsPerPage == hitsPerPageValues[i]) {
                                                out.print("<ion-select-option selected>"+ hitsPerPageValues[i] +"</ion-select-option>");
                                            } else {
                                                out.print("<ion-select-option>"+ hitsPerPageValues[i] +"</ion-select-option>");
                                            }
                                        }%>
                                        </ion-select>
                                    </div>
                                    <label class="row  col-xs-12 no-padding-left"><fmt:message key='advanced.results.label2'/></label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <div id="bottom-submit" class="text-center button-advanced">
                        <button type="submit" value="<fmt:message key='advanced.submit'/>" alt="<fmt:message key='advanced.submit'/>" class="myButtonStyle col-xs-offset-3 col-xs-6" name="btnSubmitBottom" id="btnSubmitBottom" accesskey="e" >
                            <fmt:message key='advanced.search'/>
                        </button>
                    </div>


                </form>
            </div>
        </div>
    </div>
</div>

<script type="text/javascript">
window.onload = function() {
	$(".expandable-div legend").click(function() {
	    var isVisible =  $(this).next().is(':visible');
	    if (isVisible){
	        // close
	        $(this).next().slideUp('fast');
	        $(this).children("i").removeClass('fa-caret-down').addClass('fa-caret-up');
	    } else {
	        // open
	        $(this).next().slideDown('fast').show().slideDown('fast');
	        $(this).children("i").removeClass('fa-caret-up').addClass('fa-caret-down');
	    }
	});
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
