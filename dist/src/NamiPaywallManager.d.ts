import { NativeEventEmitter } from 'react-native';
import type { NamiPurchaseDetails, NamiPurchaseSuccessApple, NamiPurchaseSuccessAmazon, NamiPurchaseSuccessGooglePlay } from '../src/types';
export declare enum NamiPaywallManagerEvents {
    BuySku = "RegisterBuySKU",
    Close = "PaywallCloseRequested",
    SignIn = "PaywallSignInRequested",
    Restore = "PaywallRestoreRequested",
    DeeplinkAction = "PaywallDeeplinkAction"
}
export declare const NamiPaywallManager: {
    emitter: NativeEventEmitter;
    buySkuComplete: (purchase: NamiPurchaseDetails) => void;
    buySkuCompleteApple: (purchase: NamiPurchaseSuccessApple) => void;
    buySkuCompleteAmazon: (purchase: NamiPurchaseSuccessAmazon) => void;
    buySkuCompleteGooglePlay: (purchase: NamiPurchaseSuccessGooglePlay) => void;
    registerBuySkuHandler: (callback: (sku: any) => void) => () => void;
    registerCloseHandler: (callback: () => void) => () => void;
    registerSignInHandler: (callback: () => void) => () => void;
    registerRestoreHandler: (callback: () => void) => () => void;
    registerDeeplinkActionHandler: (callback: (url: string) => void) => () => void;
    dismiss: () => Promise<boolean>;
    show: () => void;
    hide: () => void;
    isHidden: () => Promise<boolean>;
    isPaywallOpen: () => Promise<boolean>;
    buySkuCancel: () => void;
    setProductDetails: (productDetails: string, allowOffers?: boolean) => void;
    setAppSuppliedVideoDetails: (url: string, name?: string) => void;
    allowUserInteraction: (allowed: boolean) => void;
};
