import { Build } from '@stencil/core';
import { getIonMode } from '../../global/ionic-global';
const SPLIT_PANE_MAIN = 'split-pane-main';
const SPLIT_PANE_SIDE = 'split-pane-side';
const QUERY = {
    'xs': '(min-width: 0px)',
    'sm': '(min-width: 576px)',
    'md': '(min-width: 768px)',
    'lg': '(min-width: 992px)',
    'xl': '(min-width: 1200px)',
    'never': ''
};
export class SplitPane {
    constructor() {
        this.visible = false;
        /**
         * If `true`, the split pane will be hidden.
         */
        this.disabled = false;
        /**
         * When the split-pane should be shown.
         * Can be a CSS media query expression, or a shortcut expression.
         * Can also be a boolean expression.
         */
        this.when = QUERY['lg'];
    }
    visibleChanged(visible) {
        const detail = { visible, isPane: this.isPane.bind(this) };
        this.ionSplitPaneVisible.emit(detail);
    }
    componentDidLoad() {
        this.styleChildren();
        this.updateState();
    }
    componentDidUnload() {
        if (this.rmL) {
            this.rmL();
            this.rmL = undefined;
        }
    }
    updateState() {
        if (!Build.isBrowser) {
            return;
        }
        if (this.rmL) {
            this.rmL();
            this.rmL = undefined;
        }
        // Check if the split-pane is disabled
        if (this.disabled) {
            this.visible = false;
            return;
        }
        // When query is a boolean
        const query = this.when;
        if (typeof query === 'boolean') {
            this.visible = query;
            return;
        }
        // When query is a string, let's find first if it is a shortcut
        const mediaQuery = QUERY[query] || query;
        // Media query is empty or null, we hide it
        if (mediaQuery.length === 0) {
            this.visible = false;
            return;
        }
        if (window.matchMedia) {
            // Listen on media query
            const callback = (q) => {
                this.visible = q.matches;
            };
            const mediaList = window.matchMedia(mediaQuery);
            mediaList.addListener(callback);
            this.rmL = () => mediaList.removeListener(callback);
            this.visible = mediaList.matches;
        }
    }
    isPane(element) {
        if (!this.visible) {
            return false;
        }
        return element.parentElement === this.el
            && element.classList.contains(SPLIT_PANE_SIDE);
    }
    styleChildren() {
        if (!Build.isBrowser) {
            return;
        }
        const contentId = this.contentId;
        const children = this.el.children;
        const nu = this.el.childElementCount;
        let foundMain = false;
        for (let i = 0; i < nu; i++) {
            const child = children[i];
            const isMain = contentId !== undefined ? child.id === contentId : child.hasAttribute('main');
            if (isMain) {
                if (foundMain) {
                    console.warn('split pane cannot have more than one main node');
                    return;
                }
                foundMain = true;
            }
            setPaneClass(child, isMain);
        }
        if (!foundMain) {
            console.warn('split pane does not have a specified main node');
        }
    }
    hostData() {
        const mode = getIonMode(this);
        return {
            class: {
                [mode]: true,
                // Used internally for styling
                [`split-pane-${mode}`]: true,
                'split-pane-visible': this.visible
            }
        };
    }
    static get is() { return "ion-split-pane"; }
    static get originalStyleUrls() { return {
        "ios": ["split-pane.ios.scss"],
        "md": ["split-pane.md.scss"]
    }; }
    static get styleUrls() { return {
        "ios": ["split-pane.ios.css"],
        "md": ["split-pane.md.css"]
    }; }
    static get properties() { return {
        "contentId": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "string",
                "resolved": "string | undefined",
                "references": {}
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "The content `id` of the split-pane's main content.\nThis property can be used instead of the `[main]` attribute to select the `main`\ncontent of the split-pane."
            },
            "attribute": "content-id",
            "reflect": false
        },
        "disabled": {
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
                "text": "If `true`, the split pane will be hidden."
            },
            "attribute": "disabled",
            "reflect": false,
            "defaultValue": "false"
        },
        "when": {
            "type": "any",
            "mutable": false,
            "complexType": {
                "original": "string | boolean",
                "resolved": "boolean | string",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "When the split-pane should be shown.\nCan be a CSS media query expression, or a shortcut expression.\nCan also be a boolean expression."
            },
            "attribute": "when",
            "reflect": false,
            "defaultValue": "QUERY['lg']"
        }
    }; }
    static get states() { return {
        "visible": {}
    }; }
    static get events() { return [{
            "method": "ionSplitPaneVisible",
            "name": "ionSplitPaneVisible",
            "bubbles": true,
            "cancelable": true,
            "composed": true,
            "docs": {
                "tags": [],
                "text": "Expression to be called when the split-pane visibility has changed"
            },
            "complexType": {
                "original": "{visible: boolean}",
                "resolved": "{ visible: boolean; }",
                "references": {}
            }
        }]; }
    static get elementRef() { return "el"; }
    static get watchers() { return [{
            "propName": "visible",
            "methodName": "visibleChanged"
        }, {
            "propName": "disabled",
            "methodName": "updateState"
        }, {
            "propName": "when",
            "methodName": "updateState"
        }]; }
}
function setPaneClass(el, isMain) {
    let toAdd;
    let toRemove;
    if (isMain) {
        toAdd = SPLIT_PANE_MAIN;
        toRemove = SPLIT_PANE_SIDE;
    }
    else {
        toAdd = SPLIT_PANE_SIDE;
        toRemove = SPLIT_PANE_MAIN;
    }
    const classList = el.classList;
    classList.add(toAdd);
    classList.remove(toRemove);
}
