import type { NamiConfiguration } from './types';
export declare const Nami: {
    configure: (config: NamiConfiguration) => Promise<boolean>;
    sdkConfigured: () => Promise<boolean>;
    sdkVersion: () => Promise<string>;
};
