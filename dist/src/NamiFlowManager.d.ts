import { NativeEventEmitter } from 'react-native';
export declare enum NamiFlowManagerEvents {
    Handoff = "Handoff",
    FlowEvent = "FlowEvent"
}
export declare const NamiFlowManager: {
    emitter: NativeEventEmitter;
    registerStepHandoff: (callback: (handoffTag: string, handoffData?: Record<string, unknown>) => void) => (() => void);
    resume: () => void;
    pause: () => void;
    registerEventHandler: (callback: (payload: Record<string, unknown>) => void) => (() => void);
    finish: () => void;
    isFlowOpen: () => Promise<boolean>;
};
