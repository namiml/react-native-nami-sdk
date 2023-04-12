import { EmitterSubscription } from "react-native";

export const NamiEntitlementManager: {
  active: () => Promise<Array<NamiEntitlement>>;
  isEntitlementActive: (label?: string) => boolean;
  refresh: () => void;
  registerActiveEntitlementsHandler: (
    callback: (activeEntitlements: NamiEntitlement[]) => void
  ) => EmitterSubscription["remove"];
};

export type NamiEntitlement = {
  //"activePurchases"
  desc: string;
  name: string;
  namiId: string;
  //"purchasedSkus"
  referenceId: string;
  //"relatedSkus"
};
