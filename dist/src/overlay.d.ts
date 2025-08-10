export declare function presentOverlay(): Promise<void>;
export declare function finishOverlay(result?: any): Promise<void>;
export declare function onOverlayReady(handler: () => void): () => void;
export declare function onOverlayResult(handler: (result: any) => void): () => void;
