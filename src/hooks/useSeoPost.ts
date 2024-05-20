import { useMeta, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';

import { DEVICES, IMAGE_FORMATS, PATHS } from '@/constants';
import { generateUrl, getCoverPath } from '@/helpers/assetHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useTitle } from '@/hooks/useTitle';
import { ImagePositionType, PostPageData } from '@/types';

export const useSeoPost = (post: PostPageData): void => {
  const { i18n } = useTranslation();
  const coverPath = getCoverPath({
    path: post.cover?.path,
    format: IMAGE_FORMATS.POST_COVER,
    pixelRatio: 2,
    device: DEVICES.DESKTOP,
    position: post?.cover?.position as ImagePositionType,
  });
  const coverUrl = generateUrl(coverPath);
  const description = post?.seo?.description ?? post.excerpt;
  const authors = post.authors.map((author) => author.name).join(', ');

  useTitle(post?.seo?.title ?? post.title);
  useMeta({ name: 'author', content: authors });
  useMeta({ name: 'description', content: description });

  useMeta({ property: 'og:type', content: 'article' });
  useMeta({ property: 'og:description', content: description });
  useMeta({ property: 'og:image', content: coverUrl });

  useMeta({ property: 'article:author', content: authors });
  useMeta({ property: 'article:publisher', content: 'Eleven Labs' });
  useMeta({ property: 'article:published_time', content: post.date });

  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      author: post.authors.map((author) => ({
        '@type': 'Person',
        name: author.name,
        url: generatePath(PATHS.AUTHOR, { authorUsername: author.username, lang: i18n.language }),
      })),
      image: {
        '@type': 'ImageObject',
        url: coverUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Eleven Labs',
        logo: {
          '@type': 'ImageObject',
          url: generateUrl('/imgs/logo.png'),
        },
      },
    }),
  });
};
