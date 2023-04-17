import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { HtmlTemplateProps } from '@/templates/HtmlTemplate';

export const getHtmlTemplatePropsByManifest = (options: {
  dirname: string;
  baseUrl?: string;
}): Pick<HtmlTemplateProps, 'links' | 'styles' | 'scripts'> => {
  const manifest = JSON.parse(readFileSync(resolve(options.dirname, 'manifest.json'), { encoding: 'utf-8' }));
  const manifestEntryClient = manifest['src/entry-client.tsx'];

  return {
    links: manifestEntryClient['css']?.map((file: string) => ({
      rel: 'stylesheet',
      href: `${options.baseUrl || '/'}${file}`,
    })),
    styles: manifestEntryClient['css']?.map((file: string) => ({
      text: readFileSync(resolve(options.dirname, file), {
        encoding: 'utf8',
      }),
    })),
    scripts: [
      {
        type: 'module',
        src: `${options.baseUrl || '/'}${manifestEntryClient['file']}`,
      },
    ],
  };
};
