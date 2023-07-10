import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';

import { PATHS } from '@/constants';
import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { LinkContainer } from '@/containers/LinkContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { type getDataFromPostPage } from '@/helpers/contentHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useDateToString } from '@/hooks/useDateToString';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useSeoPost } from '@/hooks/useSeoPost';
import { PostPageProps } from '@/pages/PostPage';

export const usePostPageContainer = (): PostPageProps | undefined => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  const post = useLoaderData() as ReturnType<typeof getDataFromPostPage>;
  useSeoPost({
    title: post?.title || '',
    post,
  });
  const newsletterBlock = useNewsletterBlock();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    const twitterTweetElements = document.getElementsByClassName('twitter-tweet');
    if (twitterTweetElements.length) {
      twitterTweetElements[0].appendChild(script);
    }
  }, []);

  if (!post) {
    return;
  }

  const authors: PostPageProps['header']['authors'] & PostPageProps['footer']['authors'] = post.authors.map(
    (author) => ({
      ...author,
      link: {
        as: LinkContainer,
        hrefLang: i18n.language,
        to: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
      },
    })
  );

  return {
    backLink: <BackLinkContainer />,
    header: {
      title: post.title,
      date: getDateToString({ date: post.date }),
      readingTime: post.readingTime,
      authors,
    },
    content: post.content,
    footer: {
      title: t('pages.post.post_footer_title'),
      authors,
      emptyAvatarImageUrl: getPathFile('/imgs/astronaut.png'),
    },
    newsletterBlock,
    relatedPostList: {
      relatedPostListTitle: t('pages.post.related_post_list_title'),
      posts: post.relatedPosts.map((relatedPost) => ({
        ...relatedPost,
        authors: relatedPost.authors,
        date: getDateToString({ date: relatedPost.date }),
        link: {
          as: LinkContainer,
          hrefLang: i18n.language,
          to: generatePath(PATHS.POST, { lang: i18n.language, slug: relatedPost.slug }),
        },
      })),
    },
  };
};
