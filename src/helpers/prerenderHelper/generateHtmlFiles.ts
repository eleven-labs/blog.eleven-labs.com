import i18next, { i18n } from 'i18next';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { i18nResources } from '@/config/i18n/i18nResources';
import { render } from '@/entry-server';
import { createRequestByUrl } from '@/helpers/requestHelper';
import { getHtmlTemplatePropsByManifest } from '@/helpers/ssrHelper';

const getI18nInstanceByLang = (lang: string): i18n => {
  const i18n = i18next.createInstance();
  i18n.init({
    ...i18nConfig,
    resources: i18nResources,
  });
  i18n.changeLanguage(lang);
  return i18n;
};

export const generateHtmlFiles = async (options: {
  rootDir: string;
  baseUrl: string;
  urls: { lang: string; url: string }[];
}): Promise<void> => {
  const { styles, scripts } = getHtmlTemplatePropsByManifest({
    dirname: options.rootDir,
    baseUrl: options.baseUrl,
  });

  for (const { lang, url } of options.urls) {
    const i18n = getI18nInstanceByLang(lang);

    const html = await render({
      request: createRequestByUrl({ url }),
      i18n,
      styles,
      scripts,
    });

    const urlWithoutBaseUrl = url.replace(options.baseUrl, '');
    let fileName = 'index.html';
    if (url.match(/\/404\/$/)) {
      fileName = '404.html';
    } else if (urlWithoutBaseUrl) {
      fileName = `${urlWithoutBaseUrl}/index.html`;
    }
    const filePath = resolve(options.rootDir, fileName);

    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, html, 'utf8');
  }
};
