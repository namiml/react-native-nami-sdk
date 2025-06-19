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
    callback: (handoffTag: string, handoffData?: { [key: string]: any }) => void,
  ) => () => void;
  resume: () => void;
  registerEventHandler: (
    handler: (payload: { [key: string]: any }) => void
  ) => void;
}

const flowEmitter = new NativeEventEmitter(RNNamiFlowManager);

export const NamiFlowManager: INamiFlowManager = {
  registerStepHandoff: (callback) => {
    console.log('[NamiFlowManager] Registering handoff listener...');

    const subscription: EmitterSubscription = flowEmitter.addListener(
      NamiFlowManagerEvents.RegisterStepHandoff,
      (event: { handoffTag: string; handoffData?: { [key: string]: any } }) => {
        console.info('[NamiFlowManager] Received handoff event:', event);
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
        console.info('[NamiFlowManager] resume from handoff requested');
      RNNamiFlowManager.resume();
    } else {
      console.warn('[NamiFlowManager] Native method resume is not available.');
    }
  },

  registerEventHandler: (handler) => {
    if (RNNamiFlowManager?.registerEventHandler) {
      RNNamiFlowManager.registerEventHandler((payload: { [key: string]: any }) => {
        handler(payload);
      });
    } else {
      console.warn('[NamiFlowManager] Native method registerEventHandler is not available.');
    }
  },
};
