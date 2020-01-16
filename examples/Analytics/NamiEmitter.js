import { NativeModules, NativeEventEmitter } from "react-native";

class NamiEmitter extends NativeEventEmitter {
  constructor(nativeModule) {
    super(nativeModule);

    // explicitly set our custom methods and properties
    this.getPurchasedProducts = nativeModule.gtePurchasedProducts;
  }
}
