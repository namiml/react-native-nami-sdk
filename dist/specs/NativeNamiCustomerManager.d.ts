import type { TurboModule } from 'react-native';
export interface Spec extends TurboModule {
    setCustomerAttribute(key: string, value: string): void;
    getCustomerAttribute(key: string): Promise<string | null>;
    clearCustomerAttribute(key: string): void;
    clearAllCustomerAttributes(): void;
    setCustomerDataPlatformId(platformId: string): void;
    clearCustomerDataPlatformId(): void;
    setAnonymousMode(anonymousMode: boolean): void;
    inAnonymousMode(): Promise<boolean>;
    journeyState(): Promise<{
        formerSubscriber: boolean;
        inGracePeriod: boolean;
        inTrialPeriod: boolean;
        inIntroOfferPeriod: boolean;
        isCancelled: boolean;
        inPause: boolean;
        inAccountHold: boolean;
    }>;
    isLoggedIn(): Promise<boolean>;
    loggedInId(): Promise<string | null>;
    deviceId(): Promise<string>;
    login(customerId: string): void;
    logout(): void;
    registerJourneyStateHandler(): void;
    registerAccountStateHandler(): void;
}
declare const _default: Spec;
export default _default;
