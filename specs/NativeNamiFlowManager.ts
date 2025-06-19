import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readonly getConstants?: () => Record<string, unknown>;

  registerStepHandoff(): void;

  resume(): void;

  registerEventHandler(handler: (payload: Record<string, any>) => void): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiFlowManager');