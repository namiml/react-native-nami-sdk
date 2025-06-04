export declare enum NamiFlowManagerEvents {
    RegisterStepHandoff = "RegisterStepHandoff"
}
export interface INamiFlowManager {
    registerStepHandoff: (callback: (handoffTag: string, handoffData?: string) => void) => () => void;
    resume: () => void;
}
export declare const NamiFlowManager: INamiFlowManager;
