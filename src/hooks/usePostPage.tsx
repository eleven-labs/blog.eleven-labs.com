import mermaid from 'mermaid';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { LinkContainer } from '@/containers/LinkContainer';
import { getPathFile } from '@/helpers/assetHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useDateToString } from '@/hooks/useDateToString';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useSeoPost } from '@/hooks/useSeoPost';
import { PostPageProps } from '@/pages/PostPage';
import { PostPageData } from '@/types';

export const usePostPage = (post: PostPageData): Omit<PostPageProps, 'contentType' | 'children'> => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  useSeoPost({
    title: post.title,
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

    const mermaidElements = document.getElementsByClassName('mermaid');
    if (mermaidElements.length) {
      mermaid.initialize({});
      mermaid.contentLoaded();
    }

    return () => {
      if (twitterTweetElements.length) {
        twitterTweetElements[0].removeChild(script);
      }
    };
  }, []);

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
