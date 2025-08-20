import { AppRegistry, View, StyleSheet } from 'react-native';
import {
  TurboModuleRegistry,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import type { Spec } from '../specs/NativeNamiOverlayControl';

const RNNamiOverlayControl: Spec =
  TurboModuleRegistry.getEnforcing?.<Spec>('RNNamiOverlayControl') ??
  NativeModules.RNNamiOverlayControl;

const emitter = new NativeEventEmitter(NativeModules.RNNamiOverlayControl);

export const NamiOverlayControl = {
  emitter,

  presentOverlay(): Promise<void> {
    return RNNamiOverlayControl.presentOverlay();
  },

  finishOverlay(result?: any): Promise<void> {
    return RNNamiOverlayControl.finishOverlay(result ?? null);
  },

  onOverlayReady(handler: () => void) {
    const sub = emitter.addListener('NamiOverlayReady', handler);
    return () => sub.remove();
  },

  onOverlayResult(handler: (result: any) => void) {
    const sub = emitter.addListener('NamiOverlayResult', handler);
    return () => sub.remove();
  },
};

export default function NamiOverlayHost() {
  return <View style={styles.overlay} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

AppRegistry.registerComponent('NamiOverlayHost', () => NamiOverlayHost);
