import { InitOptions } from 'i18next';

import { BASE_URL, DEFAULT_LANGUAGE, IS_DEBUG, LanguageEnum, LANGUAGES_AVAILABLE } from '@/constants';
import translationsEn from '@/translations/en.translations.json';
import frTranslations from '@/translations/fr.translations.json';

export const i18nConfig = {
  load: 'languageOnly',
  preload: LANGUAGES_AVAILABLE,
  whitelist: LANGUAGES_AVAILABLE,
  fallbackLng: IS_DEBUG ? LanguageEnum.DT : DEFAULT_LANGUAGE,
  resources: {
    fr: { messages: frTranslations },
    en: { messages: translationsEn },
  },
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
