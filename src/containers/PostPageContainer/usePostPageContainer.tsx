import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

import { PATHS } from '@/constants';
import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { getPostDataPage } from '@/helpers/loaderDataHelper';
import { useDateToString } from '@/hooks/useDateToString';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useSeo } from '@/hooks/useSeo';
import { PostPageProps } from '@/pages/PostPage';

export const usePostPageContainer = (): PostPageProps | undefined => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  const post = useLoaderData() as ReturnType<typeof getPostDataPage>;
  const newsletterBlock = useNewsletterBlock();
  useSeo({
    title: post?.title || '',
    post,
  });

  if (!post) {
    return;
  }

  const authors: PostPageProps['header']['authors'] & PostPageProps['footer']['authors'] = post.authors.map(
    (author) => ({
      ...author,
      link: {
        as: 'a',
        hrefLang: i18n.language,
        href: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
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
    },
    newsletterBlock,
    relatedPostList: {
      relatedPostListTitle: t('pages.post.related_post_list_title'),
      posts: post.relatedPosts.map((relatedPost) => ({
        ...relatedPost,
        date: getDateToString({ date: relatedPost.date }),
        link: {
          as: 'a',
          hrefLang: i18n.language,
          href: generatePath(PATHS.POST, { lang: i18n.language, slug: relatedPost.slug }),
        },
      })),
    },
  };
};
