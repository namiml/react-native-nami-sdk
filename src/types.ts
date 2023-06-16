export type NamiConfiguration = {
  'appPlatformID-apple': string;
  'appPlatformID-android': string;
  logLevel: string;
  namiLanguageCode?: NamiLanguageCodes;
  initialConfig?: string;
};

export type NamiLanguageCodes =
  | 'af'
  | 'ar'
  | 'ar-dz'
  | 'ast'
  | 'az'
  | 'bg'
  | 'be'
  | 'bn'
  | 'br'
  | 'bs'
  | 'ca'
  | 'cs'
  | 'cy'
  | 'da'
  | 'de'
  | 'dsb'
  | 'el'
  | 'en'
  | 'en-au'
  | 'en-gb'
  | 'eo'
  | 'es'
  | 'es-ar'
  | 'es-co'
  | 'es-mx'
  | 'es-ni'
  | 'es-ve'
  | 'et'
  | 'eu'
  | 'fa'
  | 'fi'
  | 'fr'
  | 'fy'
  | 'ga'
  | 'gd'
  | 'gl'
  | 'he'
  | 'hi'
  | 'hr'
  | 'hsb'
  | 'hu'
  | 'hy'
  | 'ia'
  | 'id'
  | 'ig'
  | 'io'
  | 'is'
  | 'it'
  | 'ja'
  | 'ka'
  | 'kab'
  | 'kk'
  | 'km'
  | 'kn'
  | 'ko'
  | 'ky'
  | 'lb'
  | 'lt'
  | 'lv'
  | 'mk'
  | 'ml'
  | 'mn'
  | 'mr'
  | 'my'
  | 'nb'
  | 'ne'
  | 'nl'
  | 'nn'
  | 'os'
  | 'pa'
  | 'pl'
  | 'pt'
  | 'pt-br'
  | 'ro'
  | 'ru'
  | 'sk'
  | 'sl'
  | 'sq'
  | 'sr'
  | 'sr-latn'
  | 'sv'
  | 'sw'
  | 'ta'
  | 'te'
  | 'tg'
  | 'th'
  | 'tk'
  | 'tr'
  | 'tt'
  | 'udm'
  | 'uk'
  | 'ur'
  | 'uz'
  | 'vi'
  | 'zh-hans'
  | 'zh-hant';

export type NamiSKU = {
  id: string;
  name?: string;
  skuId: string;
  appleProduct?: AppleProduct;
  googleProduct?: GoogleProduct;
  amazonProduct?: AmazonProduct;
  type: NamiSKUType;
};

export enum NamiPurchaseState {
  PENDING = 'pending',
  PURCHASED = 'purchased',
  CONSUMED = 'consumed',
  RESUBSCRIBED = 'resubscribed',
  UNSUBSCRIBED = 'unsubscribed',
  DEFERRED = 'deferred',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  UNKNOWN = 'unknown',
}

export enum NamiRestorePurchasesState {
  STARTED = 'started',
  FINISHED = 'finished',
  ERROR = 'error',
}

export type NamiSKUType = 'unknown' | 'one_time_purchase' | 'subscription';

export type AppleProduct = {
  localizedDescription: string;
  localizedMultipliedPrice: string;
  localizedPrice: string;
  localizedTitle: string;
  price: string;
  priceCurrency: string;
  priceLanguage: string;
};

export type GoogleProduct = {};

export type AmazonProduct = {};

// NameCampaignManager
export type NamiCampaign = {
  id: string;
  rule: string;
  segment: string;
  paywall: string;
  type: NamiCampaignRuleType;
  value?: string | null;
};

export enum NamiCampaignRuleType {
  DEFAULT = 'default',
  LABEL = 'label',
  UNKNOWN = 'unknown',
}

export enum LaunchCampaignError {
  DEFAULT_CAMPAIGN_NOT_FOUND = 0,
  LABELED_CAMPAIGN_NOT_FOUND = 1,
  CAMPAIGN_DATA_NOT_FOUND = 2,
  PAYWALL_ALREADY_DISPLAYED = 3,
  SDK_NOT_INITIALIZED = 4,
}

export enum LaunchCampaignResultAction {
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
}

export type FailureResultObject = {
  error: string;
};

export type PaywallLaunchContext = {
  // Can contain multiple product group identifiers
  productGroups?: string[];
  // Key-value pairs used to override template values
  customAttributes: {
    [key: string]: string;
  };
};

// NamiCustomerManager
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

// NamiEntitlementManager
export type NamiEntitlement = {
  activePurchases: NamiPurchase[];
  desc: string;
  name: string;
  namiId: string;
  purchasedSkus: NamiSKU[];
  referenceId: string;
  relatedSkus: NamiSKU[];
};

// NamiPayWallManager
export type NamiPurchaseSuccessApple = {
  product: NamiSKU;
  transactionID: string;
  originalTransactionID: string;
  originalPurchaseDate: number;
  purchaseDate: number;
  expiresDate?: number;
  price: string;
  currencyCode: string;
  locale: string;
};

export type NamiPurchaseSuccessGooglePlay = {
  product: NamiSKU;
  orderId: string;
  purchaseDate: number;
  expiresDate?: number;
  purchaseToken: string;
  purchaseSource: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
};

export type NamiPurchaseSuccessAmazon = {
  product: NamiSKU;
  purchaseDate: number;
  expiresDate?: number;
  purchaseSource: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
  receiptId: string;
  localizedPrice: string;
  userId: string;
  marketplace: string;
};

export enum NamiPaywallAction {
  BUY_SKU = 'BUY_SKU',
  SELECT_SKU = 'SELECT_SKU',
  RESTORE_PURCHASES = 'RESTORE_PURCHASES',
  SIGN_IN = 'SIGN_IN',
  CLOSE_PAYWALL = 'CLOSE_PAYWALL',
  SHOW_PAYWALL = 'SHOW_PAYWALL',
  PURCHASE_SELECTED_SKU = 'PURCHASE_SELECTED_SKU',
  PURCHASE_SUCCESS = 'PURCHASE_SUCCESS',
  PURCHASE_FAILED = 'PURCHASE_FAILED',
  PURCHASE_CANCELLED = 'PURCHASE_CANCELLED',
  PURCHASE_PENDING = 'PURCHASE_PENDING',
  PURCHASE_UNKNOWN = 'PURCHASE_UNKNOWN',
  PURCHASE_DEFERRED = 'PURCHASE_DEFERRED',
}

// NamiPurchaseManager
export type NamiPurchase = {
  sku?: NamiSKU;
  skuId: string;
  transactionIdentifier?: string;
  expires?: Date;
  purchaseInitiatedTimestamp: Date;
  purchaseSource?: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
};

export enum NamiPurchaseState {
  PURCHASED = 'PURCHASED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLEDd',
  PENDING = 'PENDING',
  UNKNOWN = 'UNKNOWN',
}

export type NamiPurchasesState =
  | 'pending'
  | 'purchased'
  | 'consumed'
  | 'resubscribed'
  | 'unsubscribed'
  | 'deferred'
  | 'failed'
  | 'cancelled'
  | 'unknown';
