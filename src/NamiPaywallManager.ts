import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiPaywallManager';
import type {
  NamiPurchaseDetails,
  NamiPurchaseSuccessApple,
  NamiPurchaseSuccessAmazon,
  NamiPurchaseSuccessGooglePlay,
  NamiSKU,
} from '../src/types';
const RNNamiPaywallManager: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiPaywallManager') ??
  NativeModules.RNNamiPaywallManager;

const emitter = new NativeEventEmitter(NativeModules.RNNamiPaywallManager);

export enum NamiPaywallManagerEvents {
  BuySku = 'RegisterBuySKU',
  Close = 'PaywallCloseRequested',
  SignIn = 'PaywallSignInRequested',
  Restore = 'PaywallRestoreRequested',
  DeeplinkAction = 'PaywallDeeplinkAction',
}

export const NamiPaywallManager = {
  emitter,

  // New unified purchase success handler
  buySkuComplete: (purchase: NamiPurchaseDetails): void => {
    RNNamiPaywallManager.buySkuComplete(purchase);
  },

  // Compatibility shims
  buySkuCompleteApple: (purchase: NamiPurchaseSuccessApple): void => {
    RNNamiPaywallManager.buySkuCompleteApple(purchase);
  },

  buySkuCompleteAmazon: (purchase: NamiPurchaseSuccessAmazon): void => {
    RNNamiPaywallManager.buySkuCompleteAmazon(purchase);
  },

  buySkuCompleteGooglePlay: (purchase: NamiPurchaseSuccessGooglePlay): void => {
    RNNamiPaywallManager.buySkuCompleteGooglePlay(purchase);
  },

  registerBuySkuHandler: (callback: (sku: NamiSKU) => void): (() => void) => {
    const sub = emitter.addListener(NamiPaywallManagerEvents.BuySku, callback);
    RNNamiPaywallManager.registerBuySkuHandler?.();
    return () => sub.remove();
  },

  registerCloseHandler: (callback: () => void): (() => void) => {
    const sub = emitter.addListener(NamiPaywallManagerEvents.Close, callback);
    RNNamiPaywallManager.registerCloseHandler?.();
    return () => sub.remove();
  },

  registerSignInHandler: (callback: () => void): (() => void) => {
    const sub = emitter.addListener(NamiPaywallManagerEvents.SignIn, callback);
    RNNamiPaywallManager.registerSignInHandler?.();
    return () => sub.remove();
  },

  registerRestoreHandler: (callback: () => void): (() => void) => {
    const sub = emitter.addListener(NamiPaywallManagerEvents.Restore, callback);
    RNNamiPaywallManager.registerRestoreHandler?.();
    return () => sub.remove();
  },

  registerDeeplinkActionHandler: (
    callback: (url: string) => void,
  ): (() => void) => {
    const sub = emitter.addListener(
      NamiPaywallManagerEvents.DeeplinkAction,
      callback,
    );
    RNNamiPaywallManager.registerDeeplinkActionHandler?.();
    return () => sub.remove();
  },

  dismiss: async (): Promise<boolean> => {
    await RNNamiPaywallManager.dismiss();
    return true;
  },

  show: (): void => {
    RNNamiPaywallManager.show();
  },

  hide: (): void => {
    RNNamiPaywallManager.hide();
  },

  isHidden: async (): Promise<boolean> => {
    return RNNamiPaywallManager.isHidden();
  },

  isPaywallOpen: async (): Promise<boolean> => {
    return RNNamiPaywallManager.isPaywallOpen();
  },

  buySkuCancel: (): void => {
    RNNamiPaywallManager.buySkuCancel();
  },

  setProductDetails: (productDetails: string, allowOffers?: boolean): void => {
    RNNamiPaywallManager.setProductDetails(productDetails, allowOffers);
  },

  setAppSuppliedVideoDetails: (url: string, name?: string): void => {
    RNNamiPaywallManager.setAppSuppliedVideoDetails(url, name);
  },

  allowUserInteraction: (allowed: boolean): void => {
    RNNamiPaywallManager.allowUserInteraction(allowed);
  },
};
