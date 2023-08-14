import { NativeModules } from 'react-native';

import type { NamiConfiguration } from '../types';

export const { NamiBridge } = NativeModules;

export interface INami {
  configure: (
    config: NamiConfiguration,
    resultCallback?: (resultObject: { success: boolean }) => void
  ) => void;
}

export const Nami: INami = {
  ...NamiBridge,
  configure: (
    configureObj: NamiConfiguration,
    resultCallback?: (resultObject: { success: boolean }) => void
  ) => {
    NamiBridge.configure(configureObj, resultCallback ?? (() => {}));
  },
};
