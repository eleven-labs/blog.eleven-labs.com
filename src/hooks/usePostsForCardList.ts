import { PostCardListProps } from '@eleven-labs/design-system';
import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { getPathFile } from '@/helpers/assetHelper';
import { generatePath } from '@/helpers/routerHelper';
import { truncateText } from '@/helpers/stringHelper';
import { useDateToString } from '@/hooks/useDateToString';
import { TransformedPostDataWithTransformedAuthors } from '@/types';

export const usePostsForCardList = (options: {
  posts?: TransformedPostDataWithTransformedAuthors[];
  isLoading?: boolean;
  numberOfItems?: number;
}): PostCardListProps['posts'] => {
  const { getDateToString } = useDateToString();
  const { t, i18n } = useTranslation();

  return options.isLoading && options.numberOfItems
    ? Array.from({ length: options.numberOfItems })
    : (options.posts ?? []).map((post) => ({
        contentType: post.contentType,
        slug: post.slug,
        cover: {
          src: post.cover?.path ? getPathFile(post.cover.path) : getPathFile('/imgs/cover-article.jpg'),
          alt: '',
        },
        title: post.title,
        excerpt: truncateText(post.excerpt, 125),
        date: getDateToString({ date: post.date }),
        readingTime: post.readingTime,
        authors: post.authors,
        link: {
          hrefLang: i18n.language,
          href: generatePath(PATHS.POST, { lang: i18n.language, slug: post.slug }),
        },
        tutorialLabel: t('common.tutorial-tag'),
      }));
};
