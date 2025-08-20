import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiFlowManager';
import type { NamiFlowHandoffPayload } from '../src/types';

const RNNamiFlowManager: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiFlowManager') ??
  NativeModules.RNNamiFlowManager;

const emitter = new NativeEventEmitter(NativeModules.RNNamiFlowManager);

export enum NamiFlowManagerEvents {
  Handoff = 'Handoff',
  FlowEvent = 'FlowEvent',
}

export const NamiFlowManager = {
  emitter,

  registerStepHandoff: (
    callback: (
      handoffTag: string,
      handoffData?: Record<string, unknown>,
    ) => void,
  ): (() => void) => {
    console.info('[NamiFlowManager] Registering step handoff listener...');

    const sub = emitter.addListener(
      NamiFlowManagerEvents.Handoff,
      (event: NamiFlowHandoffPayload) => {
        console.info('[NamiFlowManager] Received handoff event:', event);
        callback(event.handoffTag, event.handoffData);
      },
    );

    RNNamiFlowManager.registerStepHandoff?.();

    return () => sub.remove();
  },

  resume: (): void => {
    console.info('[NamiFlowManager] resume from handoff requested');
    RNNamiFlowManager.resume?.();
  },

  pause: (): void => {
    console.info('[NamiFlowManager] pause from handoff requested');
    RNNamiFlowManager.pause();
  },

  registerEventHandler: (
    callback: (payload: Record<string, unknown>) => void,
  ): (() => void) => {
    const sub = emitter.addListener(NamiFlowManagerEvents.FlowEvent, callback);
    RNNamiFlowManager.registerEventHandler?.();
    return () => sub.remove();
  },

  finish: (): void => {
    RNNamiFlowManager.finish();
  },

  isFlowOpen: async (): Promise<boolean> => {
    return RNNamiFlowManager.isFlowOpen();
  },

  purchaseSuccess: (): void => {
    RNNamiFlowManager.purchaseSuccess();
  },
};
