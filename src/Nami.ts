import { NativeModules } from 'react-native';
import { NamiConfiguration } from './types';

export const { NamiBridge, NamiManager } = NativeModules;

export interface INami {
  configure: (
    config: NamiConfiguration,
    resultCallback?: (resultObject: { success: boolean }) => void,
  ) => void;
}

export const Nami: INami = {
  ...NamiBridge,
  configure: (
    configureObj: NamiConfiguration,
    resultCallback?: (resultObject: { success: boolean }) => void,
  ) => {
    NamiBridge.configure(configureObj, resultCallback ?? (() => {}));
  },
};
