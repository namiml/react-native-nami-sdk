import type { TurboModule } from 'react-native';
import type { NamiPurchaseDetails, NamiPurchaseSuccessApple, NamiPurchaseSuccessAmazon, NamiPurchaseSuccessGooglePlay } from '../src/types';
export interface Spec extends TurboModule {
    buySkuComplete(purchase: NamiPurchaseDetails): void;
    buySkuCompleteApple(purchase: NamiPurchaseSuccessApple): void;
    buySkuCompleteAmazon(purchase: NamiPurchaseSuccessAmazon): void;
    buySkuCompleteGooglePlay(purchase: NamiPurchaseSuccessGooglePlay): void;
    registerBuySkuHandler(): void;
    registerCloseHandler(): void;
    registerSignInHandler(): void;
    registerRestoreHandler(): void;
    registerDeeplinkActionHandler(): void;
    dismiss(): Promise<void>;
    show(): void;
    hide(): void;
    isHidden(): Promise<boolean>;
    isPaywallOpen(): Promise<boolean>;
    buySkuCancel(): void;
    setProductDetails(productDetails: string, allowOffers?: boolean): void;
    setAppSuppliedVideoDetails(url: string, name?: string): void;
    allowUserInteraction(allowed: boolean): void;
}
declare const _default: Spec;
export default _default;
