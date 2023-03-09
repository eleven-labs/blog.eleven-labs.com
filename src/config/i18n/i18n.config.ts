import { InitOptions } from 'i18next';

import { AUTHORIZED_LANGUAGES, BASE_URL, DEFAULT_LANGUAGE } from '@/constants';
import translationsEn from '@/translations/en.translations.json';
import frTranslations from '@/translations/fr.translations.json';

export const i18nConfig = {
  load: 'languageOnly',
  preload: AUTHORIZED_LANGUAGES,
  whitelist: AUTHORIZED_LANGUAGES,
  fallbackLng: DEFAULT_LANGUAGE,
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
