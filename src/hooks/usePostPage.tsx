import { PostPageProps } from '@eleven-labs/design-system';
import mermaid from 'mermaid';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { useContactCard } from '@/hooks/useContactCard';
import { useDateToString } from '@/hooks/useDateToString';
import { usePostsForCardList } from '@/hooks/usePostsForCardList';
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
  const breadcrumb = useBreadcrumb({ categoryName: post.categories[0] });
  const relatedPostsForCardList = usePostsForCardList({
    posts: post.relatedPosts,
  });

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
        label: t('common.post.post_footer.author_link_label'),
        hrefLang: i18n.language,
        href: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
      },
    })
  );

  return {
    breadcrumb,
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
        copiedLabel: t('common.post.share_links.copied_label'),
      },
    },
    footer: {
      title: t('common.post.post_footer.title'),
      authors,
    },
    contactCard,
    relatedPostList: {
      relatedPostListTitle: t('common.post.related_post_list.title'),
      posts: relatedPostsForCardList,
    },
  };
};
