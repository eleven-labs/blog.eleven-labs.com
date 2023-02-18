import { StaticPayload } from 'hoofd/dist/dispatcher';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const getLinksAndScripts = (options: {
  dirname: string;
  baseUrl?: string;
}): {
  links?: StaticPayload['links'];
  scripts?: StaticPayload['scripts'];
} => {
  const manifest = JSON.parse(readFileSync(resolve(options.dirname, 'public/manifest.json'), { encoding: 'utf-8' }));
  const manifestEntryClient = manifest['src/entry-client.tsx'];

  return {
    links: manifestEntryClient['css']?.map((file: string) => ({
      rel: 'stylesheet',
      href: `${options.baseUrl || '/'}${file}`,
    })),
    scripts: [
      {
        type: 'module',
        src: `${options.baseUrl || '/'}${manifestEntryClient['file']}`,
      },
    ],
  };
};
