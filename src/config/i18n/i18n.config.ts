import { InitOptions } from 'i18next';

import { BASE_URL, DEFAULT_LANGUAGE, IS_DEBUG, LANGUAGES, LANGUAGES_AVAILABLE } from '@/constants';

export const i18nConfig = {
  load: 'languageOnly',
  preload: LANGUAGES_AVAILABLE,
  whitelist: LANGUAGES_AVAILABLE,
  fallbackLng: IS_DEBUG ? LANGUAGES.DT : DEFAULT_LANGUAGE,
  returnEmptyString: false,
  defaultNS: 'messages',
  ns: 'messages',
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: false,
    useSuspense: false,
  },
  detection: {
    order: ['path'],
    lookupFromPathIndex: BASE_URL.split('/').length - 2,
  },
} as InitOptions;
