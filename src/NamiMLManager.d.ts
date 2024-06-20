export declare const NamiMLManagerBridge: any;
export interface INamiMLManager {
    coreAction: (label: string) => void;
    enterCoreContent: (label: string | string[]) => void;
    exitCoreContent: (label: string | string[]) => void;
}
export declare const NamiMLManager: INamiMLManager;
