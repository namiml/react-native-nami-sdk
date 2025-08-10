import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    presentOverlay(): Promise<void>;
    finishOverlay(result?: {
        [key: string]: unknown;
    } | null): Promise<void>;
}
declare const _default: Spec;
export default _default;
