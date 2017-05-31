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
<%@ include file="include/logging_params.jsp" %>
<%@ include file="include/i18n.jsp" %>
<%@ include file="include/simple-params-processing.jsp" %>
<fmt:setLocale value="<%=language%>"/>

<%!	//To please the compiler since logging need those -- check [search.jsp]
	private static int hitsTotal = -10;		// the value -10 will be used to mark as being "advanced search"
	private static Calendar DATE_START = new GregorianCalendar(1996, 1-1, 1);
	private static final Pattern OFFSET_PARAMETER = Pattern.compile("(\\d{4})-(\\d{2})-(\\d{2})");
%>
<%
	SimpleDateFormat paramDateFormat = new SimpleDateFormat("dd/mm/yyyy");
	Calendar dateStart = new GregorianCalendar( );
	dateStart.setTimeInMillis( paramDateFormat.parse(dateStartString).getTime() );
	Calendar dateEnd = new GregorianCalendar();
	dateEnd.setTimeInMillis( paramDateFormat.parse(dateEndString).getTime() );
%>
<%-- Define the default end date --%>
<%
  Calendar DATE_END = new GregorianCalendar();
  DATE_END.set( Calendar.YEAR, DATE_END.get(Calendar.YEAR) );
  DATE_END.set( Calendar.MONTH, 12-1 );
  DATE_END.set( Calendar.DAY_OF_MONTH, 10 );
  DATE_END.set( Calendar.HOUR_OF_DAY, 23 );
  DATE_END.set( Calendar.MINUTE, 59 );
  DATE_END.set( Calendar.SECOND, 59 );

  try {
        String offsetDateString = getServletContext().getInitParameter("embargo-offset");

        Matcher offsetMatcher = OFFSET_PARAMETER.matcher( offsetDateString );
        offsetMatcher.matches();
        int offsetYear = Integer.parseInt(offsetMatcher.group(1));
        int offsetMonth = Integer.parseInt(offsetMatcher.group(2));
        int offsetDay = Integer.parseInt(offsetMatcher.group(3));

        DATE_END.set(Calendar.YEAR, DATE_END.get(Calendar.YEAR) - offsetYear);
        DATE_END.set(Calendar.MONTH, DATE_END.get(Calendar.MONTH) - offsetMonth);
        DATE_END.set(Calendar.DAY_OF_MONTH, DATE_END.get(Calendar.DAY_OF_MONTH) - offsetDay );
  } catch(IllegalStateException e) {
        // Set the default embargo period to: 1 year
        DATE_END.set( Calendar.YEAR, DATE_END.get(Calendar.YEAR) - 1);
  } catch(NullPointerException e) {
        // Set the default embargo period to: 1 year
        DATE_END.set( Calendar.YEAR, DATE_END.get(Calendar.YEAR) - 1);
  }
%>

<%---------------------- Start of HTML ---------------------------%>

<%-- TODO: define XML lang --%>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="pt-PT" lang="pt-PT">
<head>
	<title><fmt:message key='advancedImages.meta.title'/></title>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
	<%-- TODO: define META lang --%>
	<meta http-equiv="Content-Language" content="pt-PT" />
	<meta name="Keywords" content="<fmt:message key='advancedImages.meta.keywords'/>" />
	<meta name="Description" content="<fmt:message key='advancedImages.meta.description'/>" />
	<link rel="shortcut icon" href="img/logo-16.jpg" type="image/x-icon" />
	<link rel="stylesheet" title="Estilo principal" type="text/css" href="css/style.css"  media="all" />
	<link rel="stylesheet" type="text/css" href="css/jquery-ui-1.7.2.custom.css" />
	<script type="text/javascript">
		var minDate = new Date(<%=DATE_START.getTimeInMillis()%>);
		var maxDate = new Date(<%=DATE_END.getTimeInMillis()%>);
	</script>
	<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
	<script type="text/javascript" src="js/ui.datepicker.js"></script>
    <% if (language.equals("pt")) { /* load PT i18n for datepicker */ %>
	<script type="text/javascript" src="js/ui.datepicker-pt-BR.js"></script>
    <% } %>
	<script type="text/javascript" src="js/configs.js"></script>
