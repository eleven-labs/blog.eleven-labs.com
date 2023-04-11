import i18next, { i18n } from 'i18next';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { generatePath } from 'react-router-dom';

import { i18nConfig } from '@/config/i18n';
import { AUTHORIZED_LANGUAGES, CATEGORIES, DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { render } from '@/entry-server';
import { getAuthors, getPosts } from '@/helpers/contentHelper';
import { createRequestByUrl } from '@/helpers/requestHelper';
import { getHtmlTemplatePropsByManifest } from '@/helpers/ssrHelper';

const posts = getPosts();
const authors = getAuthors();

const getI18nInstanceByLang = (lang: string): i18n => {
  const i18n = i18next.createInstance();
  i18n.init(i18nConfig);
  i18n.changeLanguage(lang);
  return i18n;
};

const getUrlsByLang = (options: { baseUrl?: string }): { lang: string; url: string }[] => {
  const urlsByLang = AUTHORIZED_LANGUAGES.reduce<ReturnType<typeof getUrlsByLang>>((currentUrls, lang) => {
    const postsByLang: typeof posts = posts.filter((post) => post.lang === lang);
    return [
      ...currentUrls,
      {
        lang,
        url: generatePath(PATHS.HOME, { lang }),
      },
      {
        lang,
        url: generatePath(PATHS.SEARCH, { lang }),
      },
      ...CATEGORIES.filter((categoryName) => postsByLang.find((post) => post?.categories?.includes(categoryName))).map<
        ReturnType<typeof getUrlsByLang>[0]
      >((categoryName) => ({
        lang,
        url: generatePath(PATHS.CATEGORY, {
          lang,
          categoryName,
        }),
      })),
      ...postsByLang.map<ReturnType<typeof getUrlsByLang>[0]>((post) => ({
        lang: lang,
        url: generatePath(PATHS.POST, {
          lang: lang,
          slug: post.slug,
        }),
      })),
      ...authors.reduce<ReturnType<typeof getUrlsByLang>>((currentAuthorUrls, author) => {
        const authorHasPosts = Boolean(postsByLang.find((post) => post.authors.includes(author.username)));
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
    ];
  }, []);

  return [
    {
      lang: DEFAULT_LANGUAGE,
      url: PATHS.ROOT,
    },
    ...urlsByLang,
    {
      lang: DEFAULT_LANGUAGE,
      url: '/404',
    },
  ].map((param) => ({
    lang: param.lang,
    url: param.url.replace(/^\//, options.baseUrl || '/'),
  }));
};

export const generateHtmlFiles = async (options: { rootDir: string; baseUrl: string }): Promise<void> => {
  const __dirname = resolve(options.rootDir, 'public');
  const urlsByLang = getUrlsByLang({
    baseUrl: options.baseUrl,
  });
  const { styles, scripts } = getHtmlTemplatePropsByManifest({
    dirname: __dirname,
    baseUrl: options.baseUrl,
  });

  for (const { lang, url } of urlsByLang) {
    const i18n = getI18nInstanceByLang(lang);

    const html = await render({
      request: createRequestByUrl({ url }),
      i18n,
      styles,
      scripts,
    });

    const urlWithoutBaseUrl = url.replace(options.baseUrl, '');
    let fileName = 'index.html';
    if (urlWithoutBaseUrl === '404') {
      fileName = '404.html';
    } else if (urlWithoutBaseUrl) {
      fileName = `${urlWithoutBaseUrl}/index.html`;
    }
    const filePath = resolve(options.rootDir, 'public', fileName);

    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, html, 'utf8');
  }

  console.log('🦖🖨 Your static site is ready to deploy from dist');
};
