import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    finish(): void;
    isFlowOpen(): Promise<boolean>;
    registerStepHandoff(): void;
    resume(): void;
    registerEventHandler(): void;
}
declare const _default: Spec;
export default _default;
