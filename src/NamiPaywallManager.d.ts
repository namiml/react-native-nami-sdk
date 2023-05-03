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
    callback: (resultObject: { blockingPaywallClosed: boolean }) => void
  ) => EmitterSubscription["remove"];
};

export enum NamiPaywallAction {
  BUY_SKU = "BUY_SKU",
  SELECT_SKU = "SELECT_SKU",
  RESTORE_PURCHASES = "RESTORE_PURCHASES",
  SIGN_IN = "SIGN_IN",
  CLOSE_PAYWALL = "CLOSE_PAYWALL",
  PURCHASE_SELECTED_SKU = "PURCHASE_SELECTED_SKU",
  PURCHASE_SUCCESS = "PURCHASE_SUCCESS",
  PURCHASE_FAILED = "PURCHASE_FAILED",
  PURCHASE_CANCELLED = "PURCHASE_CANCELLED",
  PURCHASE_PENDING = "PURCHASE_PENDING",
  PURCHASE_UNKNOWN = "PURCHASE_UNKNOWN",
  PURCHASE_DEFERRED = "PURCHASE_DEFERRED",
}
