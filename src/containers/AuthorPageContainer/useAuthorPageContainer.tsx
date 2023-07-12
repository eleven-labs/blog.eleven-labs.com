import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { type getDataFromAuthorPage } from '@/helpers/contentHelper';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { AuthorPageProps, SocialNetworkName } from '@/pages/AuthorPage';
import { useTitle } from '@/hooks/useTitle';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t } = useTranslation();
  const resultAuthorPage = useLoaderData() as ReturnType<typeof getDataFromAuthorPage>;
  const newsletterBlock = useNewsletterBlock();
  useTitle(t('seo.author.title', { authorName: resultAuthorPage?.author.name }));

  if (!resultAuthorPage) {
    return;
  }

  const { author, posts } = resultAuthorPage;
  return {
    backLink: <BackLinkContainer />,
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
