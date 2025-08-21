import { NativeEventEmitter } from 'react-native';
export declare const NamiOverlayControl: {
    emitter: NativeEventEmitter;
    presentOverlay(): Promise<void>;
    finishOverlay(result?: any): Promise<void>;
    onOverlayReady(handler: () => void): () => void;
    onOverlayResult(handler: (result: any) => void): () => void;
};
export default function NamiOverlayHost(): any;
