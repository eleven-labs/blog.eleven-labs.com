import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

import { PATHS } from '@/constants';
import { getPostDataPage } from '@/helpers/apiHelper';
import { decodeBase64 } from '@/helpers/base64Helper';
import { useBackLink } from '@/hooks/useBackLink';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { PostPageProps } from '@/pages/PostPage';

export const usePostPageContainer = (): PostPageProps | undefined => {
  const { t, i18n } = useTranslation();
  const post = useLoaderData() as Awaited<ReturnType<typeof getPostDataPage>>;
  const backLink = useBackLink();
  const newsletterBlock = useNewsletterBlock();

  if (!post) {
    return;
  }

  const authors: PostPageProps['header']['authors'] & PostPageProps['footer']['authors'] = post.authors.map(
    (author) => ({
      ...author,
      link: {
        as: Link,
        to: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
      },
    })
  );

  return {
    backLink,
    header: {
      title: post.title,
      date: post.date,
      readingTime: post.readingTime,
      authors,
    },
    content: decodeBase64(post.contentBase64),
    footer: {
      title: t('pages.post.post_footer_title'),
      authors,
    },
    newsletterBlock,
    relatedPostList: {
      relatedPostListTitle: t('pages.post.related_post_list_title'),
      posts: post.relatedPosts.map((relatedPost) => ({
        ...relatedPost,
        link: {
          as: Link,
          to: generatePath(PATHS.POST, { lang: i18n.language, slug: relatedPost.slug }),
        },
      })),
    },
  };
};
