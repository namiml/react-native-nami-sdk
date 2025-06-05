import { useEffect } from 'react';
import { NamiFlowManager } from 'react-native-nami-sdk';
import { logger } from 'react-native-logs';

const log = logger.createLogger({ severity: 'debug' });

/**
 * Sets up a Nami Flow listener that resumes the flow after a handoff.
 * Automatically logs tag/data and cleans up when the component unmounts.
 */
export function useNamiFlowListener() {
  useEffect(() => {
    log.debug('[useNamiFlowListener] Registering step handoff listener');

    const unsubscribe = NamiFlowManager.registerStepHandoff((tag, data) => {
      log.info('[NamiFlowManager] Handoff received:', tag, data);
      console.warn('[useNamiFlowListener] Handoff received:', tag, data);

      // Add tag-specific behavior here if needed
      NamiFlowManager.resume();
    });

    return () => {
      log.debug('[useNamiFlowListener] Removing step handoff listener');
      unsubscribe?.();
    };
  }, []);
}
