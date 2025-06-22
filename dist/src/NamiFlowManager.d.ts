import { NativeEventEmitter } from 'react-native';
export declare enum NamiFlowManagerEvents {
    RegisterStepHandoff = "RegisterStepHandoff"
}
export declare const NamiFlowManager: {
    emitter: NativeEventEmitter;
    registerStepHandoff: (callback: (handoffTag: string, handoffData?: Record<string, any>) => void) => () => void;
    resume: () => void;
    registerEventHandler: (handler: (payload: Record<string, any>) => void) => void;
};
