import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

const { RNNamiFlowManager } = NativeModules;

export enum NamiFlowManagerEvents {
  RegisterStepHandoff = 'RegisterStepHandoff',
}

export interface INamiFlowManager {
  registerStepHandoff: (
    callback: (handoffTag: string, handoffData?: string) => void,
  ) => () => void;
  resume: () => void;
}

if (typeof RNNamiFlowManager?.addListener !== 'function') {
  RNNamiFlowManager.addListener = () => {};
}
if (typeof RNNamiFlowManager?.removeListeners !== 'function') {
  RNNamiFlowManager.removeListeners = () => {};
}

const flowEmitter = new NativeEventEmitter(RNNamiFlowManager);

export const NamiFlowManager: INamiFlowManager = {
  registerStepHandoff: (callback) => {
    console.log('[NamiFlowManager] Registering handoff listener...');

    const subscription: EmitterSubscription = flowEmitter.addListener(
      NamiFlowManagerEvents.RegisterStepHandoff,
      (event: { handoffTag: string; handoffData?: string }) => {
        console.log('[NamiFlowManager] Received handoff event:', event);
        callback(event.handoffTag, event.handoffData);
      }
    );

    if (RNNamiFlowManager?.registerStepHandoff) {
      RNNamiFlowManager.registerStepHandoff();
    } else {
      console.warn('[NamiFlowManager] Native method registerStepHandoff is not available.');
    }

    return () => {
      subscription.remove();
    };
  },

  resume: () => {
    if (RNNamiFlowManager?.resume) {
      RNNamiFlowManager.resume();
    } else {
      console.warn('[NamiFlowManager] Native method resume is not available.');
    }
  },
};