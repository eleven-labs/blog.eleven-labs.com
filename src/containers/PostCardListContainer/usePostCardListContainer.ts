import { PostCardListProps } from '@eleven-labs/design-system';
import { useTranslation } from 'react-i18next';

import { NUMBER_OF_ITEMS_PER_PAGE, PATHS } from '@/constants';
import { generatePath } from '@/helpers/routerHelper';
import { useDateToString } from '@/hooks/useDateToString';

import { PostCardListContainerProps } from './PostCardListContainer';

export const usePostCardListContainer = ({
  allPosts,
  currentPage = 1,
  getPaginatedLink,
  isLoading = false,
}: PostCardListContainerProps): Omit<PostCardListProps, 'title'> => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  const numberOfPosts = allPosts.length;
  const totalPages = Math.ceil(numberOfPosts / NUMBER_OF_ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * NUMBER_OF_ITEMS_PER_PAGE;
  const posts = allPosts.slice(offset, offset + NUMBER_OF_ITEMS_PER_PAGE);

  return {
    posts: isLoading
      ? Array.from({ length: NUMBER_OF_ITEMS_PER_PAGE })
      : posts.map((post) => ({
          contentType: post.contentType,
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          date: getDateToString({ date: post.date }),
          readingTime: post.readingTime,
          authors: post.authors,
          link: {
            hrefLang: i18n.language,
            href: generatePath(PATHS.POST, { lang: i18n.language, slug: post.slug }),
          },
          tutorialLabel: t('post_list_block.tutoriel_label'),
        })),
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
