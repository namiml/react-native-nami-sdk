import { NativeModules } from "react-native";

export const { NamiBridge } = NativeModules;

export const Nami = {
 ...NamiBridge
};
