import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
  buySkuComplete(purchase: {
    product: {
      id: string;
      skuId: string;
      name?: string;
      type: string;
    };
    transactionID?: string;
    originalTransactionID?: string;
    orderId?: string;
    purchaseToken?: string;
    receiptId?: string;
    localizedPrice?: string;
    userId?: string;
    marketplace?: string;
    price?: string;
    currencyCode?: string;
  }): void;
  buySkuCompleteApple(purchase: {
    product: {
      id: string;
      skuId: string;
      name?: string;
      type: string;
    };
    transactionID: string;
    originalTransactionID: string;
    price: string;
    currencyCode: string;
  }): void;
  buySkuCompleteAmazon(purchase: {
    product: {
      id: string;
      skuId: string;
      name?: string;
      type: string;
    };
    receiptId: string;
    localizedPrice: string;
    userId: string;
    marketplace: string;
  }): void;
  buySkuCompleteGooglePlay(purchase: {
    product: {
      id: string;
      skuId: string;
      name?: string;
      type: string;
    };
    orderId: string;
    purchaseToken: string;
  }): void;
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
