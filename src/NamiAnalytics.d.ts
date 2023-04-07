import { EmitterSubscription } from "react-native";

export const NamiAnalytics: {
  registerAnalyticsHandle: (
    callback: (actionType: NamiAnalyticsActionType, analyticsItems: any) => void
  ) => EmitterSubscription["remove"];
};
export enum NamiAnalyticsActionType {
  paywallRaise = "paywallRaise",
  purchaseActivity = "purchaseActivity",
}
