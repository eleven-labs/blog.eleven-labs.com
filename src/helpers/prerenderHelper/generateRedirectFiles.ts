import type { Redirect } from './getUrls';

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { BASE_URL } from '@/constants';
import { getUrl } from '@/helpers/getUrlHelper';

const escapeHtmlAttribute = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * The 301 is answered by the origin request Lambda@Edge (see documentations/infra.md).
 * Should it not run, S3 serves this page instead: it redirects at once, and its canonical points to the
 * target so that the former url is merged into it.
 */
export const getRedirectHtml = (redirect: Pick<Redirect, 'lang' | 'to'>): string => {
  const target = escapeHtmlAttribute(redirect.to);
  // HOST_URL already ends with the base url of the environment, the path must not repeat it
  const canonicalUrl = escapeHtmlAttribute(getUrl(`/${redirect.to.split('#')[0].slice(BASE_URL.length)}`));

  return [
    '<!DOCTYPE html>',
    `<html lang="${escapeHtmlAttribute(redirect.lang)}">`,
    '<head>',
    '<meta charset="utf-8">',
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta http-equiv="refresh" content="0; url=${target}">`,
    `<script>window.location.replace(${JSON.stringify(redirect.to).replace(/</g, '\\u003c')});</script>`,
    '</head>',
    '<body>',
    `<a href="${target}">${target}</a>`,
    '</body>',
    '</html>',
  ].join('');
};

export const generateRedirectFiles = (options: {
  rootDir: string;
  baseUrl: string;
  redirects: Redirect[];
}): void => {
  for (const redirect of options.redirects) {
    const filePath = resolve(options.rootDir, `${redirect.from.replace(options.baseUrl, '')}/index.html`);

    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, getRedirectHtml(redirect), 'utf8');
  }
};
