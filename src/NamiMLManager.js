import { NativeModules } from "react-native";

export const { NamiMLManagerBridge } = NativeModules;

export const NamiMLManager = {
  ...NamiMLManagerBridge,
};
