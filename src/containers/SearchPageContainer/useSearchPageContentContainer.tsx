import { SearchPageContentProps } from '@eleven-labs/design-system';
import { useLink, useTitleTemplate } from 'hoofd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DEFAULT_LANGUAGE, IS_SSR, PATHS } from '@/constants';
import { PostCardListContainer, PostCardListContainerProps } from '@/containers/PostCardListContainer';
import { TransWithHtml } from '@/containers/TransWithHtml';
import { generatePath } from '@/helpers/routerHelper';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useTitle } from '@/hooks/useTitle';
import { AlgoliaPostData, LanguageType } from '@/types';

export const useSearchPageContentContainer = (): SearchPageContentProps => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const algoliaSearchIndex = useAlgoliaSearchIndex();
  const search = new URLSearchParams(!IS_SSR ? window.location.search : '').get('search') || '';
  useTitleTemplate('Blog Eleven Labs - %s');
  useTitle(t('pages.search.seo.title', { search }));
  useLink({
    rel: 'canonical',
    href: generatePath(PATHS.SEARCH, { lang: DEFAULT_LANGUAGE }),
  });

  const [postsBySearch, setPostsBySearch] = useState<PostCardListContainerProps['allPosts']>([]);

  useEffect(() => {
    const searchData = async (currentSearch: string): Promise<void> => {
      const response = await algoliaSearchIndex.search<AlgoliaPostData>(currentSearch, {
        hitsPerPage: 1000,
        facetFilters: [`lang:${i18n.language}`],
      });

      const currentPostBySearch = response.hits.map<PostCardListContainerProps['allPosts'][0]>((hit) => ({
        contentType: hit.contentType,
        lang: hit.lang as LanguageType,
        slug: hit.slug,
        date: hit.date,
        readingTime: hit.readingTime,
        title: hit.title,
        excerpt: hit.excerpt,
        cover: hit.cover,
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
    title: (
      <TransWithHtml
        i18nKey="pages.search.title"
        values={{ numberOfHits: postsBySearch.length, search }}
        onlyLineBreak
      />
    ),
    description: <TransWithHtml i18nKey="pages.search.description" />,
    searchNotFound:
      postsBySearch?.length === 0
        ? {
            title: <TransWithHtml i18nKey="common.search_not_found.title" onlyLineBreak />,
            description: <TransWithHtml i18nKey="common.search_not_found.description" />,
          }
        : undefined,
    postCardList: <PostCardListContainer withPagination={false} allPosts={postsBySearch} isLoading={isLoading} />,
    isLoading,
  };
};
