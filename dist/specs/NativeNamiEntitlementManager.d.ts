import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    isEntitlementActive(referenceId?: string): Promise<boolean>;
    active(): Promise<Array<{
        referenceId: string;
        desc?: string;
        name?: string;
        purchasedSkus: Array<{
            id: string;
            skuId: string;
            name?: string;
            type: string;
            promoId?: string;
            promoToken?: string;
        }>;
        relatedSkus: Array<{
            id: string;
            skuId: string;
            name?: string;
            type: string;
            promoId?: string;
            promoToken?: string;
        }>;
        activePurchases: Array<{
            skuId: string;
            transactionIdentifier?: string;
            expires?: string;
            purchaseInitiatedTimestamp: string;
            purchaseSource?: string;
            sku?: {
                id: string;
                skuId: string;
                name?: string;
                type: string;
                promoId?: string;
                promoToken?: string;
            };
        }>;
    }>>;
    refresh(): void;
    registerActiveEntitlementsHandler(): void;
    clearProvisionalEntitlementGrants(): void;
}
declare const _default: Spec;
export default _default;
