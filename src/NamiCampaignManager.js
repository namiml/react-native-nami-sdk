import { NativeModules, NativeEventEmitter } from "react-native";

export const { RNNamiCampaignManager } = NativeModules;

export const NamiCampaignManager = {
  emitter: new NativeEventEmitter(RNNamiCampaignManager),
  ...RNNamiCampaignManager,
  launch: (label, actionCallback, resultCallback) => {
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
