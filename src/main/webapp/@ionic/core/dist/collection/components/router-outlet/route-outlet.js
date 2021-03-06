import { h } from '@stencil/core';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { attachComponent, detachComponent } from '../../utils/framework-delegate';
import { transition } from '../../utils/transition';
export class RouterOutlet {
    constructor() {
        /**
         * If `true`, the router-outlet should animate the transition of components.
         */
        this.animated = true;
    }
    swipeHandlerChanged() {
        if (this.gesture) {
            this.gesture.setDisabled(this.swipeHandler === undefined);
        }
    }
    componentWillLoad() {
        this.ionNavWillLoad.emit();
    }
    async componentDidLoad() {
        this.gesture = (await import('../../utils/gesture/swipe-back')).createSwipeBackGesture(this.el, () => !!this.swipeHandler && this.swipeHandler.canStart(), () => this.swipeHandler && this.swipeHandler.onStart(), step => this.ani && this.ani.progressStep(step), (shouldComplete, step, dur) => {
            if (this.ani) {
                this.ani.progressEnd(shouldComplete, step, dur);
            }
            if (this.swipeHandler) {
                this.swipeHandler.onEnd(shouldComplete);
            }
        });
        this.swipeHandlerChanged();
    }
    componentDidUnload() {
        this.activeEl = this.activeComponent = undefined;
        if (this.gesture) {
            this.gesture.destroy();
            this.gesture = undefined;
        }
    }
    /** @internal */
    async commit(enteringEl, leavingEl, opts) {
        const unlock = await this.lock();
        let changed = false;
        try {
            changed = await this.transition(enteringEl, leavingEl, opts);
        }
        catch (e) {
            console.error(e);
        }
        unlock();
        return changed;
    }
    /** @internal */
    async setRouteId(id, params, direction) {
        const changed = await this.setRoot(id, params, {
            duration: direction === 'root' ? 0 : undefined,
            direction: direction === 'back' ? 'back' : 'forward',
        });
        return {
            changed,
            element: this.activeEl
        };
    }
    /** @internal */
    async getRouteId() {
        const active = this.activeEl;
        return active ? {
            id: active.tagName,
            element: active,
        } : undefined;
    }
    async setRoot(component, params, opts) {
        if (this.activeComponent === component) {
            return false;
        }
        // attach entering view to DOM
        const leavingEl = this.activeEl;
        const enteringEl = await attachComponent(this.delegate, this.el, component, ['ion-page', 'ion-page-invisible'], params);
        this.activeComponent = component;
        this.activeEl = enteringEl;
        // commit animation
        await this.commit(enteringEl, leavingEl, opts);
        await detachComponent(this.delegate, leavingEl);
        return true;
    }
    async transition(enteringEl, leavingEl, opts = {}) {
        if (leavingEl === enteringEl) {
            return false;
        }
        // emit nav will change event
        this.ionNavWillChange.emit();
        const mode = getIonMode(this);
        const { el } = this;
        const animated = this.animated && config.getBoolean('animated', true);
        const animationBuilder = this.animation || opts.animationBuilder || config.get('navAnimation');
        await transition(Object.assign({ mode,
            animated,
            animationBuilder,
            enteringEl,
            leavingEl, baseEl: el, progressCallback: (opts.progressAnimation
                ? ani => this.ani = ani
                : undefined) }, opts));
        // emit nav changed event
        this.ionNavDidChange.emit();
        return true;
    }
    async lock() {
        const p = this.waitPromise;
        let resolve;
        this.waitPromise = new Promise(r => resolve = r);
        if (p !== undefined) {
            await p;
        }
        return resolve;
    }
    render() {
        return (h("slot", null));
    }
    static get is() { return "ion-router-outlet"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "$": ["route-outlet.scss"]
    }; }
    static get styleUrls() { return {
        "$": ["route-outlet.css"]
    }; }
    static get properties() { return {
        "delegate": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "FrameworkDelegate",
                "resolved": "FrameworkDelegate | undefined",
                "references": {
                    "FrameworkDelegate": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "internal"
                    }],
                "text": ""
            }
        },
        "animated": {
            "type": "boolean",
            "mutable": false,
            "complexType": {
                "original": "boolean",
                "resolved": "boolean",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "If `true`, the router-outlet should animate the transition of components."
            },
            "attribute": "animated",
            "reflect": false,
            "defaultValue": "true"
        },
        "animation": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "AnimationBuilder",
                "resolved": "((Animation: Animation, baseEl: any, opts?: any) => Promise<Animation>) | undefined",
                "references": {
                    "AnimationBuilder": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "By default `ion-nav` animates transition between pages based in the mode (ios or material design).\nHowever, this property allows to create custom transition using `AnimateBuilder` functions."
            }
        },
        "swipeHandler": {
            "type": "unknown",
            "mutable": false,
            "complexType": {
                "original": "SwipeGestureHandler",
                "resolved": "SwipeGestureHandler | undefined",
                "references": {
                    "SwipeGestureHandler": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "internal"
                    }],
                "text": ""
            }
        }
    }; }
    static get events() { return [{
            "method": "ionNavWillLoad",
            "name": "ionNavWillLoad",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "internal"
                    }],
                "text": ""
            },
            "complexType": {
                "original": "void",
                "resolved": "void",
                "references": {}
            }
        }, {
            "method": "ionNavWillChange",
            "name": "ionNavWillChange",
            "bubbles": false,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "internal"
                    }],
                "text": ""
            },
            "complexType": {
                "original": "void",
                "resolved": "void",
                "references": {}
            }
        }, {
            "method": "ionNavDidChange",
            "name": "ionNavDidChange",
            "bubbles": false,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [{
                        "text": undefined,
                        "name": "internal"
                    }],
                "text": ""
            },
            "complexType": {
                "original": "void",
                "resolved": "void",
                "references": {}
            }
        }]; }
    static get methods() { return {
        "commit": {
            "complexType": {
                "signature": "(enteringEl: HTMLElement, leavingEl: HTMLElement | undefined, opts?: RouterOutletOptions | undefined) => Promise<boolean>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }, {
                        "tags": [],
                        "text": ""
                    }, {
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "HTMLElement": {
                        "location": "global"
                    },
                    "RouterOutletOptions": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<boolean>"
            },
            "docs": {
                "text": "",
                "tags": [{
                        "name": "internal",
                        "text": undefined
                    }]
            }
        },
        "setRouteId": {
            "complexType": {
                "signature": "(id: string, params: ComponentProps<null> | undefined, direction: RouterDirection) => Promise<RouteWrite>",
                "parameters": [{
                        "tags": [],
                        "text": ""
                    }, {
                        "tags": [],
                        "text": ""
                    }, {
                        "tags": [],
                        "text": ""
                    }],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "RouteWrite": {
                        "location": "import",
                        "path": "../../interface"
                    },
                    "ComponentProps": {
                        "location": "import",
                        "path": "../../interface"
                    },
                    "RouterDirection": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<RouteWrite>"
            },
            "docs": {
                "text": "",
                "tags": [{
                        "name": "internal",
                        "text": undefined
                    }]
            }
        },
        "getRouteId": {
            "complexType": {
                "signature": "() => Promise<RouteID | undefined>",
                "parameters": [],
                "references": {
                    "Promise": {
                        "location": "global"
                    },
                    "RouteID": {
                        "location": "import",
                        "path": "../../interface"
                    }
                },
                "return": "Promise<RouteID | undefined>"
            },
            "docs": {
                "text": "",
                "tags": [{
                        "name": "internal",
                        "text": undefined
                    }]
            }
        }
    }; }
    static get elementRef() { return "el"; }
    static get watchers() { return [{
            "propName": "swipeHandler",
            "methodName": "swipeHandlerChanged"
        }]; }
}
