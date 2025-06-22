export type NamiConfiguration = {
  appPlatformID: string;
  logLevel: string;
  namiCommands?: string[];
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
  promoId?: string | null;
  promoToken?: string | null;
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

// NamiCampaignManager
export type NamiCampaign = {
  name: string;
  rule: string;
  segment: string;
  paywall: string;
  type: NamiCampaignRuleType;
  value?: string | null;
  form_factors: NamiFormFactor[];
  external_segment: string | null;
};

export enum NamiCampaignRuleType {
  DEFAULT = 'default',
  LABEL = 'label',
  UNKNOWN = 'unknown',
  URL = 'url',
}

type NamiFormFactor = {
  form_factor?: string;
  supports_portrait?: boolean;
  supports_landscape?: boolean;
};

export enum LaunchCampaignError {
  DEFAULT_CAMPAIGN_NOT_FOUND = 0,
  LABELED_CAMPAIGN_NOT_FOUND = 1,
  CAMPAIGN_DATA_NOT_FOUND = 2,
  PAYWALL_ALREADY_DISPLAYED = 3,
  SDK_NOT_INITIALIZED = 4,
  PAYWALL_COULD_NOT_DISPLAY = 5,
  URL_CAMPAIGN_NOT_FOUND = 6,
  PRODUCT_DATA_NOT_FOUND = 7,
  PRODUCT_GROUPS_NOT_FOUND = 8,
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
  // Custom object used as data source for advanced paywall components
  customObject?: {
    [key: string]: any;
  };
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

export type NamiPurchaseDetails = {
  product: NamiSKU;
  transactionID?: string;
  originalTransactionID?: string;
  orderId?: string;
  purchaseToken?: string;
  receiptId?: string;
  localizedPrice?: string;
  price?: string;
  currencyCode?: string;
  userId?: string;
  marketplace?: string;
};

export type NamiPurchaseSuccessApple = {
  product: NamiSKU;
  transactionID: string;
  originalTransactionID: string;
  price: string;
  currencyCode: string;
};

export type NamiPurchaseSuccessGooglePlay = {
  product: NamiSKU;
  orderId: string;
  purchaseToken: string;
};

export type NamiPurchaseSuccessAmazon = {
  product: NamiSKU;
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
  DEEPLINK = 'DEEPLINK',
  TOGGLE_CHANGE = 'TOGGLE_CHANGE',
  PAGE_CHANGE = 'PAGE_CHANGE',
  SLIDE_CHANGE = 'SLIDE_CHANGE',
  COLLAPSIBLE_DRAWER_OPEN = 'COLLAPSIBLE_DRAWER_OPEN',
  COLLAPSIBLE_DRAWER_CLOSE = 'COLLAPSIBLE_DRAWER_CLOSE',
  VIDEO_STARTED = 'VIDEO_STARTED',
  VIDEO_PAUSED = 'VIDEO_PAUSED',
  VIDEO_RESUMED = 'VIDEO_RESUMED',
  VIDEO_ENDED = 'VIDEO_ENDED',
  VIDEO_CHANGED = 'VIDEO_CHANGED',
  VIDEO_MUTED = 'VIDEO_MUTED',
  VIDEO_UNMUTED = 'VIDEO_UNMUTED',
  UNKNOWN = 'UNKNOWN',
}

// NamiPurchaseManager
export type NamiPurchase = {
  sku?: NamiSKU;
  skuId: string;
  transactionIdentifier?: string;
  purchaseToken?: string;
  expires?: Date;
  purchaseInitiatedTimestamp: Date;
  purchaseSource?: 'CAMPAIGN' | 'MARKETPLACE' | 'UNKNOWN';
};

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

export type NamiPaywallEvent = {
  action: NamiPaywallAction;
  campaignId?: string;
  campaignName?: string;
  campaignType?: string;
  campaignLabel?: string;
  campaignUrl?: string;
  paywallId?: string;
  paywallName?: string;
  componentChange?: NamiPaywallComponentChange;
  segmentId?: string;
  externalSegmentId?: string;
  deeplinkUrl?: string;
  sku?: NamiSKU;
  purchaseError?: string;
  purchases?: NamiPurchase[];
  videoMetadata?: NamiPaywallEventVideoMetadata;
  timeSpentOnPaywall?: number;
};

export type NamiPaywallActionHandler = (event: NamiPaywallEvent) => void;

export type NamiPaywallComponentChange = {
  id?: string;
  name?: string;
};

export type NamiPaywallEventVideoMetadata = {
  id?: string;
  name?: string;
  url?: string;
  loopVideo: boolean;
  muteByDefault: boolean;
  autoplayVideo: boolean;
  contentTimecode?: number;
  contentDuration?: number;
};

export type NamiFlowHandoffPayload = {
  handoffTag: string;
  handoffData?: Record<string, any>;
};
