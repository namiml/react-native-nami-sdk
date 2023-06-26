import {NativeModules, NativeEventEmitter} from 'react-native';

export const {RNNamiCampaignManager} = NativeModules;

export const NamiCampaignManager = {
  launchSubscription: undefined,
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch(label, context, resultCallback, actionCallback) {
    this.launchSubscription?.remove();
    this.launchSubscription = this.emitter.addListener(
      'ResultCampaign',
      body => {
        body.action = body.action.startsWith('NAMI_')
          ? body.action.substring(5, body.action.length)
          : body.action;

        const {
          action,
          skuId,
          purchaseError,
          purchases,
          campaignId,
          campaignLabel,
          paywallId,
          campaignName,
          campaignType,
          campaignUrl,
          segmentId,
          externalSegmentId,
          paywallName,
          deeplinkUrl,
        } = body;
        actionCallback(
          action,
          skuId,
          purchaseError,
          purchases,
          campaignId,
          campaignLabel,
          paywallId,
          campaignName,
          campaignType,
          campaignUrl,
          segmentId,
          externalSegmentId,
          paywallName,
          deeplinkUrl,
        );
      },
    );

    RNNamiCampaignManager.launch(
      label ?? null,
      context ?? null,
      resultCallback ?? (() => {}),
      actionCallback ?? (() => {}),
    );
  },
  isCampaignAvailable: label => {
    return RNNamiCampaignManager.isCampaignAvailable(label ?? null);
  },
  registerAvailableCampaignsHandler(callback) {
    const subscription = this.emitter.addListener(
      'AvailableCampaignsChanged',
      callback,
    );
    RNNamiCampaignManager.registerAvailableCampaignsHandler();
    return subscription.remove;
  },
};
