import { NativeModules } from 'react-native';
import { NamiConfiguration } from './types';

export const { NamiBridge, NamiManager } = NativeModules;

export interface INami {
  configure: (config: NamiConfiguration) => Promise<{ success: boolean }>;
}

export const Nami: INami = {
  ...NamiBridge,
  configure: (
    configureObj: NamiConfiguration,
  ): Promise<{ success: boolean }> => {
    return new Promise(resolve => {
      NamiBridge.configure(
        configureObj,
        (resultObject: { success: boolean }) => {
          resolve(resultObject);
        },
      );
    });
  },
};
