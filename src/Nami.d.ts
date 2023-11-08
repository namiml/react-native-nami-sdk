export const Nami: {
  configure: (
    config: NamiConfiguration,
    resultCallback?: (resultObject: { success: boolean }) => void,
  ) => void;
};

export type NamiConfiguration = {
  'appPlatformID-apple': string;
  'appPlatformID-android': string;
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
