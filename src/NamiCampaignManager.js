import { NativeModules, NativeEventEmitter } from "react-native";

export const { RNNamiCampaignManager } = NativeModules;

export const NamiCampaignManager = {
  launchSubscription: undefined,
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch(label, withUrl, context, resultCallback, actionCallback) {
    this.launchSubscription?.remove();
    this.launchSubscription = this.emitter.addListener(
      "ResultCampaign",
      (body) => {
        body.action = body.action.startsWith("NAMI_")
          ? body.action.substring(5, body.action.length)
          : body.action;

        const {
          action,
          campaignId,
          paywallId,
          campaignLabel,
          campaignName,
          campaignType,
          campaignUrl,
          paywallName,
          segmentId,
          externalSegmentId,
          deeplinkUrl,
          skuId,
          componentChangeId,
          componentChangeName,
          purchaseError,
          purchases
        } = body;
        actionCallback(
          action,
          campaignId,
          paywallId,
          campaignLabel,
          campaignName,
          campaignType,
          campaignUrl,
          paywallName,
          segmentId,
          externalSegmentId,
          deeplinkUrl,
          skuId,
          componentChangeId,
          componentChangeName,
          purchaseError,
          purchases,
        );
      }
    );

    RNNamiCampaignManager.launch(
      label,
      withUrl ?? null,
      context ?? null,
      resultCallback ?? (() => {}),
      actionCallback ?? (() => {})
    );
  },
  isCampaignAvailable: (campaignSource) => {
    return RNNamiCampaignManager.isCampaignAvailable(campaignSource ?? null);
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
