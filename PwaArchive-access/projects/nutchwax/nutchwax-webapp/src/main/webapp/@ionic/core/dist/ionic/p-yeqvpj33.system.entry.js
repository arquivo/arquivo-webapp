System.register(["./p-a6904dd4.system.js","./p-45890bdd.system.js","./p-94417ec5.system.js"],function(t){"use strict";var e,r,n,i,o,s;return{setters:[function(t){e=t.r;r=t.d;n=t.h;i=t.H},function(){},function(t){o=t.c;s=t.o}],execute:function(){var u=function(){function t(t){e(this,t);this.button=false;this.type="button";this.disabled=false;this.routerDirection="forward"}t.prototype.isClickable=function(){return this.href!==undefined||this.button};t.prototype.hostData=function(){var t;var e=r(this);return{class:Object.assign((t={},t[e]=true,t),o(this.color),{"card-disabled":this.disabled,"ion-activatable":this.isClickable()})}};t.prototype.__stencil_render=function(){var t=this.isClickable();if(!t){return[n("slot",null)]}var e=r(this);var i=this,o=i.href,u=i.routerDirection;var a=t?o===undefined?"button":"a":"div";var c=a==="button"?{type:this.type}:{download:this.download,href:this.href,rel:this.rel,target:this.target};return n(a,Object.assign({},c,{class:"card-native",disabled:this.disabled,onClick:function(t){return s(o,t,u)}}),n("slot",null),t&&e==="md"&&n("ion-ripple-effect",null))};t.prototype.render=function(){return n(i,this.hostData(),this.__stencil_render())};Object.defineProperty(t,"style",{get:function(){return".sc-ion-card-md-h{--ion-safe-area-left:0px;--ion-safe-area-right:0px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:block;position:relative;background:var(--background);color:var(--color);font-family:var(--ion-font-family,inherit);overflow:hidden}.ion-color.sc-ion-card-md-h{background:var(--ion-color-base)}.ion-color.sc-ion-card-md-h, .sc-ion-card-md-h.ion-color.sc-ion-card-md-s  ion-card-header , .sc-ion-card-md-h.ion-color.sc-ion-card-md-s  ion-card-subtitle , .sc-ion-card-md-h.ion-color.sc-ion-card-md-s  ion-card-title {color:var(--ion-color-contrast)}.sc-ion-card-md-s  img {display:block;width:100%}.sc-ion-card-md-s  ion-list {margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.card-disabled.sc-ion-card-md-h{cursor:default;opacity:.3;pointer-events:none}.card-native.sc-ion-card-md{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;width:100%;min-height:var(--min-height);-webkit-transition:var(--transition);transition:var(--transition);border-width:var(--border-width);border-style:var(--border-style);border-color:var(--border-color);outline:none;background:var(--background)}.card-native.sc-ion-card-md::-moz-focus-inner{border:0}a.sc-ion-card-md, button.sc-ion-card-md{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-drag:none}ion-ripple-effect.sc-ion-card-md{color:var(--ripple-color)}.sc-ion-card-md-h{--background:var(--ion-item-background,transparent);--color:var(--ion-color-step-550,#737373);margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;border-radius:4px;font-size:14px;-webkit-box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.sc-ion-card-md-h{margin-left:unset;margin-right:unset;-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px}}"},enumerable:true,configurable:true});return t}();t("ion_card",u);var a=function(){function t(t){e(this,t)}t.prototype.hostData=function(){var t;var e=r(this);return{class:(t={},t[e]=true,t["card-content-"+e]=true,t)}};t.prototype.render=function(){return n(i,this.hostData())};Object.defineProperty(t,"style",{get:function(){return"ion-card-content{display:block;position:relative}.card-content-md{padding-left:16px;padding-right:16px;padding-top:13px;padding-bottom:13px;font-size:14px;line-height:1.5}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.card-content-md{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.card-content-md h1{margin-left:0;margin-right:0;margin-top:0;margin-bottom:2px;font-size:24px;font-weight:400}.card-content-md h2{margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:16px;font-weight:400}.card-content-md h3,.card-content-md h4,.card-content-md h5,.card-content-md h6{margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:14px;font-weight:400}.card-content-md p{margin-left:0;margin-right:0;margin-top:0;margin-bottom:2px;font-size:14px;font-weight:400;line-height:1.5}ion-card-header+.card-content-md{padding-top:0}"},enumerable:true,configurable:true});return t}();t("ion_card_content",a);var c=function(){function t(t){e(this,t);this.translucent=false}t.prototype.hostData=function(){var t;var e=r(this);return{class:Object.assign({},o(this.color),(t={"card-header-translucent":this.translucent},t[e]=true,t))}};t.prototype.__stencil_render=function(){return n("slot",null)};t.prototype.render=function(){return n(i,this.hostData(),this.__stencil_render())};Object.defineProperty(t,"style",{get:function(){return":host{display:block;position:relative;background:var(--background);color:var(--color)}:host(.ion-color){background:var(--ion-color-base);color:var(--ion-color-contrast)}:host(.ion-color) ::slotted(ion-card-subtitle),:host(.ion-color) ::slotted(ion-card-title){color:currentColor}:host{padding-left:16px;padding-right:16px;padding-top:16px;padding-bottom:16px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}::slotted(ion-card-subtitle:not(:first-child)),::slotted(ion-card-title:not(:first-child)){margin-top:8px}"},enumerable:true,configurable:true});return t}();t("ion_card_header",c);var l=function(){function t(t){e(this,t)}t.prototype.hostData=function(){var t;var e=r(this);return{class:Object.assign({},o(this.color),(t={},t[e]=true,t)),role:"heading","aria-level":"3"}};t.prototype.__stencil_render=function(){return n("slot",null)};t.prototype.render=function(){return n(i,this.hostData(),this.__stencil_render())};Object.defineProperty(t,"style",{get:function(){return":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-550,#737373);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:14px;font-weight:500}"},enumerable:true,configurable:true});return t}();t("ion_card_subtitle",l);var d=function(){function t(t){e(this,t)}t.prototype.hostData=function(){var t;var e=r(this);return{class:Object.assign({},o(this.color),(t={},t[e]=true,t)),role:"heading","aria-level":"2"}};t.prototype.__stencil_render=function(){return n("slot",null)};t.prototype.render=function(){return n(i,this.hostData(),this.__stencil_render())};Object.defineProperty(t,"style",{get:function(){return":host{display:block;position:relative;color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-850,#262626);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-size:20px;font-weight:500;line-height:1.2}"},enumerable:true,configurable:true});return t}();t("ion_card_title",d)}}});