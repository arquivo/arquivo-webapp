import{h}from"../ionic.core.js";import{c as createColorClasses}from"./chunk-7c632336.js";var TabBar=function(){function e(){this.keyboardVisible=!1,this.translucent=!1}return e.prototype.selectedTabChanged=function(){this.ionTabBarChanged.emit({tab:this.selectedTab})},e.prototype.onKeyboardWillHide=function(){var e=this;setTimeout(function(){return e.keyboardVisible=!1},50)},e.prototype.onKeyboardWillShow=function(){"top"!==this.el.getAttribute("slot")&&(this.keyboardVisible=!0)},e.prototype.componentWillLoad=function(){this.selectedTabChanged()},e.prototype.hostData=function(){var e=this.translucent,t=this.keyboardVisible;return{role:"tablist","aria-hidden":t?"true":null,class:Object.assign({},createColorClasses(this.color),{"tab-bar-translucent":e,"tab-bar-hidden":t})}},e.prototype.render=function(){return h("slot",null)},Object.defineProperty(e,"is",{get:function(){return"ion-tab-bar"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{color:{type:String,attr:"color"},doc:{context:"document"},el:{elementRef:!0},keyboardVisible:{state:!0},mode:{type:String,attr:"mode"},queue:{context:"queue"},selectedTab:{type:String,attr:"selected-tab",watchCallbacks:["selectedTabChanged"]},translucent:{type:Boolean,attr:"translucent"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"ionTabBarChanged",method:"ionTabBarChanged",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"listeners",{get:function(){return[{name:"window:keyboardWillHide",method:"onKeyboardWillHide"},{name:"window:keyboardWillShow",method:"onKeyboardWillShow"}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return":host{padding-left:var(--ion-safe-area-left);padding-right:var(--ion-safe-area-right);display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:auto;padding-bottom:var(--ion-safe-area-bottom,0);border-top:var(--border);background:var(--background);color:var(--color);text-align:center;contain:strict;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:10;-webkit-box-sizing:content-box!important;box-sizing:content-box!important}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--ion-safe-area-left);padding-inline-start:var(--ion-safe-area-left);-webkit-padding-end:var(--ion-safe-area-right);padding-inline-end:var(--ion-safe-area-right)}}:host(.ion-color),:host(.ion-color) ::slotted(ion-tab-button){background:var(--ion-color-base);color:rgba(var(--ion-color-contrast-rgb),.7)}:host(.ion-color) ::slotted(ion-tab-button){--background-focused:var(--ion-color-shade);--color-selected:var(--ion-color-contrast)}:host(.ion-color) ::slotted(.tab-selected){color:var(--ion-color-contrast)}:host([slot=top]){padding-bottom:0;border-top:0;border-bottom:var(--border)}:host(.tab-bar-hidden){display:none!important}:host{--background:var(--ion-tab-bar-background,var(--ion-background-color,#fff));--background-focused:var(--ion-tab-bar-background-focused,#e0e0e0);--border:0.55px solid var(--ion-tab-bar-border-color,var(--ion-border-color,var(--ion-color-step-150,rgba(0,0,0,0.2))));--color:var(--ion-tab-bar-color,var(--ion-color-step-450,#8c8c8c));--color-selected:var(--ion-tab-bar-color-activated,var(--ion-color-primary,#3880ff));height:50px}:host(.tab-bar-translucent){background-color:rgba(var(--ion-color-base-rgb),.8);-webkit-backdrop-filter:saturate(210%) blur(20px);backdrop-filter:saturate(210%) blur(20px)}"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"styleMode",{get:function(){return"ios"},enumerable:!0,configurable:!0}),e}(),TabButton=function(){function e(){this.selected=!1,this.disabled=!1}return e.prototype.onTabBarChanged=function(e){this.selected=this.tab===e.detail.tab},e.prototype.onClick=function(e){void 0!==this.tab&&(this.disabled||this.ionTabButtonClick.emit({tab:this.tab,href:this.href,selected:this.selected}),e.preventDefault())},e.prototype.componentWillLoad=function(){void 0===this.layout&&(this.layout=this.config.get("tabButtonLayout","icon-top"))},Object.defineProperty(e.prototype,"hasLabel",{get:function(){return!!this.el.querySelector("ion-label")},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"hasIcon",{get:function(){return!!this.el.querySelector("ion-icon")},enumerable:!0,configurable:!0}),e.prototype.hostData=function(){var e,t=this,n=t.hasIcon,o=t.hasLabel,r=t.selected,a=t.tab;return{role:"tab","aria-selected":r?"true":null,id:void 0!==a?"tab-button-"+a:null,class:(e={"tab-selected":r,"tab-disabled":t.disabled,"tab-has-label":o,"tab-has-icon":n,"tab-has-label-only":o&&!n,"tab-has-icon-only":n&&!o},e["tab-layout-"+t.layout]=!0,e["ion-activatable"]=!0,e)}},e.prototype.render=function(){var e=this.mode;return h("a",{href:this.href},h("slot",null),"md"===e&&h("ion-ripple-effect",{type:"unbounded"}))},Object.defineProperty(e,"is",{get:function(){return"ion-tab-button"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{config:{context:"config"},disabled:{type:Boolean,attr:"disabled"},doc:{context:"document"},el:{elementRef:!0},href:{type:String,attr:"href"},layout:{type:String,attr:"layout",mutable:!0},mode:{type:String,attr:"mode"},queue:{context:"queue"},selected:{type:Boolean,attr:"selected",mutable:!0},tab:{type:String,attr:"tab"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"ionTabButtonClick",method:"ionTabButtonClick",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"listeners",{get:function(){return[{name:"parent:ionTabBarChanged",method:"onTabBarChanged"},{name:"click",method:"onClick"}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return":host{--ripple-color:var(--color-selected);-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background:var(--background);color:var(--color)}:host,a{height:100%}a{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;border:0;outline:none;background:transparent;text-decoration:none;cursor:pointer;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-drag:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){a{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}a:focus-visible{background:var(--background-focused)}\@media (any-hover:hover){a:hover{color:var(--color-selected)}}:host(.tab-selected){color:var(--color-selected)}:host(.tab-hidden){display:none!important}:host(.tab-disabled){pointer-events:none;opacity:.4}::slotted(ion-icon),::slotted(ion-label){display:block;-ms-flex-item-align:center;align-self:center;max-width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box}::slotted(ion-label){-ms-flex-order:0;order:0}::slotted(ion-icon){-ms-flex-order:-1;order:-1;height:1em}:host(.tab-has-label-only) ::slotted(ion-label){white-space:normal}::slotted(ion-badge){-webkit-box-sizing:border-box;box-sizing:border-box;position:absolute;z-index:1}:host(.tab-layout-icon-start){-ms-flex-direction:row;flex-direction:row}:host(.tab-layout-icon-end){-ms-flex-direction:row-reverse;flex-direction:row-reverse}:host(.tab-layout-icon-bottom){-ms-flex-direction:column-reverse;flex-direction:column-reverse}:host(.tab-layout-icon-hide) ::slotted(ion-icon),:host(.tab-layout-label-hide) ::slotted(ion-label){display:none}ion-ripple-effect{color:var(--ripple-color)}:host{--padding-top:0;--padding-end:2px;--padding-bottom:0;--padding-start:2px;max-width:240px;font-size:10px}:host(.tab-has-label-only) ::slotted(ion-label){margin-left:0;margin-right:0;margin-top:2px;margin-bottom:2px;font-size:12px;font-size:14px;line-height:1.1}::slotted(ion-badge){padding-left:6px;padding-right:6px;padding-top:1px;padding-bottom:1px;left:calc(50% + 6px);top:4px;height:auto;font-size:12px;line-height:16px}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){::slotted(ion-badge){padding-left:unset;padding-right:unset;-webkit-padding-start:6px;padding-inline-start:6px;-webkit-padding-end:6px;padding-inline-end:6px}}:host-context([dir=rtl]) ::slotted(ion-badge){right:calc(50% + 6px)}::slotted(ion-icon){margin-top:4px;font-size:30px}::slotted(ion-icon:before){vertical-align:top}::slotted(ion-label){margin-top:0;margin-bottom:1px;min-height:11px}:host(.tab-layout-icon-end) ::slotted(ion-label),:host(.tab-layout-icon-hide) ::slotted(ion-label),:host(.tab-layout-icon-start) ::slotted(ion-label){margin-top:2px;margin-bottom:2px;font-size:14px;line-height:1.1}:host(.tab-layout-icon-end) ::slotted(ion-icon),:host(.tab-layout-icon-start) ::slotted(ion-icon){min-width:24px;height:26px;margin-top:2px;margin-bottom:1px;font-size:24px}:host(.tab-layout-icon-bottom) ::slotted(ion-badge){left:calc(50% + 12px)}:host([dir=rtl].tab-layout-icon-bottom) ::slotted(ion-badge){right:calc(50% + 12px)}:host(.tab-layout-icon-bottom) ::slotted(ion-icon){margin-top:0;margin-bottom:1px}:host(.tab-layout-icon-bottom) ::slotted(ion-label){margin-top:4px}:host(.tab-layout-icon-end) ::slotted(ion-badge),:host(.tab-layout-icon-start) ::slotted(ion-badge){left:calc(50% + 35px);top:10px}:host([dir=rtl].tab-layout-icon-end) ::slotted(ion-badge),:host([dir=rtl].tab-layout-icon-start) ::slotted(ion-badge){right:calc(50% + 35px)}:host(.tab-has-label-only) ::slotted(ion-badge),:host(.tab-layout-icon-hide) ::slotted(ion-badge){left:calc(50% + 30px);top:10px}:host([dir=rtl].tab-has-label-only) ::slotted(ion-badge),:host([dir=rtl].tab-layout-icon-hide) ::slotted(ion-badge){right:calc(50% + 30px)}:host(.tab-has-icon-only) ::slotted(ion-badge),:host(.tab-layout-label-hide) ::slotted(ion-badge){top:10px}:host(.tab-layout-label-hide) ::slotted(ion-icon){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"styleMode",{get:function(){return"ios"},enumerable:!0,configurable:!0}),e}();export{TabBar as IonTabBar,TabButton as IonTabButton};