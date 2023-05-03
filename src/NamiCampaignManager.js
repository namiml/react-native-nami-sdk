import { NativeModules, NativeEventEmitter } from "react-native";

export const { RNNamiCampaignManager } = NativeModules;

export const NamiCampaignManager = {
  launchSubscription: undefined,
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch(label, actionCallback, resultCallback) {
    this.launchSubscription?.remove();
    this.launchSubscription = this.emitter.addListener(
      "ResultCampaign",
      (body) => {
        var action = body.action;
        var skuId = body.skuId;
        var purchaseError = body.purchaseError;
        var purchases = body.purchases;
        resultCallback(action, skuId, purchaseError, purchases);
      }
    );
    RNNamiCampaignManager.launch(
      label ?? null,
      actionCallback ?? (() => {}),
      resultCallback ?? (() => {})
    );
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
