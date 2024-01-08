import { AuthorPageProps, SocialNetworkName } from '@eleven-labs/design-system';
import { useLink } from 'hoofd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useParams } from 'react-router-dom';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, PATHS } from '@/constants';
import { PostCardListContainer, PostCardListContainerProps } from '@/containers/PostCardListContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useNewsletterCard } from '@/hooks/useNewsletterCard';
import { useTitle } from '@/hooks/useTitle';
import { AuthorPageData } from '@/types';

export const useAuthorPageContainer = (): AuthorPageProps | undefined => {
  const { t, i18n } = useTranslation();
  const { authorUsername, page } = useParams<{ authorUsername: string; page?: string }>();
  const authorPageData = useLoaderData() as AuthorPageData;
  const newsletterCard = useNewsletterCard();
  useTitle(t('seo.author.title', { authorName: authorPageData?.author.name }));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(PATHS.AUTHOR, {
      lang: DEFAULT_LANGUAGE,
      authorUsername: authorPageData?.author?.username,
    })}`,
  });

  const getPaginatedLink: PostCardListContainerProps['getPaginatedLink'] = (page: number) => ({
    href: generatePath(PATHS.AUTHOR_PAGINATED, { lang: i18n.language, authorUsername, page }),
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
    postCardList: (
      <PostCardListContainer
        getPaginatedLink={getPaginatedLink}
        currentPage={page ? parseInt(page, 10) : 1}
        allPosts={posts}
      />
    ),
    newsletterCard,
  };
};
