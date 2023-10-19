import { useMeta, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { useTitle } from '@/hooks/useTitle';
import { PostPageData } from '@/types';

export type UseSeoOptions = {
  title: string;
  post: PostPageData;
};

export const useSeoPost = ({ title, post }: UseSeoOptions): void => {
  const { i18n } = useTranslation();
  useTitle(title);
  useMeta({ name: 'author', content: post.authors.map((author) => author.name).join(', ') });
  useMeta({ name: 'description', content: post.excerpt });
  useMeta({ property: 'og:type', content: 'article' });
  useMeta({ property: 'og:description', content: post.excerpt });

  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
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
    }),
  });
};
