import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';
import { useLoaderData } from 'react-router-dom';

import { PATHS } from '@/constants';
import { getPostDataPage } from '@/helpers/apiHelper';
import { decodeBase64 } from '@/helpers/base64Helper';
import { useBackLink } from '@/hooks/useBackLink';
import { useDateToString } from '@/hooks/useDateToString';
import { useLink } from '@/hooks/useLink';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { useSeo } from '@/hooks/useSeo';
import { PostPageProps } from '@/pages/PostPage';

export const usePostPageContainer = (): PostPageProps | undefined => {
  const { t, i18n } = useTranslation();
  const { getLink } = useLink();
  const { getDateToString } = useDateToString();
  const post = useLoaderData() as Awaited<ReturnType<typeof getPostDataPage>>;
  const backLink = useBackLink();
  const newsletterBlock = useNewsletterBlock();
  useSeo({
    title: post?.title,
    post,
  });

  if (!post) {
    return;
  }

  const authors: PostPageProps['header']['authors'] & PostPageProps['footer']['authors'] = post.authors.map(
    (author) => ({
      ...author,
      link: getLink({
        to: generatePath(PATHS.AUTHOR, { lang: i18n.language, authorUsername: author.username }),
      }),
    })
  );

  return {
    backLink,
    header: {
      title: post.title,
      date: getDateToString({ date: post.date }),
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
        date: getDateToString({ date: relatedPost.date }),
        link: getLink({
          to: generatePath(PATHS.POST, { lang: i18n.language, slug: relatedPost.slug }),
        }),
      })),
    },
  };
};
