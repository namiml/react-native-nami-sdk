import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  presentOverlay(): Promise<void>;
  finishOverlay(result?: { [key: string]: unknown } | null): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNNamiOverlayControl');
