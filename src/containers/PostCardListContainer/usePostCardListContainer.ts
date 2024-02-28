import { PostCardListProps } from '@eleven-labs/design-system';

import { ImageFormatEnum, NUMBER_OF_ITEMS_PER_PAGE } from '@/constants';
import { usePostsForCardList } from '@/hooks/usePostsForCardList';

import { PostCardListContainerProps } from './PostCardListContainer';

export const usePostCardListContainer = ({
  allPosts,
  currentPage = 1,
  getPaginatedLink,
  isLoading = false,
}: PostCardListContainerProps): Omit<PostCardListProps, 'title'> => {
  const numberOfPosts = allPosts.length;
  const totalPages = Math.ceil(numberOfPosts / NUMBER_OF_ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * NUMBER_OF_ITEMS_PER_PAGE;
  const posts = allPosts.slice(offset, offset + NUMBER_OF_ITEMS_PER_PAGE);
  const postsForCardList = usePostsForCardList({
    isLoading,
    numberOfItems: NUMBER_OF_ITEMS_PER_PAGE,
    posts,
    imageFormatEnum: ImageFormatEnum.POST_CARD_COVER,
  });

  return {
    posts: postsForCardList,
    pagination:
      numberOfPosts > NUMBER_OF_ITEMS_PER_PAGE && getPaginatedLink
        ? {
            currentPage,
            totalPages,
            getLink: getPaginatedLink,
          }
        : undefined,
    isLoading,
  };
};
