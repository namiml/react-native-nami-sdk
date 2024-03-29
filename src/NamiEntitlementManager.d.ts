import { EmitterSubscription } from 'react-native';
import { NamiPurchase, NamiSKU } from './types';

export const NamiEntitlementManager: {
  active: () => Promise<Array<NamiEntitlement>>;
  isEntitlementActive: (label?: string) => boolean;
  refresh: (
    resultCallback?: (entitlements?: NamiEntitlement[]) => void,
  ) => void;
  registerActiveEntitlementsHandler: (
    callback: (activeEntitlements: NamiEntitlement[]) => void,
  ) => EmitterSubscription['remove'];
  clearProvisionalEntitlementGrants: () => void;
};

export type NamiEntitlement = {
  activePurchases: NamiPurchase[];
  desc: string;
  name: string;
  purchasedSkus: NamiSKU[];
  referenceId: string;
  relatedSkus: NamiSKU[];
};
