import{r as e,c as t,d as s,h as i,e as n}from"./p-ee9b7068.js";import{b as r}from"./p-1074393c.js";import{d as o,b as a,c as h}from"./p-94c4865f.js";import{b as c}from"./p-d102c9d1.js";import{a as u}from"./p-25340090.js";import{l,t as v,s as d}from"./p-247b4897.js";const m=1,p=2,g=3;class w{constructor(e,t){this.component=e,this.params=t,this.state=m}async init(e){if(this.state=p,!this.element){const t=this.component;this.element=await u(this.delegate,e,t,["ion-page","ion-page-invisible"],this.params)}}_destroy(){c(this.state!==g,"view state must be ATTACHED");const e=this.element;e&&(this.delegate?this.delegate.removeViewFromDom(e.parentElement,e):e.remove()),this.nav=void 0,this.state=g}}function f(e,t,s){if(!e)return!1;if(e.component!==t)return!1;const i=e.params;if(i===s)return!0;if(!i&&!s)return!0;if(!i||!s)return!1;const n=Object.keys(i),r=Object.keys(s);if(n.length!==r.length)return!1;for(const e of n)if(i[e]!==s[e])return!1;return!0}function y(e,t){return e?e instanceof w?e:new w(e,t):null}class S{constructor(s){e(this,s),this.transInstr=[],this.useRouter=!1,this.isTransitioning=!1,this.destroyed=!1,this.views=[],this.animated=!0,this.ionNavWillLoad=t(this,"ionNavWillLoad",7),this.ionNavWillChange=t(this,"ionNavWillChange",3),this.ionNavDidChange=t(this,"ionNavDidChange",3)}swipeGestureChanged(){this.gesture&&this.gesture.setDisabled(!0!==this.swipeGesture)}rootChanged(){void 0!==this.root&&(this.useRouter||this.setRoot(this.root,this.rootParams))}componentWillLoad(){if(this.useRouter=!!document.querySelector("ion-router")&&!this.el.closest("[no-router]"),void 0===this.swipeGesture){const e=s(this);this.swipeGesture=r.getBoolean("swipeBackEnabled","ios"===e)}this.ionNavWillLoad.emit()}async componentDidLoad(){this.rootChanged(),this.gesture=(await __sc_import_ionic("./p-854041d9.js")).createSwipeBackGesture(this.el,this.canStart.bind(this),this.onStart.bind(this),this.onMove.bind(this),this.onEnd.bind(this)),this.swipeGestureChanged()}componentDidUnload(){for(const e of this.views)l(e.element,o),e._destroy();this.gesture&&(this.gesture.destroy(),this.gesture=void 0),this.transInstr.length=this.views.length=0,this.destroyed=!0}push(e,t,s,i){return this.queueTrns({insertStart:-1,insertViews:[{page:e,params:t}],opts:s},i)}insert(e,t,s,i,n){return this.queueTrns({insertStart:e,insertViews:[{page:t,params:s}],opts:i},n)}insertPages(e,t,s,i){return this.queueTrns({insertStart:e,insertViews:t,opts:s},i)}pop(e,t){return this.queueTrns({removeStart:-1,removeCount:1,opts:e},t)}popTo(e,t,s){const i={removeStart:-1,removeCount:-1,opts:t};return"object"==typeof e&&e.component?(i.removeView=e,i.removeStart=1):"number"==typeof e&&(i.removeStart=e+1),this.queueTrns(i,s)}popToRoot(e,t){return this.queueTrns({removeStart:1,removeCount:-1,opts:e},t)}removeIndex(e,t=1,s,i){return this.queueTrns({removeStart:e,removeCount:t,opts:s},i)}setRoot(e,t,s,i){return this.setPages([{page:e,params:t}],s,i)}setPages(e,t,s){return null==t&&(t={}),!0!==t.animated&&(t.animated=!1),this.queueTrns({insertStart:0,insertViews:e,removeStart:0,removeCount:-1,opts:t},s)}setRouteId(e,t,s){const i=this.getActiveSync();if(f(i,e,t))return Promise.resolve({changed:!1,element:i.element});let n;const r=new Promise(e=>n=e);let o;const a={updateURL:!1,viewIsReady:e=>{let t;const s=new Promise(e=>t=e);return n({changed:!0,element:e,markVisible:async()=>{t(),await o}}),s}};if("root"===s)o=this.setRoot(e,t,a);else{const i=this.views.find(s=>f(s,e,t));i?o=this.popTo(i,Object.assign({},a,{direction:"back"})):"forward"===s?o=this.push(e,t,a):"back"===s&&(o=this.setRoot(e,t,Object.assign({},a,{direction:"back",animated:!0})))}return r}async getRouteId(){const e=this.getActiveSync();return e?{id:e.element.tagName,params:e.params,element:e.element}:void 0}getActive(){return Promise.resolve(this.getActiveSync())}getByIndex(e){return Promise.resolve(this.views[e])}canGoBack(e){return Promise.resolve(this.canGoBackSync(e))}getPrevious(e){return Promise.resolve(this.getPreviousSync(e))}getLength(){return this.views.length}getActiveSync(){return this.views[this.views.length-1]}canGoBackSync(e=this.getActiveSync()){return!(!e||!this.getPreviousSync(e))}getPreviousSync(e=this.getActiveSync()){if(!e)return;const t=this.views,s=t.indexOf(e);return s>0?t[s-1]:void 0}queueTrns(e,t){if(this.isTransitioning&&null!=e.opts&&e.opts.skipIfBusy)return Promise.resolve(!1);const s=new Promise((t,s)=>{e.resolve=t,e.reject=s});return e.done=t,e.insertViews&&0===e.insertViews.length&&(e.insertViews=void 0),this.transInstr.push(e),this.nextTrns(),s}success(e,t){if(this.destroyed)this.fireError("nav controller was destroyed",t);else if(t.done&&t.done(e.hasCompleted,e.requiresTransition,e.enteringView,e.leavingView,e.direction),t.resolve(e.hasCompleted),!1!==t.opts.updateURL&&this.useRouter){const t=document.querySelector("ion-router");t&&t.navChanged("back"===e.direction?"back":"forward")}}failed(e,t){this.destroyed?this.fireError("nav controller was destroyed",t):(this.transInstr.length=0,this.fireError(e,t))}fireError(e,t){t.done&&t.done(!1,!1,e),t.reject&&!this.destroyed?t.reject(e):t.resolve(!1)}nextTrns(){if(this.isTransitioning)return!1;const e=this.transInstr.shift();return!!e&&(this.runTransition(e),!0)}async runTransition(e){try{this.ionNavWillChange.emit(),this.isTransitioning=!0,this.prepareTI(e);const t=this.getActiveSync(),s=this.getEnteringView(e,t);if(!t&&!s)throw new Error("no views in the stack to be removed");s&&s.state===m&&await s.init(this.el),this.postViewInit(s,t,e);const i=(e.enteringRequiresTransition||e.leavingRequiresTransition)&&s!==t?await this.transition(s,t,e):{hasCompleted:!0,requiresTransition:!1};this.success(i,e),this.ionNavDidChange.emit()}catch(t){this.failed(t,e)}this.isTransitioning=!1,this.nextTrns()}prepareTI(e){const t=this.views.length;if(e.opts=e.opts||{},void 0===e.opts.delegate&&(e.opts.delegate=this.delegate),void 0!==e.removeView){c(void 0!==e.removeStart,"removeView needs removeStart"),c(void 0!==e.removeCount,"removeView needs removeCount");const t=this.views.indexOf(e.removeView);if(t<0)throw new Error("removeView was not found");e.removeStart+=t}void 0!==e.removeStart&&(e.removeStart<0&&(e.removeStart=t-1),e.removeCount<0&&(e.removeCount=t-e.removeStart),e.leavingRequiresTransition=e.removeCount>0&&e.removeStart+e.removeCount===t),e.insertViews&&((e.insertStart<0||e.insertStart>t)&&(e.insertStart=t),e.enteringRequiresTransition=e.insertStart===t);const s=e.insertViews;if(!s)return;c(s.length>0,"length can not be zero");const i=s.map(e=>e instanceof w?e:"page"in e?y(e.page,e.params):y(e,void 0)).filter(e=>null!==e);if(0===i.length)throw new Error("invalid views to insert");for(const t of i){t.delegate=e.opts.delegate;const s=t.nav;if(s&&s!==this)throw new Error("inserted view was already inserted");if(t.state===g)throw new Error("inserted view was already destroyed")}e.insertViews=i}getEnteringView(e,t){const s=e.insertViews;if(void 0!==s)return s[s.length-1];const i=e.removeStart;if(void 0!==i){const s=this.views,n=i+e.removeCount;for(let e=s.length-1;e>=0;e--){const r=s[e];if((e<i||e>=n)&&r!==t)return r}}}postViewInit(e,t,s){c(t||e,"Both leavingView and enteringView are null"),c(s.resolve,"resolve must be valid"),c(s.reject,"reject must be valid");const i=s.opts,n=s.insertViews,r=s.removeStart,u=s.removeCount;let v;if(void 0!==r&&void 0!==u){c(r>=0,"removeStart can not be negative"),c(u>=0,"removeCount can not be negative"),v=[];for(let s=0;s<u;s++){const i=this.views[s+r];i&&i!==e&&i!==t&&v.push(i)}i.direction=i.direction||"back"}const d=this.views.length+(void 0!==n?n.length:0)-(void 0!==u?u:0);if(c(d>=0,"final balance can not be negative"),0===d)throw console.warn("You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.",this,this.el),new Error("navigation stack needs at least one root page");if(n){let e=s.insertStart;for(const t of n)this.insertViewAt(t,e),e++;s.enteringRequiresTransition&&(i.direction=i.direction||"forward")}if(v&&v.length>0){for(const e of v)l(e.element,a),l(e.element,h),l(e.element,o);for(const e of v)this.destroyView(e)}}async transition(e,t,i){const n=i.opts,o=n.progressAnimation?e=>this.sbAni=e:void 0,a=s(this),h=e.element,c=t&&t.element,u=Object.assign({mode:a,showGoBack:this.canGoBackSync(e),baseEl:this.el,animationBuilder:this.animation||n.animationBuilder||r.get("navAnimation"),progressCallback:o,animated:this.animated&&r.getBoolean("animated",!0),enteringEl:h,leavingEl:c},n),{hasCompleted:l}=await v(u);return this.transitionFinish(l,e,t,n)}transitionFinish(e,t,s,i){const n=e?t:s;return n&&this.cleanup(n),{hasCompleted:e,requiresTransition:!0,enteringView:t,leavingView:s,direction:i.direction}}insertViewAt(e,t){const s=this.views,i=s.indexOf(e);i>-1?(c(e.nav===this,"view is not part of the nav"),s.splice(t,0,s.splice(i,1)[0])):(c(!e.nav,"nav is used"),e.nav=this,s.splice(t,0,e))}removeView(e){c(e.state===p||e.state===g,"view state should be loaded or destroyed");const t=this.views,s=t.indexOf(e);c(s>-1,"view must be part of the stack"),s>=0&&t.splice(s,1)}destroyView(e){e._destroy(),this.removeView(e)}cleanup(e){if(this.destroyed)return;const t=this.views,s=t.indexOf(e);for(let e=t.length-1;e>=0;e--){const i=t[e],n=i.element;e>s?(l(n,o),this.destroyView(i)):e<s&&d(n,!0)}}canStart(){return!!this.swipeGesture&&!this.isTransitioning&&0===this.transInstr.length&&this.canGoBackSync()}onStart(){this.queueTrns({removeStart:-1,removeCount:1,opts:{direction:"back",progressAnimation:!0}},void 0)}onMove(e){this.sbAni&&this.sbAni.progressStep(e)}onEnd(e,t,s){this.sbAni&&this.sbAni.progressEnd(e,t,s)}render(){return i("slot",null)}get el(){return n(this)}static get watchers(){return{swipeGesture:["swipeGestureChanged"],root:["rootChanged"]}}static get style(){return":host{left:0;right:0;top:0;bottom:0;position:absolute;contain:layout size style;overflow:hidden;z-index:0}"}}class b{constructor(t){e(this,t)}pop(){const e=this.el.closest("ion-nav");e&&e.pop({skipIfBusy:!0})}get el(){return n(this)}}class T{constructor(t){e(this,t)}push(){const e=this.el.closest("ion-nav"),t=this.component;e&&void 0!==t&&e.push(t,this.componentProps,{skipIfBusy:!0})}get el(){return n(this)}}class V{constructor(t){e(this,t)}push(){const e=this.el.closest("ion-nav"),t=this.component;e&&void 0!==t&&e.setRoot(t,this.componentProps,{skipIfBusy:!0})}get el(){return n(this)}}export{S as ion_nav,b as ion_nav_pop,T as ion_nav_push,V as ion_nav_set_root};