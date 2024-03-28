import { Resource } from 'i18next';

import translationsEn from '@/translations/en.translations.json';
import frTranslations from '@/translations/fr.translations.json';

export const i18nResources: Resource = {
  fr: { messages: frTranslations },
  en: { messages: translationsEn },
};
