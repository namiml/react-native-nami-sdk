export declare enum NamiFlowManagerEvents {
  RegisterStepHandoff = "RegisterStepHandoff"
}

export interface INamiFlowManager {
  /**
   * Registers a callback to receive handoff step events.
   * @param callback - Called with handoffTag and optional handoffData object.
   * @returns Unsubscribe function.
   */
  registerStepHandoff: (
    callback: (handoffTag: string, handoffData?: { [key: string]: any }) => void
  ) => () => void;

  /**
   * Resumes the flow manager.
   */
  resume: () => void;

  /**
   * Registers an event handler for custom payload events.
   * @param handler - Called with the payload object sent from native.
   */
  registerEventHandler: (
    handler: (payload: { [key: string]: any }) => void
  ) => void;
}

/**
 * Nami Flow Manager instance for interacting with the native SDK.
 */
export declare const NamiFlowManager: INamiFlowManager;
