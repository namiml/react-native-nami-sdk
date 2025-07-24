import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  allPurchases(): Promise<
    Array<{
      skuId: string;
      sku?: {
        id: string;
        skuId: string;
        name?: string;
        type: string;
        promoId?: string;
        promoToken?: string;
      };
      transactionIdentifier?: string;
      purchaseToken?: string;
      expires?: number; // timestamp in milliseconds
      purchaseInitiatedTimestamp: number; // timestamp in milliseconds
      purchaseSource?: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
    }>
  >;

  skuPurchased(skuId: string): Promise<boolean>;
  anySkuPurchased(skuIds: string[]): Promise<boolean>;
  presentCodeRedemptionSheet(): void;
  restorePurchases(): void;
  registerPurchasesChangedHandler(): void;
  registerRestorePurchasesHandler(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiPurchaseManager');
