import { EmitterSubscription } from 'react-native';

import { NamiSKU } from '../types';

export type NamiPaywallManager = {
  buySkuCompleteApple: (purchaseSuccess: NamiPurchaseSuccessApple) => void;
  buySkuCompleteAmazon: (purchaseSuccess: NamiPurchaseSuccessAmazon) => void;
  buySkuCompleteGooglePlay: (
    purchaseSuccess: NamiPurchaseSuccessGooglePlay
  ) => void;
  dismiss: (animated?: boolean) => void;
  registerBuySkuHandler: (
    callback: (sku: NamiSKU) => void
  ) => EmitterSubscription['remove'];
  registerCloseHandler: (callback: () => void) => EmitterSubscription['remove'];
  registerSignInHandler: (
    callback: () => void
  ) => EmitterSubscription['remove'];
  registerRestoreHandler: (
    callback: () => void
  ) => EmitterSubscription['remove'];
  show: () => void;
  hide: () => void;
  buySkuCancel: () => void;
  isHidden: () => Promise<boolean>;
};

export type NamiPurchaseSuccessApple = {
  product: NamiSKU;
  transactionID: string;
  originalTransactionID: string;
  originalPurchaseDate: number;
  purchaseDate: number;
  expiresDate?: number;
  price: string;
  currencyCode: string;
  locale: string;
};

export type NamiPurchaseSuccessGooglePlay = {
  product: NamiSKU;
  orderId: string;
  purchaseDate: number;
  expiresDate?: number;
  purchaseToken: string;
  purchaseSource: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
};

export type NamiPurchaseSuccessAmazon = {
  product: NamiSKU;
  purchaseDate: number;
  expiresDate?: number;
  purchaseSource: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
  receiptId: string;
  localizedPrice: string;
  userId: string;
  marketplace: string;
};

export enum NamiPaywallAction {
  BUY_SKU = 'BUY_SKU',
  SELECT_SKU = 'SELECT_SKU',
  RESTORE_PURCHASES = 'RESTORE_PURCHASES',
  SIGN_IN = 'SIGN_IN',
  CLOSE_PAYWALL = 'CLOSE_PAYWALL',
  SHOW_PAYWALL = 'SHOW_PAYWALL',
  PURCHASE_SELECTED_SKU = 'PURCHASE_SELECTED_SKU',
  PURCHASE_SUCCESS = 'PURCHASE_SUCCESS',
  PURCHASE_FAILED = 'PURCHASE_FAILED',
  PURCHASE_CANCELLED = 'PURCHASE_CANCELLED',
  PURCHASE_PENDING = 'PURCHASE_PENDING',
  PURCHASE_UNKNOWN = 'PURCHASE_UNKNOWN',
  PURCHASE_DEFERRED = 'PURCHASE_DEFERRED',
  DEEPLINK = 'DEEPLINK',
  TOGGLE_CHANGE = 'TOGGLE_CHANGE',
  PAGE_CHANGE = 'PAGE_CHANGE',
  SLIDE_CHANGE = 'SLIDE_CHANGE',
  UNKNOWN = 'UNKNOWN',
}
