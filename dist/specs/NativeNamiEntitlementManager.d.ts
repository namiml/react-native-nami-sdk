import type { TurboModule } from 'react-native';
import { NamiEntitlement } from '../src/types';
export interface Spec extends TurboModule {
    isEntitlementActive(referenceId?: string): Promise<boolean>;
    active(): Promise<Array<NamiEntitlement>>;
    refresh(): void;
    registerActiveEntitlementsHandler(): void;
}
declare const _default: Spec;
export default _default;
