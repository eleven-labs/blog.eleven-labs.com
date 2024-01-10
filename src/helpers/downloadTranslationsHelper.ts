import fetch from 'cross-fetch';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { LanguageEnum, LANGUAGES_AVAILABLE } from '@/constants';

const getTranslations = (lang: (typeof LANGUAGES_AVAILABLE)[number]): Promise<string> => {
  const locales: Record<LanguageEnum.FR | LanguageEnum.EN, string> = {
    [LanguageEnum.FR]: 'fr-FR',
    [LanguageEnum.EN]: 'en-GB',
  };

  return fetch(`https://localise.biz/api/export/locale/${locales[lang]}.json?key=${process.env.LOCO_API_KEY}`).then(
    (response) => response.json()
  );
};

export const downloadTranslations = async (): Promise<void> => {
  for (const lang of LANGUAGES_AVAILABLE) {
    const translations = await getTranslations(lang);
    writeFileSync(
      resolve(process.cwd(), 'src/translations', `${lang}.translations.json`),
      JSON.stringify(translations, null, 2),
      'utf-8'
    );
  }

  console.log('🦖 The translations have been uploaded');
};
