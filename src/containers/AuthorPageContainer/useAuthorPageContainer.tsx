import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useTitle } from '@/hooks/useTitle';
import { AuthorPageProps, SocialNetworkName } from '@/pages/AuthorPage';
import { AuthorPageData } from '@/types';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t } = useTranslation();
  const authorPageData = useLoaderData() as AuthorPageData;
  const newsletterBlock = useNewsletterBlock();
  useTitle(t('seo.author.title', { authorName: authorPageData?.author.name }));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(PATHS.AUTHOR, {
      lang: DEFAULT_LANGUAGE,
      authorUsername: authorPageData?.author?.username,
    })}`,
  });

  if (!authorPageData) {
    return;
  }

  const { author, posts } = authorPageData;
  return {
    author: {
      username: author.username,
      name: author.name,
      avatarImageUrl: author.avatarImageUrl,
      socialNetworks: Object.entries(author.socialNetworks || {}).map(([name, username]) => {
        const socialNetworkName = name as SocialNetworkName;
        let url: string;

        switch (socialNetworkName) {
          case 'github':
            url = `https://github.com/${username}/`;
            break;
          case 'linkedin':
            url = `https://www.linkedin.com/in/${username}/`;
            break;
          case 'twitter':
            url = `https://twitter.com/${username}/`;
            break;
        }

        return {
          name: socialNetworkName,
          url,
          username: socialNetworkName === 'twitter' ? `@${username}` : username,
        };
      }),
      content: author.content,
    },
    emptyAvatarImageUrl: getPathFile('/imgs/astronaut.png'),
    title: t('pages.author.post_preview_list_title'),
    postPreviewList: <PostPreviewListContainer allPosts={posts} />,
    newsletterBlock,
  };
};
