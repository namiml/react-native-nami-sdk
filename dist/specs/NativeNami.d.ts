import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    configure(config: {
        appPlatformID: string;
        logLevel: string;
        namiCommands?: string[];
        namiLanguageCode?: string;
        initialConfig?: string;
    }): Promise<{
        success: boolean;
    }>;
    sdkConfigured(): Promise<boolean>;
    sdkVersion(): Promise<string>;
}
declare const _default: Spec;
export default _default;
