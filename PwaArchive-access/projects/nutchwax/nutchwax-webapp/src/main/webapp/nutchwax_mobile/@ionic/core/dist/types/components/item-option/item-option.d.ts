import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Mode } from '../../interface';
export declare class ItemOption implements ComponentInterface {
    el: HTMLElement;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * If `true`, the user cannot interact with the item option.
     */
    disabled: boolean;
    /**
     * If `true`, the option will expand to take up the available width and cover any other options.
     */
    expandable: boolean;
    /**
     * Contains a URL or a URL fragment that the hyperlink points to.
     * If this property is set, an anchor tag will be rendered.
     */
    href?: string;
    onClick(ev: Event): void;
    hostData(): {
        class: {
            'item-option-expandable': boolean;
            'ion-activatable': boolean;
        } | {
            'item-option-expandable': boolean;
            'ion-activatable': boolean;
        };
    };
    render(): JSX.Element;
}
