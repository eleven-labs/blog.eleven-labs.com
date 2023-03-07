import { useHead, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';

import { PATHS } from '@/constants';
import { getPostDataPage } from '@/helpers/apiHelper';

export type UseSeoOptions = {
  title: string;
  post?: Awaited<ReturnType<typeof getPostDataPage>>;
};

export const useSeo = ({ title, post }: UseSeoOptions): void => {
  const { i18n } = useTranslation();
  useHead({
    title: title,
    metas: [
      { property: 'og:title', content: title },
      { property: 'og:locale', content: i18n.language },
    ],
  });

  const jsonLd: object[] = [];
  if (post) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: '2015-02-05T08:00:00+08:00',
      author: post.authors.map((author) => ({
        '@type': 'Person',
        name: author.name,
        url: generatePath(PATHS.AUTHOR, { authorUsername: author.username }),
      })),
      publisher: {
        '@type': 'Organization',
        name: 'Eleven Labs',
        logo: {
          '@type': 'ImageObject',
          url: 'https://blog.eleven-labs.com/imgs/logo.png',
        },
      },
    });
  }

  jsonLd.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Blog Eleven Labs',
    url: 'https://blog.eleven-labs.com',
    image: 'https://blog.eleven-labs.com/imgs/logo.png',
  });

  useScript({
    type: 'application/ld+json',
    text: JSON.stringify(jsonLd),
  });
};
