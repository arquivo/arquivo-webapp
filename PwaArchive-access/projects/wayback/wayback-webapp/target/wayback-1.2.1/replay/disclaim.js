
var interceptRunAlready = false;
function intercept_js_href_iawm(destination) {
	if(!interceptRunAlready &&top.location.href != destination) {
		interceptRunAlready = true;
		top.location.href = sWayBackCGI+xResolveUrl(destination);
	}
} 
// ie triggers
href_iawmWatcher = document.createElement("a");
top.location.href_iawm = top.location.href;
if(href_iawmWatcher.setExpression) {
	href_iawmWatcher.setExpression("dummy","intercept_js_href_iawm(top.location.href_iawm)");
}
// mozilla triggers
function intercept_js_moz(prop,oldval,newval) {
	intercept_js_href_iawm(newval);
	return newval;
}
if(top.location.watch) {
	top.location.watch("href_iawm",intercept_js_moz);
}

var notice = 
     "<style>" +
     "#replay_bar a:link, #replay_bar a:hover {font-family: Arial, Helvetica, sans-serfif !important; font-weight: bold !important; color: blue !important; text-decoration:underline !important; font-size: 1em !important;}" +
     "#replay_bar b {color: black !important}" +
     "</style>" +
     "<div id=\"replay_bar\" style='" +
     "position:relative;z-index:99999;"+
     "border:1px solid;color:black;background-color:lightYellow;font-size:12px;font-family:sans-serif;padding:5px'>" +
     "<a href=\"javascript:goHomepage();\"><img src=\""+ logoPath +"\" style=\"border-style: none; vertical-align: middle; margin-right: 0.4em\" alt=\""+ logoAltText +"\"/></a>" +  
     wmNotice +
     " [ <a style='font-weight: normal !important' href=\"javascript:void(top.disclaimElem.style.display='none')\">" + wmHideNotice + "</a> ]" +
     "</div>";

function getFrameArea(frame) {
	if(frame.innerWidth) return frame.innerWidth * frame.innerHeight;
	if(frame.document.documentElement && frame.document.documentElement.clientHeight) return frame.document.documentElement.clientWidth * frame.document.documentElement.clientHeight;
	if(frame.document.body) return frame.document.body.clientWidth * frame.document.body.clientHeight;
	return 0;
}

function disclaim() {
	if(top!=self) {
		if(top.document.body.tagName == "BODY") {
			return;
		}
		largestArea = 0;
		largestFrame = null;
		for(i=0;i<top.frames.length;i++) {
			frame = top.frames[i];
			area = getFrameArea(frame);
			if(area > largestArea) {
				largestFrame = frame;
				largestArea = area;
			}
		}
		if(self!=largestFrame) {
			return;
		}
	}
	disclaimElem = document.createElement('div');
	disclaimElem.innerHTML = notice;
	top.disclaimElem = disclaimElem;
	document.body.insertBefore(disclaimElem,document.body.firstChild);
}
disclaim();
