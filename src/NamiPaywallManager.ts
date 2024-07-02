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
  PaywallDeeplinkAction = 'PaywallDeeplinkAction',
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
  buySkuCancel: () => void;
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
  registerDeeplinkActionHandler: (
    callback: (url: string) => void,
  ) => EmitterSubscription['remove'];
  dismiss: () => Promise<boolean>;
  show: () => void;
  hide: () => void;
  isHidden: () => Promise<boolean>;
  isPaywallOpen: () => Promise<boolean>;
  setProductDetails: (productDetails: string, allowOffers: boolean) => void;
  setAppSuppliedVideoDetails: (url: string, name?: string) => void;
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
  buySkuCancel: () => {
    RNNamiPaywallManager.buySkuCancel();
  },
  registerBuySkuHandler: (callback: (sku: NamiSKU) => void) => {
    let subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.RegisterBuySKU,
      sku => {
        callback(sku);
      },
    );
    RNNamiPaywallManager.registerBuySkuHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  registerCloseHandler: (callback: (body: any) => void) => {
    let subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallCloseRequested,
      body => {
        callback(body);
      },
    );
    RNNamiPaywallManager.registerCloseHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  registerSignInHandler(callback) {
    let subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallSignInRequested,
      () => {
        callback();
      },
    );
    RNNamiPaywallManager.registerSignInHandler();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  registerRestoreHandler(callback) {
    let subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallRestoreRequested,
      () => {
        callback();
      },
    );
    RNNamiPaywallManager.registerRestoreHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  registerDeeplinkActionHandler: (callback: (url: string) => void) => {
    let subscription = NamiPaywallManager.paywallEmitter.addListener(
      NamiPaywallManagerEvents.PaywallDeeplinkAction,
      url => {
        callback(url);
      },
    );
    RNNamiPaywallManager.registerDeeplinkActionHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  },
  dismiss: () => {
    return RNNamiPaywallManager.dismiss();
  },
  show: () => {
    RNNamiPaywallManager.show();
  },
  hide: () => {
    RNNamiPaywallManager.hide();
  },
  isHidden: () => {
    return RNNamiPaywallManager.isHidden();
  },
  isPaywallOpen: () => {
    return RNNamiPaywallManager.isPaywallOpen();
  },
  setProductDetails: (productDetails: string, allowOffers: boolean) => {
    RNNamiPaywallManager.setProductDetails(productDetails, allowOffers);
  },
  setAppSuppliedVideoDetails: (url: string, name?: string) => {
    RNNamiPaywallManager.setAppSuppliedVideoDetails(url, name);
  },
};
