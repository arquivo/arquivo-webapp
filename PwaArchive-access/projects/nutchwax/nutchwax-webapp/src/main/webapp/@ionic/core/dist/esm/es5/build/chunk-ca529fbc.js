import{createGesture}from"./chunk-f56eaea8.js";function createSwipeBackGesture(e,t,r,a,n,i){var o=e.ownerDocument.defaultView;return createGesture({el:e,queue:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:function(e){return e.startX<=50&&r()},onStart:a,onMove:function(e){n(e.deltaX/o.innerWidth)},onEnd:function(e){var t=o.innerWidth,r=e.deltaX/t,a=e.velocityX,n=a>=0&&(a>.2||e.deltaX>t/2),u=(n?1-r:r)*t,c=0;if(u>5){var s=u/Math.abs(a);c=Math.min(s,300)}i(n,r,c)}})}export{createSwipeBackGesture};