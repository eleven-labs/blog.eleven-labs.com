import type { ImagePositionType, PostPageData } from '@/types';

import { useMeta, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { logo } from '@/config/website';
import { PATHS, SOCIAL_IMAGE_FORMAT } from '@/constants';
import { generateUrl, getSocialCoverPath } from '@/helpers/assetHelper';
import { toIsoDuration } from '@/helpers/durationHelper';
import { getUrl } from '@/helpers/getUrlHelper';
import { generatePath, getHomePath } from '@/helpers/routerHelper';
import { useBreadcrumbListSchema } from '@/hooks/useBreadcrumbListSchema';
import { useTitle } from '@/hooks/useTitle';

export const useSeoPost = (post: PostPageData): void => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const coverPath = getSocialCoverPath({
    path: post.cover?.path,
    position: post?.cover?.position as ImagePositionType,
  });
  const coverUrl = generateUrl(coverPath);
  const description = post?.seo?.description ?? post.excerpt;
  const authors = post.authors.map((author) => author.name).join(', ');
  const postUrl = getUrl(location.pathname);
  const dateModified = post.updatedAt ?? post.date;
  const categoryName = post.categories?.[0];

  useTitle(post?.seo?.title ?? post.title);
  useMeta({ name: 'author', content: authors });
  useMeta({ name: 'description', content: description });

  useMeta({ property: 'og:type', content: 'article' });
  useMeta({ property: 'og:description', content: description });
  useMeta({ property: 'og:image', content: coverUrl });
  useMeta({ property: 'og:image:width', content: `${SOCIAL_IMAGE_FORMAT.width}` });
  useMeta({ property: 'og:image:height', content: `${SOCIAL_IMAGE_FORMAT.height}` });
  useMeta({ name: 'twitter:card', content: 'summary_large_image' });
  useMeta({ name: 'twitter:image', content: coverUrl });

  useMeta({ property: 'article:author', content: authors });
  useMeta({ property: 'article:publisher', content: 'Eleven Labs' });
  useMeta({ property: 'article:published_time', content: post.date });
  useMeta({ property: 'article:modified_time', content: dateModified });

  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': postUrl,
      },
      url: postUrl,
      headline: post.title,
      description: post.excerpt,
      inLanguage: post.lang,
      datePublished: post.date,
      dateModified,
      timeRequired: toIsoDuration(post.readingTime),
      ...(categoryName ? { articleSection: t(`common.categories.${categoryName}`) } : {}),
      author: post.authors.map((author) => ({
        '@type': 'Person',
        name: author.name,
        url: getUrl(generatePath(PATHS.AUTHOR, { authorUsername: author.username, lang: i18n.language })),
      })),
      image: {
        '@type': 'ImageObject',
        url: coverUrl,
        width: SOCIAL_IMAGE_FORMAT.width,
        height: SOCIAL_IMAGE_FORMAT.height,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Eleven Labs',
        logo: {
          '@type': 'ImageObject',
          url: generateUrl(logo.path),
          width: logo.width,
          height: logo.height,
        },
      },
    }),
  });

  useBreadcrumbListSchema([
    { name: t('common.breadcrumb.home_label'), path: getHomePath(i18n.language) },
    {
      name: t(`common.categories.${categoryName ?? 'all'}`),
      path: generatePath(PATHS.CATEGORY, { lang: i18n.language, categoryName: categoryName ?? 'all' }),
    },
    { name: post.title, path: generatePath(PATHS.POST, { lang: i18n.language, slug: post.slug }) },
  ]);
};
