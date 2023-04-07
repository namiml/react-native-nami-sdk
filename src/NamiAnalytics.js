import { NativeModules } from "react-native";

export const { NamiAnalyticsEmitter } = NativeModules;

export const NamiAnalytics = {
 ...NamiAnalyticsEmitter
};