<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<%@ taglib uri="http://jakarta.apache.org/taglibs/i18n" prefix="i18n" %>
<%
  String language = "pt";
  String locale = "pt-PT";
  String langParam = request.getParameter("l");
  if (langParam != null) {
    if (langParam.equals("en")) {
      language = langParam;
      locale = "en-US";
    }
  }
  pageContext.setAttribute("language", language);
  pageContext.setAttribute("locale", locale);
%>
<fmt:setLocale value="<%=language%>"/>