</head>
<body>
	<%@ include file="include/topbar.jsp" %>
	<div class="wrap">
		<div id="main">
			<div id="header">
				<div id="logo">
					<a href="index.jsp" title="<fmt:message key='header.logo.link'/>">
						<img src="img/logo-<%=language%>.png" alt="<fmt:message key='header.logo.alt'/>" width="125" height="90" />
					</a>
				</div>
				<div id="info-texto-termos">
					<h1><fmt:message key='advancedImages.title'/></h1>
					<h2><fmt:message key='advancedImages.subtitle'/></h2>
				</div>
			</div>
			<div id="conteudo-pesquisa">
				<form method="get" action="images.jsp">
					<input type="hidden" name="l" value="<%= language %>" />
					<div class="pesquisar-por">
	                                	<p class="titulo"><fmt:message key='advancedImages.form-title'/></p>
	                                        <input type="submit" value="<fmt:message key='advancedImages.submit'/>" alt="<fmt:message key='advancedImages.submit'/>" class="search-submit" name="btnSubmitTop" id="btnSubmitTop" accesskey="e" />
	                                </div>
					<fieldset id="words">
						<legend><fmt:message key='advancedImages.terms'/></legend>
						<div class="box-content">
							<div id="label-palavras-1">
								<label for="adv_and"><fmt:message key='advancedImages.terms.all'/></label>
								<div class="withTip">
									<input type="text" id="adv_and" name="adv_and" value="<%=and.toString()%>" />
									<br />
									<span class="tip"><fmt:message key='advancedImages.terms.all.hint'/></span>
								</div>
								<div class="clear"></div>
							</div>

							<div id="label-palavras-2">
								<label for="adv_phr"><fmt:message key='advancedImages.terms.phrase'/></label>
								<div class="withTip">
									<input type="text" id="adv_phr" name="adv_phr" value="<%=phrase.toString()%>" />
									<br />
									<span class="tip"><fmt:message key='advancedImages.terms.phrase.hint'/></span>
								</div>
								<div class="clear"></div>
							</div>

							<div id="label-palavras-3">
								<label for="adv_not"><fmt:message key='advancedImages.terms.not'/></label>
								<div class="withTip">
									<input type="text" id="adv_not" name="adv_not" value="<%=not.toString()%>" />
									<br />
									<span class="tip"><fmt:message key='advancedImages.terms.not.hint'/></span>
								</div>
							</div>
						</div>
					</fieldset>

					<fieldset id="date">
						<legend><fmt:message key='advancedImages.date'/></legend>
						<div class="box-content">
							<div id="label-data-1">
								<label for="dateStart_top"><fmt:message key='advancedImages.date.from'/></label>
								<div class="withTip">
									<input type="text" id="dateStart_top" name="dateStart" value="<%=dateStartString%>" />
								</div>

								<label id="labelDateEnd" for="dateEnd_top"><fmt:message key='advancedImages.date.to'/></label>
								<div class="withTip">
									<input type="text" id="dateEnd_top" name="dateEnd" value="<%=dateEndString%>" />
								</div>
							</div>
							<div id="label-data-2">
								<label for="sort"><fmt:message key='advancedImages.sort'/></label>
								<select id="sort" name="sort">
									<%
									if (sortType == null) {		// use the default sorting behavior %>
										<option value="relevance" selected="selected"><fmt:message key="advancedImages.sort.relevance"/></option>
									<% } else{ %>
										<option value="relevance"><fmt:message key="advancedImages.sort.relevance"/></option>
									<% }
									if ("date".equals(sortType) && sortReverse) { %>
										<option value="new" selected="selected"><fmt:message key='advancedImages.sort.new'/></option>
									<%} else {%>
										<option value="new"><fmt:message key='advancedImages.sort.new'/></option>
									<%}%>
									<%
									if ("date".equals(sortType) && !sortReverse) {%>
										<option value="old" selected="selected"><fmt:message key='advancedImages.sort.old'/></option>
									<%} else {%>
										<option value="old"><fmt:message key='advancedImages.sort.old'/></option>
									<%}%>
								</select>
							</div>
						</div>
					</fieldset>

					<fieldset id="size">
						<legend><fmt:message key='advancedImages.size'/></legend>
						<div class="box-content">
							<div id="label-size-1">
								<label for="sizeType"><fmt:message key='advancedImages.size.label'/></label> <br></br>
								<%
									if (imagesSize == null /*|| "all".equals(imagesFormat)*/) { %>
										<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="size" value="icon" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.icon'/></span><br /></div>										
										<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="small" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.small'/></span> <br /></div>
										<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="medium" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.medium'/></span> <br /></div>
										<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="large" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.large'/></span> <br/></div>
									<% } else { %>
											<% if(imagesSize.contains("icon")){ %>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="size" value="icon" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.icon'/></span><br /></div>
											<% } else {%>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="size" value="icon" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.icon'/></span><br /></div>		
											<% } %>
											<% if(imagesSize.contains("small")){ %>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="small" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.small'/></span> <br /></div>	
											<% } else {%>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="small" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.small'/></span> <br /></div>	
											<% } %>	
											<% if(imagesSize.contains("medium")){ %>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="medium" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.medium'/></span> <br /></div>
											<% } else {%>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="medium" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.medium'/></span> <br /></div>
											<% } %>		
											<% if(imagesSize.contains("large")){ %>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="large" checked="checked" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.large'/></span> <br/></div>
											<% } else {%>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="size" value="large" /><span class="imageFormatLabel"><fmt:message key='advancedImages.imagesFormat.large'/></span> <br/></div>
											<% } %>																				
									<%}%>																						
									
							</div>
						</div>
					</fieldset>

					<fieldset id="safe">
						<legend>Pesquisa Segura</legend>
						<div class="box-content">
							<div id="label-size-1">								
										<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="safe" value="true" checked="checked"><span class="imageFormatLabel">Mostrar imagens seguras</span></div>										
										<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="unsafe" value="true"><span class="imageFormatLabel">Mostrar imagens inseguras</span></div>
							</div>
						</div>
					</fieldset>					

					<fieldset id="format">
						<legend><fmt:message key='advancedImages.format'/></legend>
						<div class="box-content">
							<div id="label-format-1">
								<label for="formatType"><fmt:message key='advancedImages.format.label'/></label> <br></br>

								<% if (format == null /*|| "all".equals(format)*/) { %>
										<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="jpeg" checked="checked" /><span class="imageFormatLabel">Joint Photographic Experts Group (.jpeg)</span><br /></div>										
										<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="format" value="png" checked="checked" /><span class="imageFormatLabel">Portable Network Graphics (.png)</span> <br /></div>
										<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="format" value="gif" checked="checked" /><span class="imageFormatLabel">Graphics Interchange Format (.gif)</span> <br /></div>
										<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="format" value="tiff" checked="checked" /><span class="imageFormatLabel">Tagged Image File Format (.tiff)</span> <br/></div>
									<% } else { %>
											<% if(format.contains("jpeg")){ %>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="jpeg" checked="checked" /><span class="imageFormatLabel">Joint Photographic Experts Group (.jpeg)</span><br /></div>
											<% } else {%>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="jpeg" /><span class="imageFormatLabel">Joint Photographic Experts Group (.jpeg)</span><br /></div>
											<% } %>			
											<% if(format.contains("png")){ %>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="png" checked="checked" /><span class="imageFormatLabel">Portable Network Graphics (.png)</span><br /></div>
											<% } else {%>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="png" /><span class="imageFormatLabel">Portable Network Graphics (.png)</span><br /></div>
											<% } %>	
											<% if(format.contains("gif")){ %>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="gif" checked="checked" /><span class="imageFormatLabel">Graphics Interchange Format (.gif)</span><br /></div>
											<% } else {%>
												<div class="imageSizeDiv"> <input class="imageCheckbox" type="checkbox" name="format" value="gif" /><span class="imageFormatLabel">Graphics Interchange Format (.gif)</span><br /></div>
											<% } %>	
											<% if(format.contains("tiff")){ %>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="format" value="tiff" checked="checked" /><span class="imageFormatLabel">Tagged Image File Format (.tiff)</span> <br/></div>
											<% } else {%>
												<div class="imageSizeDiv"><input class="imageCheckbox" type="checkbox" name="format" value="tiff" /><span class="imageFormatLabel">Tagged Image File Format (.tiff)</span> <br/></div>
											<% } %>														

									<% } %>



							</div>
						</div>
					</fieldset>
					
					<fieldset id="domains">
						<legend><fmt:message key='advanced.website'/></legend>
						<div class="box-content">
							<div id="label-domains-1">
								<label for="site"><fmt:message key='advanced.website.label'/></label>
								<div class="withTip">
									<input type="text" id="site" name="site" value="<%=site%>" /><br />
									<span class="tip"><fmt:message key='advanced.website.hint'/></span>
								</div>
								<div class="clear"></div>
							</div>
						</div>
					</fieldset>

					<fieldset id="num_result_fieldset">
						<legend><fmt:message key='advanced.results'/></legend>
						<div class="box-content">
							<div id="label-num-result-fieldset-1">
								<label for="num-result"><fmt:message key='advanced.results.label'/></label>
								<select id="num-result" name="hitsPerPage">
								<%
								int[] hitsPerPageValues = {10, 20, 30, 50, 100};
								for (int i=0; i < hitsPerPageValues.length; i++) {
									if (hitsPerPage == hitsPerPageValues[i]) {
										out.print("<option selected=\"selected\">"+ hitsPerPageValues[i] +"</option>");
									} else {
										out.print("<option>"+ hitsPerPageValues[i] +"</option>");
									}
								}%>
								</select>
								<fmt:message key='advanced.results.label2'/>
							</div>
						</div>
					</fieldset>
					<div id="bottom-submit">
						<input type="submit" value="<fmt:message key='advancedImages.submit'/>" alt="<fmt:message key='advancedImages.submit'/>" class="search-submit" name="btnSubmitBottom" id="btnSubmitBottom" accesskey="e" />
					</div>
				</form>
                        </div>
                </div>
<%-- end copy --%>
	</div>
<%@include file="include/footer.jsp" %>
<%@include file="include/analytics.jsp" %>
</body>
</html>

<%@include file="include/logging.jsp" %>
