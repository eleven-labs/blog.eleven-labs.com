import type { Redirect } from './getUrls';

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { getUrl } from '@/helpers/getUrlHelper';

const escapeHtmlAttribute = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * S3 cannot answer with a 301 on its own: until the CDN redirects these urls, the page it serves redirects
 * at once, and its canonical points to the target so that the former url is merged into it.
 */
export const getRedirectHtml = (redirect: Pick<Redirect, 'lang' | 'to'>): string => {
  const target = escapeHtmlAttribute(redirect.to);
  const canonicalUrl = escapeHtmlAttribute(getUrl(redirect.to.split('#')[0]));

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
  manifestFilePath: string;
}): void => {
  // Read by bin/apply-s3-redirects.sh, which turns each of these pages into a 301 once deployed on S3
  writeFileSync(
    options.manifestFilePath,
    JSON.stringify(options.redirects.map(({ from, to }) => ({ from, to })), null, 2),
    'utf8'
  );

  for (const redirect of options.redirects) {
    const filePath = resolve(options.rootDir, `${redirect.from.replace(options.baseUrl, '')}/index.html`);

    const dirPath = dirname(filePath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    writeFileSync(filePath, getRedirectHtml(redirect), 'utf8');
  }
};
