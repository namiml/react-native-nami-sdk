import { EmitterSubscription } from "react-native";
import { NamiSKU } from "./types";

export const NamiPaywallManager: {
  buySkuCompleteIos: (purchaseSuccess: PurchaseSuccessIos) => void;
  buySkuCompleteAmazon: (purchaseSuccess: PurchaseSuccessAmazon) => void;
  buySkuCompleteGooglePlay: (
    purchaseSuccess: PurchaseSuccessGooglePlay
  ) => void;
  dismiss: (animated: boolean, callback: () => void) => void;
  displayedViewController: () => void;
  renderCustomUiHandler: () => any;
  registerBuySkuHandler: (
    callback: (sku: NamiSKU) => void
  ) => EmitterSubscription["remove"];
  registerCloseHandler: (
    blockDismiss: boolean,
    callback: (resultObject: { blockingPaywallClosed: boolean }) => void
  ) => EmitterSubscription["remove"];
};

export type PurchaseSuccessIos = {
  product: PurchaseSuccessProduct;
  transactionID: string;
  originalTransactionID: string;
  originalPurchaseDate: number;
  purchaseDate: number;
  expiresDate?: number;
  price: string;
  currencyCode: string;
  locale: string;
};

export type PurchaseSuccessGooglePlay = {
  product: PurchaseSuccessProduct;
  orderId: string;
  purchaseDate: number;
  expiresDate?: number;
  purchaseToken: string;
  purchaseSource: "CAMPAIGN" | "MARKETPLACE" | "UNKNOWN";
};

export type PurchaseSuccessAmazon = {
  product: PurchaseSuccessProduct;
  purchaseDate: number;
  expiresDate?: number;
  purchaseSource: "CAMPAIGN" | "MARKETPLACE" | "UNKNOWN";
  receiptId: string;
  localizedPrice: string;
  userId: string;
  marketplace: string;
};

export type PurchaseSuccessProduct = {
  id: string;
  platformID: string;
  skuId: string;
  languageCode: string;
  name: string;
  featured: boolean;
  storeId: string;
  type: number;
  isFeatured: boolean;
  namiID: string;
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
