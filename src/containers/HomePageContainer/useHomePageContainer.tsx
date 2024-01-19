import { HomePageProps } from '@eleven-labs/design-system';
import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { blogUrl, websiteUrl } from '@/config/website';
import { ContentTypeEnum, DEFAULT_LANGUAGE, LanguageEnum, PATHS } from '@/constants';
import { TransWithHtml } from '@/containers/TransWithHtml';
import { generatePath } from '@/helpers/routerHelper';
import { useNewsletterCard } from '@/hooks/useNewsletterCard';
import { usePostsForCardList } from '@/hooks/usePostsForCardList';
import { useTitle } from '@/hooks/useTitle';
import { PostListPageData } from '@/types';

export const useHomePageContainer = (): HomePageProps => {
  const { t, i18n } = useTranslation();
  const postListPageData = useLoaderData() as PostListPageData;
  const newsletterCard = useNewsletterCard();
  const lastArticlesForCardList = usePostsForCardList({
    posts: postListPageData.posts
      .filter(
        (post) =>
          post.contentType === ContentTypeEnum.ARTICLE &&
          (i18n.language === LanguageEnum.DT || post.lang === i18n.language)
      )
      .slice(0, 4),
  });
  const lastTutorialsForCardList = usePostsForCardList({
    posts: postListPageData.posts
      .filter(
        (post) =>
          post.contentType === ContentTypeEnum.TUTORIAL &&
          (i18n.language === LanguageEnum.DT || post.lang === i18n.language)
      )
      .slice(0, 2),
  });

  useTitle(t('pages.home.seo.title'));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(PATHS.ROOT, {
      lang: DEFAULT_LANGUAGE,
    })}`,
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
    lastTutorialsBlock: {
      title: <TransWithHtml i18nKey="pages.home.last-tutorials-block.title" onlyLineBreak />,
      description: <TransWithHtml i18nKey="pages.home.last-tutorials-block.description" />,
      tutorialLabel: t('common.tutorial-tag'),
      posts: lastTutorialsForCardList,
      linkSeeMore: {
        label: t('pages.home.last-tutorials-block.link-see-more'),
        href: generatePath(PATHS.CATEGORY, { categoryName: ContentTypeEnum.TUTORIAL, lang: i18n.language }),
      },
    },
    newsletterCard,
  };
};
