import { HeadObject, useHead, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { generatePath, useLocation } from 'react-router-dom';

import { PATHS } from '@/constants';
import { type getDataFromPostPage } from '@/helpers/contentHelper';

export type UseSeoOptions = {
  title: string;
  post?: ReturnType<typeof getDataFromPostPage>;
};

export const useSeo = ({ title, post }: UseSeoOptions): void => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const jsonLd: object[] = [];
  const metas: HeadObject['metas'] = [
    { property: 'og:title', content: title },
    { property: 'og:locale', content: i18n.language },
    { property: 'og:site_name', content: 'Blog Eleven Labs' },
    { property: 'og:url', content: location.pathname + location.search },
  ];

  if (post) {
    metas.push(
      ...[
        { name: 'author', content: post.authors.map((author) => author.name).join(', ') },
        { name: 'description', content: post.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:description', content: post.excerpt },
      ]
    );
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post?.date,
      author: post.authors.map((author) => ({
        '@type': 'Person',
        name: author.name,
        url: generatePath(PATHS.AUTHOR, { authorUsername: author.username, lang: i18n.language }),
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

  useHead({
    title,
    metas,
  });
  useScript({
    type: 'application/ld+json',
    text: JSON.stringify(jsonLd),
  });
};
