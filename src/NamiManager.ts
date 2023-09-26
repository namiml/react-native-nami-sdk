import { NativeModules } from 'react-native';

export const { RNNamiManager } = NativeModules;

export interface INamiManager {
  sdkConfigured: () => Promise<boolean>;
}

export const NamiManager: INamiManager = {
  ...RNNamiManager,
  sdkConfigured: () => {
    return RNNamiManager.sdkConfigured();
  },
};
