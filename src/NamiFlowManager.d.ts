import { EmitterSubscription } from 'react-native';

export interface INamiFlowManager {
  /**
   * Register a callback that will be invoked when a Nami Flow step is handed off to the app.
   * The callback receives the handoffTag (e.g., 'push', 'location') and optional handoffData.
   *
   * Returns a function to remove the listener.
   */
  registerStepHandoff: (
    callback: (handoffTag: string, handoffData?: string) => void
  ) => () => void;

  /**
   * Resume the Nami Flow after a handoff step is completed.
   */
  resume: () => void;
}

/**
 * Event names emitted by the native NamiFlowManager module.
 */
export enum NamiFlowManagerEvents {
  RegisterStepHandoff = 'RegisterStepHandoff',
}

/**
 * React Native bridge to the native Nami Flow Manager module.
 */
export const NamiFlowManager: INamiFlowManager;
