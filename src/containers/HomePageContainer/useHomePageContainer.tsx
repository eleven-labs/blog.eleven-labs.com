import { HomePageProps } from '@eleven-labs/design-system';
import { useLink, useMeta } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { websiteUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, IMAGE_FORMATS, LANGUAGES, MARKDOWN_CONTENT_TYPES, PATHS } from '@/constants';
import { TransWithHtml } from '@/containers/TransWithHtml';
import { generatePath } from '@/helpers/routerHelper';
import { useNewsletterCard } from '@/hooks/useNewsletterCard';
import { usePostsForCardList } from '@/hooks/usePostsForCardList';
import { useTitle } from '@/hooks/useTitle';
import { PostListPageData } from '@/types';

export const useHomePageContainer = (): HomePageProps => {
  const { t, i18n } = useTranslation();
  useMeta({ name: 'description', content: t(`pages.home.seo.description`) });
  const postListPageData = useLoaderData() as PostListPageData;
  const newsletterCard = useNewsletterCard();
  const lastArticlesForCardList = usePostsForCardList({
    posts: postListPageData.posts
      .filter(
        (post) =>
          post.contentType === MARKDOWN_CONTENT_TYPES.ARTICLE &&
          (i18n.language === LANGUAGES.DT || post.lang === i18n.language)
      )
      .slice(0, 3),
    imageFormat: IMAGE_FORMATS.HIGHLIGHTED_ARTICLE_POST_CARD_COVER,
  });
  const lastTutorialsForCardList = usePostsForCardList({
    posts: postListPageData.posts
      .filter(
        (post) =>
          post.contentType === MARKDOWN_CONTENT_TYPES.TUTORIAL &&
          (i18n.language === LANGUAGES.DT || post.lang === i18n.language)
      )
      .slice(0, 2),
    imageFormat: IMAGE_FORMATS.HIGHLIGHTED_TUTORIAL_POST_CARD_COVER,
  });

  useTitle(t('pages.home.seo.title'));
  useLink({
    rel: 'canonical',
    href: generatePath(PATHS.ROOT, {
      lang: DEFAULT_LANGUAGE,
    }),
  });

  return {
    homeIntroBlock: {
      intro: <TransWithHtml i18nKey="pages.home.intro-block.intro" onlyLineBreak />,
      title: <TransWithHtml i18nKey="pages.home.intro-block.title" onlyLineBreak />,
      description: <TransWithHtml i18nKey="pages.home.intro-block.description" />,
      elevenLabsLink: {
        label: t('pages.home.intro-block.website-link-label'),
        href: websiteUrl,
      },
    },
    lastArticlesBlock: {
      title: <TransWithHtml i18nKey="pages.home.last-articles-block.title" onlyLineBreak />,
      posts: lastArticlesForCardList,
      linkSeeMore: {
        label: t('pages.home.last-articles-block.link-see-more'),
        href: generatePath(PATHS.CATEGORY, { categoryName: 'all', lang: i18n.language }),
      },
    },
    lastTutorialsBlock: lastTutorialsForCardList.length
      ? {
          title: <TransWithHtml i18nKey="pages.home.last-tutorials-block.title" onlyLineBreak />,
          description: <TransWithHtml i18nKey="pages.home.last-tutorials-block.description" />,
          tutorialLabel: t('common.tutorial-tag'),
          posts: lastTutorialsForCardList,
          linkSeeMore: {
            label: t('pages.home.last-tutorials-block.link-see-more'),
            href: generatePath(PATHS.CATEGORY, { categoryName: MARKDOWN_CONTENT_TYPES.TUTORIAL, lang: i18n.language }),
          },
        }
      : undefined,
    newsletterCard,
  };
};
