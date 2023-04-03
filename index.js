import { NativeModules } from "react-native";

export const { RNNamiCampaignManager, RNNamiCustomerManager } = NativeModules;

export const NamiCampaignManager = {
  ...RNNamiCampaignManager,
  launch: (label, callback) => {
    RNNamiCampaignManager.launch(label ?? null, callback ?? (() => {}));
  },
  isCampaignAvailable: (label) => {
    return RNNamiCampaignManager.isCampaignAvailable(label ?? null);
  },
};

export const NamiCustomerManager = {
  ...RNNamiCustomerManager,
};
