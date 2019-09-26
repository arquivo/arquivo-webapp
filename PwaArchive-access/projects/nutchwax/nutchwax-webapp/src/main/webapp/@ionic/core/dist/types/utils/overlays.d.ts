import { ActionSheetOptions, AlertOptions, AnimationBuilder, HTMLIonOverlayElement, LoadingOptions, ModalOptions, OverlayInterface, PickerOptions, PopoverOptions, ToastOptions } from '../interface';
export declare const alertController: {
    create(options: AlertOptions): Promise<HTMLIonAlertElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonAlertElement | undefined>;
};
export declare const actionSheetController: {
    create(options: ActionSheetOptions): Promise<HTMLIonActionSheetElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonActionSheetElement | undefined>;
};
export declare const loadingController: {
    create(options: LoadingOptions): Promise<HTMLIonLoadingElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonLoadingElement | undefined>;
};
export declare const modalController: {
    create(options: ModalOptions<import("../interface").ComponentRef>): Promise<HTMLIonModalElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonModalElement | undefined>;
};
export declare const pickerController: {
    create(options: PickerOptions): Promise<HTMLIonPickerElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonPickerElement | undefined>;
};
export declare const popoverController: {
    create(options: PopoverOptions<import("../interface").ComponentRef>): Promise<HTMLIonPopoverElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonPopoverElement | undefined>;
};
export declare const toastController: {
    create(options: ToastOptions): Promise<HTMLIonToastElement>;
    dismiss(data?: any, role?: string | undefined, id?: string | undefined): Promise<boolean>;
    getTop(): Promise<HTMLIonToastElement | undefined>;
};
export declare const createOverlay: <T extends HTMLIonOverlayElement>(tagName: string, opts: object | undefined) => Promise<T>;
export declare const connectListeners: (doc: Document) => void;
export declare const dismissOverlay: (doc: Document, data: any, role: string | undefined, overlayTag: string, id?: string | undefined) => Promise<boolean>;
export declare const getOverlays: (doc: Document, overlayTag?: string | undefined) => HTMLIonOverlayElement[];
export declare const getOverlay: (doc: Document, overlayTag?: string | undefined, id?: string | undefined) => HTMLIonOverlayElement | undefined;
export declare const present: (overlay: OverlayInterface, name: "mode" | "animated" | "rippleEffect" | "hardwareBackButton" | "statusTap" | "backButtonIcon" | "backButtonText" | "menuIcon" | "menuType" | "spinner" | "loadingSpinner" | "refreshingIcon" | "refreshingSpinner" | "infiniteLoadingSpinner" | "swipeBackEnabled" | "tabButtonLayout" | "navAnimation" | "actionSheetEnter" | "alertEnter" | "loadingEnter" | "modalEnter" | "popoverEnter" | "toastEnter" | "pickerEnter" | "actionSheetLeave" | "alertLeave" | "loadingLeave" | "modalLeave" | "popoverLeave" | "toastLeave" | "pickerLeave" | "keyboardHeight" | "inputShims" | "scrollPadding" | "inputBlurring" | "scrollAssist" | "hideCaretOnScroll" | "persistConfig" | "_forceStatusbarPadding" | "_testing", iosEnterAnimation: AnimationBuilder, mdEnterAnimation: AnimationBuilder, opts?: any) => Promise<void>;
export declare const dismiss: (overlay: OverlayInterface, data: any, role: string | undefined, name: "mode" | "animated" | "rippleEffect" | "hardwareBackButton" | "statusTap" | "backButtonIcon" | "backButtonText" | "menuIcon" | "menuType" | "spinner" | "loadingSpinner" | "refreshingIcon" | "refreshingSpinner" | "infiniteLoadingSpinner" | "swipeBackEnabled" | "tabButtonLayout" | "navAnimation" | "actionSheetEnter" | "alertEnter" | "loadingEnter" | "modalEnter" | "popoverEnter" | "toastEnter" | "pickerEnter" | "actionSheetLeave" | "alertLeave" | "loadingLeave" | "modalLeave" | "popoverLeave" | "toastLeave" | "pickerLeave" | "keyboardHeight" | "inputShims" | "scrollPadding" | "inputBlurring" | "scrollAssist" | "hideCaretOnScroll" | "persistConfig" | "_forceStatusbarPadding" | "_testing", iosLeaveAnimation: AnimationBuilder, mdLeaveAnimation: AnimationBuilder, opts?: any) => Promise<boolean>;
export declare const autoFocus: (containerEl: HTMLElement) => HTMLElement | undefined;
export declare const eventMethod: <T>(element: HTMLElement, eventName: string) => Promise<T>;
export declare const onceEvent: (element: HTMLElement, eventName: string, callback: (ev: Event) => void) => void;
export declare const isCancel: (role: string | undefined) => boolean;
export declare const BACKDROP = "backdrop";
