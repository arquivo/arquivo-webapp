<%@ taglib uri="http://java.sun.com/jstl/core" prefix="c" %>

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
<script src="/static/jquery-3.4.1.min.js"></script>
<script src="/static/jquery-ui-1.12.1.custom/jquery-ui.js"></script><%-- async to lazy load --%>

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

<script src="/js/arquivo.js?build=<c:out value='${initParam.buildTimeStamp}'/>"></script>
