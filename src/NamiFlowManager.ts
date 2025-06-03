import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

const { RNNamiFlowManager } = NativeModules;

// Patch required for RN 0.65+ to avoid "Unbalanced calls" warnings
if (typeof RNNamiFlowManager.addListener !== 'function') {
  RNNamiFlowManager.addListener = () => {};
}
if (typeof RNNamiFlowManager.removeListeners !== 'function') {
  RNNamiFlowManager.removeListeners = () => {};
}

// Create a generic emitter (not bound to the native module object)
const flowEmitter = new NativeEventEmitter();

export enum NamiFlowManagerEvents {
  RegisterStepHandoff = 'RegisterStepHandoff',
}

export interface INamiFlowManager {
  registerStepHandoff: (
    callback: (handoffTag: string, handoffData?: string) => void,
  ) => () => void;
  resume: () => void;
}

export const NamiFlowManager: INamiFlowManager = {
  registerStepHandoff: (callback) => {
    console.warn('[NamiFlowManager] Setting up step handoff listener');

    const subscription: EmitterSubscription = flowEmitter.addListener(
      NamiFlowManagerEvents.RegisterStepHandoff,
      (event: { handoffTag: string; handoffData?: string }) => {
        console.warn('[NamiFlowManager] Handoff event received', event);
        callback(event.handoffTag, event.handoffData);
      }
    );

    if (typeof RNNamiFlowManager?.registerStepHandoff === 'function') {
      RNNamiFlowManager.registerStepHandoff();
    } else {
      console.warn('[NamiFlowManager] Native method registerStepHandoff not found');
    }

    return () => {
      subscription.remove();
    };
  },

  resume: () => {
    if (typeof RNNamiFlowManager?.resume === 'function') {
      RNNamiFlowManager.resume();
    } else {
      console.warn('[NamiFlowManager] Native method resume not found');
    }
  },
};
