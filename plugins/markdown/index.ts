import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import { PluginOption } from 'vite';

import { markdownToHtml } from './markdownToHtml';

const cache: Record<string, { code: string; mtime: number }> = {};

const markdownPlugin = (): PluginOption => {
  return {
    name: 'vite-plugin-markdown',
    config: ({ base }): void => {
      process.env.BASE_URL = base;
    },
    transform: (raw: string, id: string): null | { code: string } => {
      if (!/\.md$/.test(id)) {
        return null;
      }

      const stat = fs.statSync(id);
      const cached = cache[id];

      if (cached && cached.mtime === stat.mtimeMs) {
        return { code: cached.code };
      }

      try {
        const markdown = fs.readFileSync(id, 'utf-8');
        const matterResult = matter(markdown);
        const content = matterResult.content
          .replace(/{{\s*?site.baseurl\s*?}}\/assets\//g, `${process.env.BASE_URL || '/'}imgs/posts/`)
          .replaceAll('/_assets/posts/', `${process.env.BASE_URL || '/'}imgs/posts/`)
          .replace(/({% raw %}|{% endraw %})/g, '');
        const html = markdownToHtml(content);
        const code = [
          `const attributes = ${JSON.stringify(matterResult.data)};`,
          `const content = ${JSON.stringify(html)};`,
          `export { attributes, content }`,
        ].join('\n');
        cache[id] = { code, mtime: stat.mtimeMs };

        return { code };
      } catch (error) {
        console.log({ error, id });
        return null;
      }
    },
    configureServer: (server): void => {
      server.watcher.add(path.resolve(process.cwd(), './_posts'));
      server.watcher.add(path.resolve(process.cwd(), './_authors'));
    },
  };
};

export default markdownPlugin;
