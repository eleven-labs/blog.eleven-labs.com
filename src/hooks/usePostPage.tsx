import { PostPageProps } from '@eleven-labs/design-system';
import mermaid from 'mermaid';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { useContactCard } from '@/hooks/useContactCard';
import { useDateToString } from '@/hooks/useDateToString';
import { useSeoPost } from '@/hooks/useSeoPost';
import { PostPageData } from '@/types';

export const usePostPage = (post: PostPageData): Omit<PostPageProps, 'variant' | 'summary' | 'children'> => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  useSeoPost({
    title: post.title,
    post,
  });
  const contactCard = useContactCard();

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
      username: author.username,
      name: author.name,
      description: author.content,
      avatarImageUrl: author.avatarImageUrl,
      link: {
        hrefLang: i18n.language,
        href: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
      },
    })
  );

  return {
    header: {
      title: post.title,
      date: getDateToString({ date: post.date }),
      readingTime: post.readingTime,
      authors,
      shareLinks: {
        urlToShare: typeof window !== 'undefined' ? window.location.href : '',
        shares: {
          copyLink: true,
          twitter: true,
          facebook: true,
          linkedIn: true,
        },
        copiedLabel: t('pages.post.share_links.copied_label'),
      },
    },
    footer: {
      title: t('pages.post.post_footer_title'),
      authors,
    },
    contactCard,
    relatedPostList: {
      relatedPostListTitle: t('pages.post.related_post_list_title'),
      posts: post.relatedPosts.map((relatedPost) => ({
        ...relatedPost,
        authors: relatedPost.authors,
        date: getDateToString({ date: relatedPost.date }),
        link: {
          hrefLang: i18n.language,
          href: generatePath(PATHS.POST, { lang: i18n.language, slug: relatedPost.slug }),
        },
      })),
    },
  };
};
