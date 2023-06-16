import { EmitterSubscription } from 'react-native';

export const NamiCustomerManager: {
  setCustomerAttribute: (key: string, value: string) => void;
  getCustomerAttribute: (key: string) => Promise<string | undefined>;
  clearCustomerAttribute: (key: string) => void;
  clearAllCustomerAttributes: () => void;
  journeyState: () => Promise<CustomerJourneyState | undefined>;
  isLoggedIn: () => Promise<boolean>;
  loggedInId: () => Promise<string | undefined>;
  deviceId: () => Promise<string>;
  login: (
    customerId: string,
    callback?: (success: boolean, error?: number) => void,
  ) => void;
  logout: (callback?: (success: boolean, error?: number) => void) => void;
  registerJourneyStateHandler: (
    callback: (journeyState: CustomerJourneyState) => void,
  ) => EmitterSubscription['remove'];
  registerAccountStateHandler: (
    callback: (
      action: AccountStateAction,
      success: boolean,
      error?: number,
    ) => void,
  ) => EmitterSubscription['remove'];
  clearCustomerDataPlatformId: () => void;
  setCustomerDataPlatformId: (platformId: string) => void;
};

export type CustomerJourneyState = {
  formerSubscriber: boolean;
  inGracePeriod: boolean;
  inTrialPeriod: boolean;
  inIntroOfferPeriod: boolean;
  isCancelled: boolean;
  inPause: boolean;
  inAccountHold: boolean;
};

export type AccountStateAction = 'login' | 'logout';
