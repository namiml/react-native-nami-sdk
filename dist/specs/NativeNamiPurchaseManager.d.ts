import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
  allPurchases(): Promise<
    Array<{
      skuId: string;
      sku?: {
        id: string;
        skuId: string;
        name: string;
        type: string;
      };
      transactionIdentifier?: string;
      purchaseToken?: string;
      expires?: number;
      purchaseInitiatedTimestamp: number;
      purchaseSource?: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
    }>
  >;
  skuPurchased(skuId: string): Promise<boolean>;
  anySkuPurchased(skuIds: string[]): Promise<boolean>;
  consumePurchasedSku(skuId: string): void;
  presentCodeRedemptionSheet(): void;
  restorePurchases(): void;
  registerPurchasesChangedHandler(): void;
  registerRestorePurchasesHandler(): void;
}
declare const _default: Spec;
export default _default;
