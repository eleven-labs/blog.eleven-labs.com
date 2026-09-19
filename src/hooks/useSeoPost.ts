import type { ImagePositionType, PostPageData } from '@/types';

import { useMeta, useScript } from 'hoofd';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import { logo } from '@/config/website';
import { DEVICES, IMAGE_FORMATS, MARKDOWN_CONTENT_TYPES, PATHS } from '@/constants';
import { generateUrl, getCoverPath } from '@/helpers/assetHelper';
import { getUrl } from '@/helpers/getUrlHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useTitle } from '@/hooks/useTitle';

export const useSeoPost = (post: PostPageData): void => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { step } = useParams<{ step?: string }>();
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
  const postUrl = getUrl(location.pathname);
  const dateModified = post.updatedAt ?? post.date;
  const categoryName = post.categories?.[0];
  // Every step of a tutorial is a page of its own, it cannot share the title of the tutorial
  const currentStepTitle =
    post.contentType === MARKDOWN_CONTENT_TYPES.TUTORIAL
      ? post.steps.find((currentStep) => currentStep.slug === step)?.title
      : undefined;
  const title = post?.seo?.title ?? post.title;

  useTitle(currentStepTitle ? `${title} - ${currentStepTitle}` : title);
  useMeta({ name: 'author', content: authors });
  useMeta({ name: 'description', content: description });

  useMeta({ property: 'og:type', content: 'article' });
  useMeta({ property: 'og:description', content: description });
  useMeta({ property: 'og:image', content: coverUrl });

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
      headline: currentStepTitle ? `${post.title} - ${currentStepTitle}` : post.title,
      description: post.excerpt,
      inLanguage: post.lang,
      datePublished: post.date,
      dateModified,
      ...(categoryName ? { articleSection: t(`common.categories.${categoryName}`) } : {}),
      author: post.authors.map((author) => ({
        '@type': 'Person',
        name: author.name,
        url: getUrl(generatePath(PATHS.AUTHOR, { authorUsername: author.username, lang: i18n.language })),
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
          url: generateUrl(logo.path),
          width: logo.width,
          height: logo.height,
        },
      },
    }),
  });

  useScript({
    type: 'application/ld+json',
    text: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('common.breadcrumb.home_label'),
          item: getUrl(generatePath(PATHS.HOME, { lang: i18n.language })),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t(`common.categories.${categoryName ?? 'all'}`),
          item: getUrl(generatePath(PATHS.CATEGORY, { lang: i18n.language, categoryName: categoryName ?? 'all' })),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: getUrl(generatePath(PATHS.POST, { lang: i18n.language, slug: post.slug })),
        },
        ...(currentStepTitle
          ? [
              {
                '@type': 'ListItem',
                position: 4,
                name: currentStepTitle,
                item: postUrl,
              },
            ]
          : []),
      ],
    }),
  });
};
