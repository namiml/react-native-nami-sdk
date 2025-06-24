import { NativeEventEmitter } from 'react-native';
export declare enum NamiFlowManagerEvents {
  Handoff = 'Handoff',
  FlowEvent = 'FlowEvent',
}
export declare const NamiFlowManager: {
  emitter: NativeEventEmitter;
  registerStepHandoff: (
    callback: (handoffTag: string, handoffData?: Record<string, any>) => void,
  ) => () => void;
  resume: () => void;
  registerEventHandler: (
    callback: (payload: Record<string, any>) => void,
  ) => () => void;
};
