import{r as t,c as i,f as e,d as s,h,H as n,e as a}from"./p-ee9b7068.js";import"./p-1074393c.js";import{c as o}from"./p-9d21e8e5.js";import{d as u,f as l}from"./p-d102c9d1.js";class d{constructor(e){t(this,e),this.inputId=`ion-input-${r++}`,this.didBlurAfterEdit=!1,this.hasFocus=!1,this.autocapitalize="none",this.autofocus=!1,this.clearOnEdit=!1,this.debounce=0,this.disabled=!1,this.name=this.inputId,this.readonly=!1,this.required=!1,this.spellcheck=!1,this.autoGrow=!1,this.value="",this.onInput=t=>{this.nativeInput&&(this.value=this.nativeInput.value),this.emitStyle(),this.ionInput.emit(t)},this.onFocus=()=>{this.hasFocus=!0,this.focusChange(),this.ionFocus.emit()},this.onBlur=()=>{this.hasFocus=!1,this.focusChange(),this.ionBlur.emit()},this.onKeyDown=()=>{this.checkClearOnEdit()},this.ionChange=i(this,"ionChange",7),this.ionInput=i(this,"ionInput",7),this.ionStyle=i(this,"ionStyle",7),this.ionBlur=i(this,"ionBlur",7),this.ionFocus=i(this,"ionFocus",7),this.ionInputDidLoad=i(this,"ionInputDidLoad",7),this.ionInputDidUnload=i(this,"ionInputDidUnload",7)}debounceChanged(){this.ionChange=u(this.ionChange,this.debounce)}disabledChanged(){this.emitStyle()}valueChanged(){const t=this.nativeInput,i=this.getValue();t&&t.value!==i&&(t.value=i),this.runAutoGrow(),this.emitStyle(),this.ionChange.emit({value:i})}componentWillLoad(){this.emitStyle()}componentDidLoad(){this.debounceChanged(),this.runAutoGrow(),this.ionInputDidLoad.emit()}runAutoGrow(){const t=this.nativeInput;t&&this.autoGrow&&e(()=>{t.style.height=t.scrollHeight+"px"})}componentDidUnload(){this.ionInputDidUnload.emit()}async setFocus(){this.nativeInput&&this.nativeInput.focus()}getInputElement(){return Promise.resolve(this.nativeInput)}emitStyle(){this.ionStyle.emit({interactive:!0,textarea:!0,input:!0,"interactive-disabled":this.disabled,"has-placeholder":null!=this.placeholder,"has-value":this.hasValue(),"has-focus":this.hasFocus})}checkClearOnEdit(){this.clearOnEdit&&(this.didBlurAfterEdit&&this.hasValue()&&(this.value=""),this.didBlurAfterEdit=!1)}focusChange(){this.clearOnEdit&&!this.hasFocus&&this.hasValue()&&(this.didBlurAfterEdit=!0),this.emitStyle()}hasValue(){return""!==this.getValue()}getValue(){return this.value||""}render(){const t=s(this),i=this.getValue(),e=this.inputId+"-lbl",a=l(this.el);return a&&(a.id=e),h(n,{"aria-disabled":this.disabled?"true":null,class:Object.assign({},o(this.color),{[t]:!0})},h("textarea",{class:"native-textarea",ref:t=>this.nativeInput=t,autoCapitalize:this.autocapitalize,autoFocus:this.autofocus,disabled:this.disabled,maxLength:this.maxlength,minLength:this.minlength,name:this.name,placeholder:this.placeholder||"",readOnly:this.readonly,required:this.required,spellCheck:this.spellcheck,cols:this.cols,rows:this.rows,wrap:this.wrap,onInput:this.onInput,onBlur:this.onBlur,onFocus:this.onFocus,onKeyDown:this.onKeyDown},i))}get el(){return a(this)}static get watchers(){return{debounce:["debounceChanged"],disabled:["disabledChanged"],value:["valueChanged"]}}static get style(){return".sc-ion-textarea-ios-h{--background:initial;--color:initial;--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:.5;--padding-top:0;--padding-end:0;--padding-bottom:0;--border-radius:0;display:block;position:relative;-ms-flex:1;flex:1;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;background:var(--background);color:var(--color);font-family:var(--ion-font-family,inherit);white-space:pre-wrap;z-index:2}.ion-color.sc-ion-textarea-ios-h{background:initial;color:var(--ion-color-base)}ion-item.sc-ion-textarea-ios-h, ion-item .sc-ion-textarea-ios-h{-ms-flex-item-align:baseline;align-self:baseline}ion-item.sc-ion-textarea-ios-h:not(.item-label), ion-item:not(.item-label) .sc-ion-textarea-ios-h{--padding-start:0}.native-textarea.sc-ion-textarea-ios{border-radius:var(--border-radius);margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:block;width:100%;max-width:100%;max-height:100%;border:0;outline:none;background:transparent;-webkit-box-sizing:border-box;box-sizing:border-box;resize:none;-webkit-appearance:none;-moz-appearance:none;appearance:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.native-textarea.sc-ion-textarea-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.native-textarea.sc-ion-textarea-ios::-webkit-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios::-moz-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios:-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios::-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea.sc-ion-textarea-ios::placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.native-textarea[disabled].sc-ion-textarea-ios{opacity:.4}.cloned-input.sc-ion-textarea-ios{left:0;top:0;position:absolute;pointer-events:none}[dir=rtl].sc-ion-textarea-ios-h .cloned-input.sc-ion-textarea-ios, [dir=rtl] .sc-ion-textarea-ios-h .cloned-input.sc-ion-textarea-ios, [dir=rtl].sc-ion-textarea-ios .cloned-input.sc-ion-textarea-ios{left:unset;right:unset;right:0}.sc-ion-textarea-ios-h{--padding-top:10px;--padding-end:8px;--padding-bottom:10px;--padding-start:0;font-size:inherit}.item-label-floating.sc-ion-textarea-ios-h, .item-label-floating .sc-ion-textarea-ios-h, .item-label-stacked.sc-ion-textarea-ios-h, .item-label-stacked .sc-ion-textarea-ios-h{--padding-top:8px;--padding-bottom:8px;--padding-start:0px}"}}let r=0;export{d as ion_textarea};