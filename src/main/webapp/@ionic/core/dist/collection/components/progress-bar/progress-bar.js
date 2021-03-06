import { h } from '@stencil/core';
import { config } from '../../global/config';
import { getIonMode } from '../../global/ionic-global';
import { clamp } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
export class ProgressBar {
    constructor() {
        /**
         * The state of the progress bar, based on if the time the process takes is known or not.
         * Default options are: `"determinate"` (no animation), `"indeterminate"` (animate from left to right).
         */
        this.type = 'determinate';
        /**
         * If true, reverse the progress bar direction.
         */
        this.reversed = false;
        /**
         * The value determines how much of the active bar should display when the
         * `type` is `"determinate"`.
         * The value should be between [0, 1].
         */
        this.value = 0;
        /**
         * If the buffer and value are smaller than 1, the buffer circles will show.
         * The buffer should be between [0, 1].
         */
        this.buffer = 1;
    }
    hostData() {
        const { color, type, reversed, value } = this;
        const paused = config.getBoolean('_testing');
        const mode = getIonMode(this);
        return {
            'role': 'progressbar',
            'aria-valuenow': type === 'determinate' ? value : null,
            'aria-valuemin': 0,
            'aria-valuemax': 1,
            class: Object.assign({}, createColorClasses(color), { [mode]: true, [`progress-bar-${type}`]: true, 'progress-paused': paused, 'progress-bar-reversed': document.dir === 'rtl' ? !reversed : reversed })
        };
    }
    render() {
        if (this.type === 'indeterminate') {
            return [
                h("div", { class: "indeterminate-bar-primary" },
                    h("span", { class: "progress-indeterminate" })),
                h("div", { class: "indeterminate-bar-secondary" },
                    h("span", { class: "progress-indeterminate" }))
            ];
        }
        const value = clamp(0, this.value, 1);
        const buffer = clamp(0, this.buffer, 1);
        return [
            h("div", { class: "progress", style: { transform: `scaleX(${value})` } }),
            buffer !== 1 && h("div", { class: "buffer-circles" }),
            h("div", { class: "progress-buffer-bar", style: { transform: `scaleX(${buffer})` } }),
        ];
    }
    static get is() { return "ion-progress-bar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() { return {
        "ios": ["progress-bar.ios.scss"],
        "md": ["progress-bar.md.scss"]
    }; }
    static get styleUrls() { return {
        "ios": ["progress-bar.ios.css"],
        "md": ["progress-bar.md.css"]
    }; }
    static get properties() { return {
        "type": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "'determinate' | 'indeterminate'",
                "resolved": "\"determinate\" | \"indeterminate\"",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The state of the progress bar, based on if the time the process takes is known or not.\nDefault options are: `\"determinate\"` (no animation), `\"indeterminate\"` (animate from left to right)."
            },
            "attribute": "type",
            "reflect": false,
            "defaultValue": "'determinate'"
        },
        "reversed": {
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
                "text": "If true, reverse the progress bar direction."
            },
            "attribute": "reversed",
            "reflect": false,
            "defaultValue": "false"
        },
        "value": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "The value determines how much of the active bar should display when the\n`type` is `\"determinate\"`.\nThe value should be between [0, 1]."
            },
            "attribute": "value",
            "reflect": false,
            "defaultValue": "0"
        },
        "buffer": {
            "type": "number",
            "mutable": false,
            "complexType": {
                "original": "number",
                "resolved": "number",
                "references": {}
            },
            "required": false,
            "optional": false,
            "docs": {
                "tags": [],
                "text": "If the buffer and value are smaller than 1, the buffer circles will show.\nThe buffer should be between [0, 1]."
            },
            "attribute": "buffer",
            "reflect": false,
            "defaultValue": "1"
        },
        "color": {
            "type": "string",
            "mutable": false,
            "complexType": {
                "original": "Color",
                "resolved": "string | undefined",
                "references": {
                    "Color": {
                        "location": "import",
                        "path": "../../interface"
                    }
                }
            },
            "required": false,
            "optional": true,
            "docs": {
                "tags": [],
                "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
            },
            "attribute": "color",
            "reflect": false
        }
    }; }
}
