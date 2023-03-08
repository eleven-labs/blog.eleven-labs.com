import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router-dom';

import { PostPreviewListProps } from '@/components';
import { NUMBER_OF_ITEMS_PER_PAGE, PATHS } from '@/constants';
import { getPostListDataPage } from '@/helpers/apiHelper';
import { useDateToString } from '@/hooks/useDateToString';
import { useLink } from '@/hooks/useLink';

export interface UsePostPreviewListOptions {
  allPosts: Awaited<ReturnType<typeof getPostListDataPage>>['posts'];
}

export const usePostPreviewList = ({ allPosts }: UsePostPreviewListOptions): Omit<PostPreviewListProps, 'title'> => {
  const { t, i18n } = useTranslation();
  const { getLink } = useLink();
  const { getDateToString } = useDateToString();

  const [posts, setPosts] = React.useState<Awaited<ReturnType<typeof getPostListDataPage>>['posts']>(
    allPosts.slice(0, NUMBER_OF_ITEMS_PER_PAGE + 1)
  );
  const numberOfPosts = posts.length;
  const maxNumberOfPosts = allPosts.length;

  const [hasPagination, setHasPagination] = React.useState<boolean>(numberOfPosts > NUMBER_OF_ITEMS_PER_PAGE);

  const onLoadMore = React.useCallback(() => {
    const nextAllPosts = [...posts, ...allPosts.slice(numberOfPosts, numberOfPosts + NUMBER_OF_ITEMS_PER_PAGE)];
    setPosts(nextAllPosts);
    if (allPosts.length === nextAllPosts.length) {
      setHasPagination(false);
    }
  }, [allPosts, posts, numberOfPosts, setPosts, setHasPagination]);

  React.useEffect(() => {
    const newPosts = allPosts.slice(0, NUMBER_OF_ITEMS_PER_PAGE + 1);
    setHasPagination(newPosts.length > NUMBER_OF_ITEMS_PER_PAGE);
    setPosts(newPosts);
  }, [allPosts, setPosts, setHasPagination]);

  const pagination = useMemo<PostPreviewListProps['pagination']>(
    () =>
      hasPagination
        ? {
            numberOfPosts: numberOfPosts - 1,
            maxNumberOfPosts,
            textNumberOfPosts: t('pages.post_list.number_of_posts_displayed_label', {
              numberOfPosts: numberOfPosts - 1,
              maxNumberOfPosts,
            }),
            loadMoreButtonLabel: t('pages.post_list.load_more_button_label'),
            onLoadMore,
          }
        : undefined,
    [hasPagination, numberOfPosts, maxNumberOfPosts, onLoadMore, t]
  );

  return {
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: getDateToString({ date: post.date }),
      readingTime: post.readingTime,
      authors: post.authors,
      link: getLink({
        to: generatePath(PATHS.POST, { lang: i18n.language, slug: post.slug }),
      }),
    })),
    pagination,
  };
};
