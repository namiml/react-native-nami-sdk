import { NamiConfiguration } from './types';
export declare const NamiBridge: any, NamiManager: any;
export interface INami {
    configure: (config: NamiConfiguration, resultCallback?: (resultObject: {
        success: boolean;
    }) => void) => void;
}
export declare const Nami: INami;
