import { NativeModules, NativeEventEmitter } from "react-native";

export const { RNNamiCampaignManager } = NativeModules;

export const NamiCampaignManager = {
  launchSubscription: undefined,
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch(label, resultCallback, actionCallback) {
    this.launchSubscription?.remove();
    this.launchSubscription = this.emitter.addListener(
      "ResultCampaign",
      (body) => {
        var action = body.action;

        if (action.startsWith("NAMI_")) {
          action = action.substring(5, action.length);
        }

        var skuId = body.skuId;
        var purchaseError = body.purchaseError;
        var purchases = body.purchases;
        var campaignId = body.campaignId;
        var campaignLabel = body.campaignLabel;
        var paywallId = body.paywallId;
        actionCallback(
          action,
          skuId,
          purchaseError,
          purchases,
          campaignId,
          campaignLabel,
          paywallId
        );
      }
    );
    RNNamiCampaignManager.launch(
      label ?? null,
      resultCallback ?? (() => {}),
      actionCallback ?? (() => {})
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
