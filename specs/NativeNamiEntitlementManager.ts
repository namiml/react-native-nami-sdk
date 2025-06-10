import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { NamiEntitlement } from '../src/types';

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

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiEntitlementManager');
