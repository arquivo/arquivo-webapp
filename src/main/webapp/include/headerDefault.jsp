<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>

<meta property="og:image" content="<%=request.getContextPath()%>/img/logoFace.png"/>
<meta property="og:image:alt" content="Arquivo.pt">
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="512" />
<meta property="og:image:height" content="512" />
<meta property="og:type" content="website" />

<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Language" content="<c:out value='${locale}' />" />
<link rel="shortcut icon" href="/img/logo-16.png" type="image/x-icon" />
<meta name="theme-color" content="#1a73ba">
<%-- Windows Phone --%>
<meta name="msapplication-navbutton-color" content="#1a73ba">
<%-- iOS Safari --%>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap" rel="stylesheet" media="none" onload="if(media!='all')media='all'" /><%-- Lazy load css download --%>
<link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet" media="none" onload="if(media!='all')media='all'" /><%-- Lazy load css download --%>
<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet" media="none" onload="if(media!='all')media='all'" /><%-- Lazy load css download --%>

<link rel="shortcut icon" href="/img/logo-16.png" type="image/x-icon" />
<link rel="stylesheet" href="/css/font-awesome.min.css" />

<link rel="stylesheet" href="/css/bootstrap.min.css" />

<link rel="stylesheet" href="/static/jquery-ui-1.12.1.custom/jquery-ui.min.css" media="none" onload="if(media!='all')media='all'" /><%-- Lazy load css download --%>
<script src="/static/jquery-3.5.1.min.js"></script>
<script src="/static/jquery-ui-1.12.1.custom/jquery-ui.js"></script>

<script type="text/javascript" src="/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/js/js.cookie.js"></script>
<script type="text/javascript" src="/js/swiper.min.js"></script>

<%--- dual slider dependencies are we using this slider ? --%>
<script type="text/javascript" src="/js/nouislider.min.js"></script>
<link rel="stylesheet" href="/css/nouislider.min.css">

<script type="text/javascript" src="/js/wNumb.js"></script>

<link rel="stylesheet" href="/css/leftmenu.css" />

<link href="/css/mobiscroll.custom-2.6.2.min.css" rel="stylesheet" type="text/css" />
<script src="/js/mobiscroll.custom-2.6.2.min.js" type="text/javascript"></script>

<script type="text/javascript" src="/js/configs.js"></script>

<script type="module" src="/@ionic/core/dist/ionic/ionic.esm.js"></script>
<script type="text/javascript" nomodule="" src="/@ionic/core/dist/ionic/ionic.js"></script>

<link rel="stylesheet" href="/@ionic/core/css/ionic.bundle.css" />

<link rel="stylesheet" title="Estilo principal" type="text/css" href="/css/newStyle.css?build=<c:out value='${initParam.buildTimeStamp}'/>"  media="all" />

<script src="/js/uglipop.min.js"></script>

<script src="/static/jquery.inputmask-3.3.11/jquery.inputmask.bundle.js"></script><%-- MS Edge not loading it has module --%>

<script src="/js/arquivo.js?build=<c:out value='${initParam.buildTimeStamp}'/>"></script>

<c:if test="${empty param.showBrowserUpgradeMessage}">
	<!-- For IE <= 9 -->
	<!--[if IE]>
	<script type="text/javascript">
		alert("<fmt:message key='browser.upgrade.message'/>");
	</script>
	<![endif]-->

	<!-- For IE > 9 -->
	<script type="text/javascript">
	    if (window.navigator.msPointerEnabled) {
	        alert("<fmt:message key='browser.upgrade.message'/>");
	    }
	</script>
</c:if>
