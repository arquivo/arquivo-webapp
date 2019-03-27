import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Config, Mode, StyleEventDetail } from '../../interface';
export declare class Toolbar implements ComponentInterface {
    private childrenStyles;
    el: HTMLStencilElement;
    config: Config;
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
    childrenStyle(ev: CustomEvent<StyleEventDetail>): void;
    hostData(): {
        class: {};
    };
    render(): JSX.Element[];
}
