import type { Spec } from '../specs/NativeNami';
import { TurboModuleRegistry, NativeModules } from 'react-native';
import type { NamiConfiguration } from './types';

const RNNami: Spec =
  TurboModuleRegistry.getEnforcing<Spec>('RNNami') ?? NativeModules.RNNami;

import { NAMI_REACT_NATIVE_VERSION } from './version';

export const Nami = {
  configure: async (config: NamiConfiguration): Promise<boolean> => {
    const result = await RNNami.configure({
      ...config,
      namiCommands: [
        ...(config.namiCommands ?? []),
        `extendedClientInfo:react-native:${NAMI_REACT_NATIVE_VERSION}`,
      ],
    });

    // Treat 'already configured' as success
    if (result?.success === false) {
      const alreadyConfigured = await RNNami.sdkConfigured?.();
      if (alreadyConfigured) {
        return true;
      }
    }

    return result?.success ?? false;
  },

  sdkConfigured: async (): Promise<boolean> => {
    return await RNNami.sdkConfigured?.();
  },
  sdkVersion: async (): Promise<string> => {
    return await RNNami.sdkVersion();
  },
};
