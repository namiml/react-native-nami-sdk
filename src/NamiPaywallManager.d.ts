import { NativeEventEmitter, EmitterSubscription } from 'react-native';
import { NamiPurchaseSuccessAmazon, NamiPurchaseSuccessApple, NamiPurchaseSuccessGooglePlay, NamiSKU } from './types';
import { NamiPurchaseSuccess } from './types';
export declare enum NamiPaywallManagerEvents {
    RegisterBuySKU = "RegisterBuySKU",
    PaywallCloseRequested = "PaywallCloseRequested",
    PaywallSignInRequested = "PaywallSignInRequested",
    PaywallRestoreRequested = "PaywallRestoreRequested",
    PaywallDeeplinkAction = "PaywallDeeplinkAction"
}
export declare enum ServicesEnum {
    Amazon = "Amazon",
    GooglePlay = "GooglePlay"
}
export interface INamiPaywallManager {
    paywallEmitter: NativeEventEmitter;
    buySkuCompleteApple: (purchaseSuccess: NamiPurchaseSuccessApple) => void;
    buySkuCompleteAmazon: (purchaseSuccess: NamiPurchaseSuccessAmazon) => void;
    buySkuCompleteGooglePlay: (purchaseSuccess: NamiPurchaseSuccessGooglePlay) => void;
    buySkuComplete: (purchaseSuccess: NamiPurchaseSuccess) => void;
    buySkuCancel: () => void;
    registerBuySkuHandler: (callback: (sku: NamiSKU) => void) => EmitterSubscription['remove'];
    registerCloseHandler: (callback: () => void) => EmitterSubscription['remove'];
    registerSignInHandler: (callback: () => void) => EmitterSubscription['remove'];
    registerRestoreHandler: (callback: () => void) => EmitterSubscription['remove'];
    registerDeeplinkActionHandler: (callback: (url: string) => void) => EmitterSubscription['remove'];
    dismiss: () => Promise<boolean>;
    show: () => void;
    hide: () => void;
    isHidden: () => Promise<boolean>;
    isPaywallOpen: () => Promise<boolean>;
    setProductDetails: (productDetails: string, allowOffers: boolean) => void;
    setAppSuppliedVideoDetails: (url: string, name?: string) => void;
}
export declare const NamiPaywallManager: INamiPaywallManager;
