import type { TurboModule } from 'react-native';
import { NamiPaywallEvent, NamiCampaign, PaywallLaunchContext } from '../src/types';
export interface Spec extends TurboModule {
    launch(label: string | null, withUrl: string | null, context: PaywallLaunchContext | null, completion: (successAction: boolean, error: number | null) => void, paywallCompletion: (event: NamiPaywallEvent) => void): void;
    allCampaigns(): Promise<any[]>;
    isCampaignAvailable(source?: string): Promise<boolean>;
    refresh(): Promise<NamiCampaign[]>;
    registerAvailableCampaignsHandler(): void;
}
declare const _default: Spec;
export default _default;
