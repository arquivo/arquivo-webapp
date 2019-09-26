import { createThemedClasses } from '../../utils/theme';
export class InfiniteScrollContent {
    componentDidLoad() {
        if (this.loadingSpinner === undefined) {
            this.loadingSpinner = this.config.get('infiniteLoadingSpinner', this.config.get('spinner', 'lines'));
        }
    }
    hostData() {
        return {
            class: createThemedClasses(this.mode, 'infinite-scroll-content')
        };
    }
    render() {
        return (h("div", { class: "infinite-loading" },
            this.loadingSpinner && (h("div", { class: "infinite-loading-spinner" },
                h("ion-spinner", { name: this.loadingSpinner }))),
            this.loadingText && (h("div", { class: "infinite-loading-text", innerHTML: this.loadingText }))));
    }
    static get is() { return "ion-infinite-scroll-content"; }
    static get properties() { return {
        "config": {
            "context": "config"
        },
        "loadingSpinner": {
            "type": String,
            "attr": "loading-spinner",
            "mutable": true
        },
        "loadingText": {
            "type": String,
            "attr": "loading-text"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-infinite-scroll-content:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-infinite-scroll-content:**/"; }
}
