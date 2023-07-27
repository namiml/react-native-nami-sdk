import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';
import {
  NamiPurchaseSuccessAmazon,
  NamiPurchaseSuccessApple,
  NamiPurchaseSuccessGooglePlay,
  NamiSKU,
} from './types';

export enum NamiPaywallManagerEvents {
  RegisterBuySKU = 'RegisterBuySKU',
  PaywallCloseRequested = 'PaywallCloseRequested',
  PaywallSignInRequested = 'PaywallSignInRequested',
  PaywallRestoreRequested = 'PaywallRestoreRequested',
}

export enum ServicesEnum {
  Amazon = 'Amazon',
  GooglePlay = 'GooglePlay',
}

export interface INamiPaywallManager {
  paywallEmitter: NativeEventEmitter;
  buySkuCompleteApple: (purchaseSuccess: NamiPurchaseSuccessApple) => void;
  buySkuCompleteAmazon: (purchaseSuccess: NamiPurchaseSuccessAmazon) => void;
  buySkuCompleteGooglePlay: (
    purchaseSuccess: NamiPurchaseSuccessGooglePlay,
  ) => void;
  registerBuySkuHandler: (
    callback: (sku: NamiSKU) => void,
  ) => EmitterSubscription['remove'];
  registerCloseHandler: (callback: () => void) => EmitterSubscription['remove'];
  registerSignInHandler: (
    callback: () => void,
  ) => EmitterSubscription['remove'];
  registerRestoreHandler: (
    callback: () => void,
  ) => EmitterSubscription['remove'];
  dismiss: (animated?: boolean) => void;
  show: () => void;
  hide: () => void;
}

const { NamiPaywallManagerBridge, RNNamiPaywallManager } = NativeModules;

export const NamiPaywallManager: INamiPaywallManager = {
  paywallEmitter: new NativeEventEmitter(RNNamiPaywallManager),
  ...RNNamiPaywallManager,
  ...NamiPaywallManagerBridge,
  buySkuCompleteApple: (purchaseSuccess: NamiPurchaseSuccessApple) => {
    RNNamiPaywallManager.buySkuComplete(purchaseSuccess);
  },
  buySkuCompleteAmazon: (purchaseSuccess: NamiPurchaseSuccessAmazon) => {
    RNNamiPaywallManager.buySkuComplete(purchaseSuccess, ServicesEnum.Amazon);
  },
  buySkuCompleteGooglePlay: (
    purchaseSuccess: NamiPurchaseSuccessGooglePlay,
  ) => {
    RNNamiPaywallManager.buySkuComplete(
      purchaseSuccess,
      ServicesEnum.GooglePlay,
    );
  },
  registerBuySkuHandler: (callback: (sku: NamiSKU) => void) => {
    let subscription;
    subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.RegisterBuySKU,
      sku => {
        callback(sku);
      },
    );
    RNNamiPaywallManager.registerBuySkuHandler();
    return subscription.remove;
  },
  registerCloseHandler: (callback: (body: any) => void) => {
    let subscription;
    subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallCloseRequested,
      body => {
        callback(body);
      },
    );
    RNNamiPaywallManager.registerCloseHandler();
    return subscription.remove;
  },
  registerSignInHandler(callback) {
    let subscription;
    subscription = this.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallSignInRequested,
      body => {
        callback(body);
      },
    );
    RNNamiPaywallManager.registerSignInHandler();
    return subscription.remove;
  },
  registerRestoreHandler(callback) {
    let subscription;
    subscription = this.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallRestoreRequested,
      body => {
        callback(body);
      },
    );
    RNNamiPaywallManager.registerRestoreHandler();
    return subscription.remove;
  },
  dismiss: (animated?: boolean) => {
    RNNamiPaywallManager.dismiss(animated ?? true);
  },
  show: () => {
    RNNamiPaywallManager.show();
  },
  hide: () => {
    RNNamiPaywallManager.hide();
  },
};
