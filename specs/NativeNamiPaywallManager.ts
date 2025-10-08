import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // Unified purchase success handler
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
    storeType?: string;
  }): void;

  // Backward compatibility methods
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

  setProductDetails(productDetails: string, allowOffers: boolean): void;

  setAppSuppliedVideoDetails(url: string, name?: string): void;

  allowUserInteraction(allowed: boolean): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiPaywallManager');
