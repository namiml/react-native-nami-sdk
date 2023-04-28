import { EmitterSubscription } from "react-native";
import { NamiPurchase } from "./NamiPurchaseManager";
import { NamiSKU } from "./types";

export const NamiEntitlementManager: {
  active: () => Promise<Array<NamiEntitlement>>;
  isEntitlementActive: (label?: string) => boolean;
  refresh: () => void;
  registerActiveEntitlementsHandler: (
    callback: (activeEntitlements: NamiEntitlement[]) => void
  ) => EmitterSubscription["remove"];
};

export type NamiEntitlement = {
  activePurchases: NamiPurchase[];
  desc: string;
  name: string;
  namiId: string;
  purchasedSkus: NamiSKU[];
  referenceId: string;
  relatedSkus: NamiSKU[];
};
