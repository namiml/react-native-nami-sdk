import type { TurboModule } from 'react-native';
import type { NamiPurchase } from '../src/types';
export interface Spec extends TurboModule {
    allPurchases(): Promise<NamiPurchase[]>;
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
