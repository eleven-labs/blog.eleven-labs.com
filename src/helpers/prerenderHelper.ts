import i18next, { i18n } from 'i18next';
import { generatePath } from 'react-router-dom';

import { i18nConfig } from '@/config/i18n';
import { AUTHORIZED_LANGUAGES, CATEGORIES, DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { getData } from '@/helpers/dataHelper';

export const getI18nInstanceByLang = (lang: string): i18n => {
  const i18n = i18next.createInstance();
  i18n.init(i18nConfig);
  i18n.changeLanguage(lang);
  return i18n;
};

export const getUrlsByLang = (options: { baseUrl?: string }): { lang: string; url: string }[] => {
  const data = getData();
  const urlsByLang = AUTHORIZED_LANGUAGES.reduce<ReturnType<typeof getUrlsByLang>>(
    (currentUrls, lang) => [
      ...currentUrls,
      {
        lang,
        url: generatePath(PATHS.HOME, { lang }),
      },
      ...CATEGORIES.filter((categoryName) =>
        data.postsByLang[lang].find((post) => post?.categories?.includes(categoryName))
      ).map<ReturnType<typeof getUrlsByLang>[0]>((categoryName) => ({
        lang,
        url: generatePath(PATHS.CATEGORY, {
          lang,
          categoryName,
        }),
      })),
      ...data.postsByLang[lang].map<ReturnType<typeof getUrlsByLang>[0]>((post) => ({
        lang: lang,
        url: generatePath(PATHS.POST, {
          lang: lang,
          slug: post.slug,
        }),
      })),
      ...data.authors.reduce<ReturnType<typeof getUrlsByLang>>((currentAuthorUrls, author) => {
        const authorHasPosts = Boolean(data.postsByLang[lang].find((post) => post.authors.includes(author.username)));
        if (authorHasPosts) {
          currentAuthorUrls.push({
            lang,
            url: generatePath(PATHS.AUTHOR, {
              lang,
              authorUsername: author.username,
            }),
          });
        }
        return currentAuthorUrls;
      }, []),
    ],
    []
  );

  return [
    {
      lang: DEFAULT_LANGUAGE,
      url: PATHS.ROOT,
    },
    ...urlsByLang,
  ].map((param) => ({
    lang: param.lang,
    url: param.url.replace(/^\//, options.baseUrl || '/'),
  }));
};
