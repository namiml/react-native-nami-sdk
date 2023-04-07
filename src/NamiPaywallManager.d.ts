import { EmitterSubscription } from "react-native";
import { NamiSKU } from "./types";

export const NamiPaywallManager: {
  // buySkuComplete: () => void;
  dismiss: (animated: boolean, callback: () => void) => void;
  displayedViewController: () => void;
  renderCustomUiHandler: () => any;
  registerBuySkuHandler: (
    callback: (sku: NamiSKU) => void
  ) => EmitterSubscription["remove"];
  registerCloseHandler: (
    callback: (paywall: any) => void
  ) => EmitterSubscription["remove"];
};
