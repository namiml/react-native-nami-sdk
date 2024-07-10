import { NamiConfiguration } from './types';
export declare const NamiBridge: any, NamiManager: any;
export interface INami {
    configure: (config: NamiConfiguration) => Promise<{
        success: boolean;
    }>;
}
export declare const Nami: INami;
