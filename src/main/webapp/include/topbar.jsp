<!-- Top bar -->
<link rel="stylesheet" href="/css/swiper.min.css">
<link rel="stylesheet" href="/css/MainMenu.css?build=<c:out value='${initParam.buildTimeStamp}'/>" />
<script src="/js/MainMenu.js?build=<c:out value='${initParam.buildTimeStamp}'/>"></script>
<script type="text/javascript">MENU.init()</script>
<div class="main-content">
	<div class="container-fluid">
		<div class="row text-center logo-main-div">
			<a class="pull-left main-menu" id="menuButton">
				<div class="menu-button">
					<div class="bar"></div>
					<div class="bar"></div>
					<div class="bar"></div>
				</div>
				<span class="headerMenuText"></span>
				<script type="text/javascript">$('.headerMenuText').text(Content.header.menu)</script>
			</a>
			<a href="/?l=<%=language%>"><img src="/img/arquivo-logo-white.svg" id="arquivoLogo" alt="Arquivo.pt logo" class="text-center logo-main" /></a>

			<button id="replayMenuButton" class="replay-menu-button" title="Options menu" style="display: none;">
				<span class="headerOptionsText">
				</span>
				<script type="text/javascript">$('.headerOptionsText').text(Content.header.options)</script>
				<span class="headerOptionsTextDots">...</span>
			</button>

		</div>
	</div>
	<!-- NEW Style: give a black curve effect to the search box -->
	<div class="curve-background"></div>
	<div class="background-top-curve"></div>
</div>
