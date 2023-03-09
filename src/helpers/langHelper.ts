import { AUTHORIZED_LANGUAGES, DEFAULT_LANGUAGE } from '@/constants';

export const getValidLanguage = (lang: string): string =>
  AUTHORIZED_LANGUAGES.includes(lang) ? lang : DEFAULT_LANGUAGE;
