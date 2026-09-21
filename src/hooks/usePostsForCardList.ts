import type { PostCardListProps } from '@eleven-labs/design-system';

import type { ImageFormatType, TransformedPostDataWithTransformedAuthors } from '@/types';

import { useTranslation } from 'react-i18next';

import { PATHS } from '@/constants';
import { getCover } from '@/helpers/assetHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useDateToString } from '@/hooks/useDateToString';

export const usePostsForCardList = (options: {
  posts?: TransformedPostDataWithTransformedAuthors[];
  isLoading?: boolean;
  numberOfItems?: number;
  imageFormat: ImageFormatType;
  withLcpCandidateOnFirstPost?: boolean;
}): PostCardListProps['posts'] => {
  const { getDateToString } = useDateToString();
  const { t, i18n } = useTranslation();

  return options.isLoading && options.numberOfItems
    ? Array.from({ length: options.numberOfItems })
    : (options.posts ?? []).map((post, index) => ({
        contentType: post.contentType,
        slug: post.slug,
        cover: getCover(post, options.imageFormat, {
          isLcpCandidate: (options.withLcpCandidateOnFirstPost ?? false) && index === 0,
        }),
        title: post.title,
        excerpt: post.excerpt,
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
