import React from 'react';
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

let customOverlayComponent: React.ComponentType<any> | null = null;

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

  setCustomOverlayComponent(component: React.ComponentType<any>) {
    console.log(
      '[NamiOverlayControl] Setting custom overlay component:',
      component?.name || 'unknown',
    );
    customOverlayComponent = component;
    console.log(
      '[NamiOverlayControl] customOverlayComponent is now:',
      customOverlayComponent?.name || 'unknown',
    );
  },
};

function NamiOverlayHost() {
  console.log('[NamiOverlayHost] Component function called!');
  console.log(
    '[NamiOverlayHost] customOverlayComponent is:',
    customOverlayComponent?.name || 'null',
  );

  const handleFinish = (result?: any) => {
    console.log('[NamiOverlayHost] Overlay finishing with result:', result);
    NamiOverlayControl.finishOverlay(result);
  };

  return (
    <View style={styles.overlay}>
      {customOverlayComponent &&
        React.createElement(customOverlayComponent, {
          visible: true,
          onFinish: handleFinish,
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default NamiOverlayHost;

// Register component immediately and handle hot reload
const registerComponent = () => {
  try {
    AppRegistry.registerComponent('NamiOverlayHost', () => NamiOverlayHost);
    console.log('[NamiOverlayControl] NamiOverlayHost registered successfully');
  } catch (error) {
    console.error(
      '[NamiOverlayControl] Failed to register NamiOverlayHost:',
      error,
    );
  }
};

// Component registration
registerComponent();
