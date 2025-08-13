import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  finish(): void;
  isFlowOpen(): Promise<boolean>;

  registerStepHandoff(): void;
  resume(): void;
  pause(): void;
  registerEventHandler(): void;
  purchaseSuccess(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiFlowManager');
