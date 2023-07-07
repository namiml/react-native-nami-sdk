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
  login: (customerId: string) => void;
  logout: () => void;
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
  setAnonymousMode: (anonymousMode: boolean) => void;
  inAnonymousMode: () => Promise<boolean>;
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

export type AccountStateAction =
  | 'login'
  | 'logout'
  | 'advertising_id_set'
  | 'vendor_id_set'
  | 'customer_data_platform_id_set'
  | 'nami_device_id_set'
  | 'advertising_id_cleared'
  | 'vendor_id_cleared'
  | 'customer_data_platform_id_cleared'
  | 'nami_device_id_cleared'
  | 'anonymous_mode_on'
  | 'anonymous_mode_off';
