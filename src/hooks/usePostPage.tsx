import { Box, PostPageProps } from '@eleven-labs/design-system';
import { useScript } from 'hoofd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { ImageFormatEnum, PATHS } from '@/constants';
import { getCover } from '@/helpers/assetHelper';
import { getUrl } from '@/helpers/getUrlHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { useContactCard } from '@/hooks/useContactCard';
import { useDateToString } from '@/hooks/useDateToString';
import { usePostsForCardList } from '@/hooks/usePostsForCardList';
import { useSeoPost } from '@/hooks/useSeoPost';
import { PostPageData } from '@/types';

export const usePostPage = (post: PostPageData): Omit<PostPageProps, 'variant' | 'summary' | 'children'> => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { getDateToString } = useDateToString();
  useSeoPost(post);
  useScript({
    type: 'module',
    text: [
      `import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';`,
      'mermaid.initialize({ startOnLoad: true });',
    ].join('\n'),
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    const twitterTweetElements = document.getElementsByClassName('twitter-tweet');
    if (twitterTweetElements.length) {
      twitterTweetElements[0].appendChild(script);
    }

    return () => {
      if (twitterTweetElements.length) {
        twitterTweetElements[0].removeChild(script);
      }
    };
  }, []);

  const contactCard = useContactCard();
  const breadcrumb = useBreadcrumb({ categoryName: post.categories[0] });
  const relatedPostsForCardList = usePostsForCardList({
    posts: post.relatedPosts,
    imageFormatEnum: ImageFormatEnum.POST_CARD_COVER,
  });

  const authors: PostPageProps['header']['authors'] & PostPageProps['footer']['authors'] = post.authors.map(
    (author) => ({
      username: author.username,
      name: author.name,
      description: <Box dangerouslySetInnerHTML={{ __html: author.content }} />,
      avatarImageUrl: author.avatarImageUrl,
      link: {
        label: t('common.post.footer.author.link_label'),
        hrefLang: i18n.language,
        href: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
      },
    })
  );

  return {
    breadcrumb,
    cover: getCover(post, ImageFormatEnum.POST_COVER),
    header: {
      title: post.title,
      date: getDateToString({ date: post.date }),
      readingTime: post.readingTime,
      authors,
      shareLinks: {
        urlToShare: getUrl(location.pathname),
        shares: {
          twitter: true,
          facebook: true,
          linkedIn: true,
        },
      },
    },
    footer: {
      title: t('common.post.footer.author.title'),
      authors,
    },
    contactCard,
    relatedPostList: {
      relatedPostListTitle: t('common.post.related_post_list.title'),
      posts: relatedPostsForCardList,
    },
  };
};
