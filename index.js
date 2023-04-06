import { NativeModules, NativeEventEmitter } from "react-native";

export const {
  RNNamiCampaignManager,
  RNNamiCustomerManager,
  RNNamiEntitlementManager,
  NamiPurchaseManagerBridge,
  NamiEmitter,
  RNNamiPurchaseManager,
} = NativeModules;

export const NamiCampaignManager = {
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch: (label, callback) => {
    RNNamiCampaignManager.launch(label ?? null, callback ?? (() => {}));
  },
  isCampaignAvailable: (label) => {
    return RNNamiCampaignManager.isCampaignAvailable(label ?? null);
  },
  registerAvailableCampaignsHandler(callback) {
    const subscription = this.emitter.addListener(
      "AvailableCampaignsChanged",
      callback
    );
    RNNamiCampaignManager.registerAvailableCampaignsHandler();
    return subscription.remove;
  },
};

export const NamiCustomerManager = {
  emitter: new NativeEventEmitter(RNNamiCustomerManager),
  ...RNNamiCustomerManager,
  login: (customerId, callback) => {
    RNNamiCustomerManager.login(customerId, callback ?? (() => {}));
  },
  logout: (callback) => {
    RNNamiCustomerManager.logout(callback ?? (() => {}));
  },
  registerJourneyStateHandler(callback) {
    const subscription = this.emitter.addListener(
      "JourneyStateChanged",
      callback
    );
    RNNamiCustomerManager.registerJourneyStateHandler();
    return subscription.remove;
  },
  registerAccountStateHandler(callback) {
    const actions = ["login", "logout"];
    const subscription = this.emitter.addListener(
      "AccountStateChanged",
      (body) => callback(actions[body[0]], body[1], body[2])
    );
    RNNamiCustomerManager.registerAccountStateHandler();
    return subscription.remove;
  },
};

export const NamiEntitlementManager = {
  emitter: new NativeEventEmitter(RNNamiEntitlementManager),
  ...RNNamiEntitlementManager,
  registerActiveEntitlementsHandler(callback) {
    const subscription = this.emitter.addListener(
      "EntitlementsChanged",
      callback
    );
    RNNamiEntitlementManager.registerActiveEntitlementsHandler();
    return subscription.remove;
  },
};

export const NamiPurchaseManager = {
  emitter: new NativeEventEmitter(NamiEmitter),
  purchaseEmitter: new NativeEventEmitter(RNNamiPurchaseManager),
  ...RNNamiPurchaseManager,
  ...NamiPurchaseManagerBridge,
  registerPurchasesChangedHandler(callback) {
    const subscription = this.emitter.addListener("PurchasesChanged", callback);
    NamiEmitter.registerPurchasesChangedHandler();
    return subscription.remove;
  },
  registerRestorePurchasesHandler(callback) {
    const subscription = this.emitter.addListener(
      "RestorePurchasesStateChanged",
      callback
    );
    NamiEmitter.registerRestorePurchasesHandler();
    return subscription.remove;
  },
  registerBuySkuHandler(callback) {
    const subscription = this.purchaseEmitter.addListener(
      "RegisterBuySKU",
      callback
    );
    NamiPurchaseManagerBridge.registerBuySkuHandler();
    return subscription.remove;
  },
};
