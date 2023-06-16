import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  EmitterSubscription,
} from 'react-native';
import { NamiEntitlement } from './types';

export const { RNNamiEntitlementManager } = NativeModules;

export enum NamiEntitlementManagerEvents {
  EntitlementsChanged = 'EntitlementsChanged',
}

export interface INamiEntitlementManager {
  emitter: NativeEventEmitter;
  active: () => Promise<Array<NamiEntitlement>>;
  isEntitlementActive: (label?: string) => boolean;
  refresh: (
    resultCallback?: (entitlements?: NamiEntitlement[]) => void,
  ) => void;
  registerActiveEntitlementsHandler: (
    callback: (activeEntitlements: NamiEntitlement[]) => void,
  ) => EmitterSubscription['remove'];
}

export const NamiEntitlementManager: INamiEntitlementManager = {
  ...RNNamiEntitlementManager,
  emitter: new NativeEventEmitter(RNNamiEntitlementManager),
  refresh: (
    resultCallback?: (
      entitlements?: INamiEntitlementManager['NamiEntitlement'][],
    ) => void,
  ) => {
    if (Platform.OS === 'android') {
      RNNamiEntitlementManager.refresh(resultCallback ?? (() => {}));
    } else {
      RNNamiEntitlementManager.refresh();
    }
  },
  registerActiveEntitlementsHandler: (
    callback: (
      activeEntitlements: INamiEntitlementManager['NamiEntitlement'][],
    ) => void,
  ) => {
    const subscription: EmitterSubscription =
      NamiEntitlementManager.emitter.addListener(
        NamiEntitlementManagerEvents.EntitlementsChanged,
        callback,
      );
    RNNamiEntitlementManager.registerActiveEntitlementsHandler();
    return () => subscription.remove();
  },
};
