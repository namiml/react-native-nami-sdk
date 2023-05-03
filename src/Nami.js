import { NativeModules } from "react-native";

export const { NamiBridge } = NativeModules;

export const Nami = {
  ...NamiBridge,
  configure(configureObj, resultCallback) {
    NamiBridge.configure(configureObj, resultCallback ?? (() => {}));
  },
};
