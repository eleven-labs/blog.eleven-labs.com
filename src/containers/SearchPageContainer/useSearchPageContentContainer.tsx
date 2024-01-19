import { SearchPageContentProps } from '@eleven-labs/design-system';
import { useLink } from 'hoofd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { blogUrl } from '@/config/website';
import { DEFAULT_LANGUAGE, IS_SSR, LanguageEnum, PATHS } from '@/constants';
import { PostCardListContainer, PostCardListContainerProps } from '@/containers/PostCardListContainer';
import { TransWithHtml } from '@/containers/TransWithHtml';
import { generatePath } from '@/helpers/routerHelper';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useTitle } from '@/hooks/useTitle';
import { AlgoliaPostData } from '@/types';

export const useSearchPageContentContainer = (): SearchPageContentProps => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const algoliaSearchIndex = useAlgoliaSearchIndex();
  useTitle(t('pages.search.seo.title'));
  useLink({
    rel: 'canonical',
    href: `${blogUrl}${generatePath(PATHS.SEARCH, { lang: DEFAULT_LANGUAGE })}`,
  });

  const search = new URLSearchParams(!IS_SSR ? window.location.search : '').get('search') || '';
  const [postsBySearch, setPostsBySearch] = useState<PostCardListContainerProps['allPosts']>([]);

  useEffect(() => {
    const searchData = async (currentSearch: string): Promise<void> => {
      const response = await algoliaSearchIndex.search<AlgoliaPostData>(currentSearch, {
        hitsPerPage: 1000,
        facetFilters: [`lang:${i18n.language}`],
      });

      const currentPostBySearch = response.hits.map<PostCardListContainerProps['allPosts'][0]>((hit) => ({
        contentType: hit.contentType,
        lang: hit.lang as LanguageEnum,
        slug: hit.slug,
        date: hit.date,
        readingTime: hit.readingTime,
        title: hit.title,
        excerpt: hit.excerpt,
        authors: hit.authorUsernames.map((authorUsername, index) => ({
          username: authorUsername,
          name: hit.authorNames[index],
        })),
        categories: [],
      }));
      setPostsBySearch(currentPostBySearch);
      setIsLoading(false);
    };

    searchData(search);
  }, [search, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    title: <TransWithHtml i18nKey="pages.search.title" values={{ numberOfHits: postsBySearch.length }} onlyLineBreak />,
    description: <TransWithHtml i18nKey="pages.search.description" />,
    searchNotFound:
      postsBySearch?.length === 0
        ? {
            title: <TransWithHtml i18nKey="common.search_not_found.title" onlyLineBreak />,
            description: <TransWithHtml i18nKey="common.search_not_found.description" />,
          }
        : undefined,
    postCardList: <PostCardListContainer allPosts={postsBySearch} isLoading={isLoading} />,
    isLoading,
  };
};
