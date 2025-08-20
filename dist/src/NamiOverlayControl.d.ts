import React from 'react';
import { NativeEventEmitter } from 'react-native';
export declare const NamiOverlayControl: {
    emitter: NativeEventEmitter;
    presentOverlay(): Promise<void>;
    finishOverlay(result?: any): Promise<void>;
    onOverlayReady(handler: () => void): () => void;
    onOverlayResult(handler: (result: any) => void): () => void;
    setCustomOverlayComponent(component: React.ComponentType<any>): void;
};
declare function NamiOverlayHost(): any;
export default NamiOverlayHost;
