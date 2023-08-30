import type { NamiConfiguration } from './../types';

export type Nami = {
  configure: (
    config: NamiConfiguration,
    resultCallback?: (resultObject: { success: boolean }) => void
  ) => void;
};
