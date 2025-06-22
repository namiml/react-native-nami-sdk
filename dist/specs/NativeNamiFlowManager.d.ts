import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    registerStepHandoff(): void;
    resume(): void;
    registerEventHandler(handler: (payload: {
        [key: string]: unknown;
    }) => void): void;
}
declare const _default: Spec;
export default _default;
