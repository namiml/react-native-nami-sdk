import { NativeModules } from 'react-native';

export const { NamiMLManagerBridge } = NativeModules;

export interface INamiMLManager {
  coreAction: (label: string) => void;
  enterCoreContent: (label: string | string[]) => void;
  exitCoreContent: (label: string | string[]) => void;
}

export const NamiMLManager: INamiMLManager = {
  ...NamiMLManagerBridge,
};
