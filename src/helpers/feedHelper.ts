import { generatePath } from '@remix-run/router';
import { Feed } from 'feed';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sanitizeHtml from 'sanitize-html';

import { blogUrl } from '@/config/website';
import { PATHS } from '@/constants';
import { getPosts } from '@/helpers/contentHelper';

export const generateFeedFile = (options: { rootDir: string }): void => {
  const posts = getPosts();
  const feed = new Feed({
    title: 'Blog Eleven Labs',
    description: `L'actualité tech`,
    id: blogUrl,
    link: blogUrl,
    image: `${blogUrl}/imgs/logo.png`,
    favicon: `${blogUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Blog Eleven Labs`,
    generator: 'awesome',
    author: {
      name: 'Eleven Labs',
      email: 'contact@eleven-labs.com',
    },
  });

  for (const { lang, slug, ...post } of posts.slice(0, 15)) {
    const url = `${blogUrl}${generatePath(PATHS.POST, { lang, slug })}`;
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      date: new Date(post.date),
      description: post.excerpt,
      content: sanitizeHtml(post.content),
    });
  }

  writeFileSync(resolve(options.rootDir, `feed.xml`), feed.rss2());
};
