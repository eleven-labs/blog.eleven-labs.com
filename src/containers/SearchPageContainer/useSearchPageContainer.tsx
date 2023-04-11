import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { UsePostPreviewListContainerOptions } from '@/containers/PostPreviewListContainer/usePostPreviewListContainer';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { SearchPageProps } from '@/pages/SearchPage';

export const useSearchPageContainer = (): SearchPageProps => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const algoliaSearchIndex = useAlgoliaSearchIndex();
  const newsletterBlock = useNewsletterBlock();
  const search = new URLSearchParams(!import.meta.env.SSR ? window.location.search : '').get('search') || '';
  const [postsBySearch, setPostsBySearch] = useState<UsePostPreviewListContainerOptions['allPosts']>([]);

  useEffect(() => {
    const searchData = async (currentSearch: string): Promise<void> => {
      const response = await algoliaSearchIndex.search<{
        lang: string;
        slug: string;
        date: string;
        readingTime: string;
        title: string;
        excerpt: string;
        categories: string[];
        authorNames: string[];
      }>(currentSearch, {
        hitsPerPage: 1000,
        facetFilters: [`lang:${i18n.language}`],
      });

      const currentPostBySearch = response.hits.map<UsePostPreviewListContainerOptions['allPosts'][0]>((hit) => ({
        lang: hit.lang,
        slug: hit.slug,
        date: hit.date,
        readingTime: hit.readingTime,
        title: hit.title,
        excerpt: hit.excerpt,
        authors: hit.authorNames,
        categories: [],
      }));
      setPostsBySearch(currentPostBySearch);
      setIsLoading(false);
    };

    searchData(search);
  }, [search, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    backLink: <BackLinkContainer />,
    title: t('pages.search.title', { numberOfHits: postsBySearch.length }),
    description: t('pages.search.description'),
    searchNotFound:
      postsBySearch?.length === 0
        ? {
            title: t('pages.search.not_found.title'),
            description: t('pages.search.not_found.description'),
          }
        : undefined,
    newsletterBlock,
    postPreviewList: <PostPreviewListContainer allPosts={postsBySearch} isLoading={isLoading} />,
    isLoading,
  };
};
