import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    isEntitlementActive(referenceId?: string): Promise<boolean>;
    active(): Promise<Array<{
        activePurchases: Array<{
            id: string;
            skuId: string;
            name: string;
            type: string;
            purchaseInitiationSource: string;
            campaignId?: string;
            campaignLabel?: string;
            promoId?: string;
            promoToken?: string;
        }>;
        desc: string;
        name: string;
        namiId: string;
        purchasedSkus: Array<{
            id: string;
            skuId: string;
            name: string;
            type: string;
            promoId?: string;
            promoToken?: string;
        }>;
        referenceId: string;
        relatedSkus: Array<{
            id: string;
            skuId: string;
            name: string;
            type: string;
            promoId?: string;
            promoToken?: string;
        }>;
    }>>;
    refresh(): void;
    registerActiveEntitlementsHandler(): void;
}
declare const _default: Spec;
export default _default;
