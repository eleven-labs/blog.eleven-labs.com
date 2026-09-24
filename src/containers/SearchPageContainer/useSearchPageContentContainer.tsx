import type { PostCardListContainerProps } from '@/containers/PostCardListContainer';
import type { SearchPageContentProps } from '@/pages';
import type { LanguageType } from '@/types';

import { useMeta, useTitleTemplate } from 'hoofd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IS_SSR } from '@/constants';
import { PostCardListContainer } from '@/containers/PostCardListContainer';
import { TransWithHtml } from '@/containers/TransWithHtml';
import { useSearchIndex } from '@/hooks/useSearchIndex';
import { useTitle } from '@/hooks/useTitle';

export const useSearchPageContentContainer = (): SearchPageContentProps => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { searchIndex, loadSearchIndex } = useSearchIndex();
  const search = new URLSearchParams(!IS_SSR ? window.location.search : '').get('search') || '';
  useTitleTemplate('Blog Eleven Labs - %s');
  useTitle(t('pages.search.seo.title', { search }));
  useMeta({ name: 'robots', content: 'noindex, follow' });

  const [postsBySearch, setPostsBySearch] = useState<PostCardListContainerProps['allPosts']>([]);

  useEffect(() => {
    loadSearchIndex();
  }, [loadSearchIndex]);

  useEffect(() => {
    if (!searchIndex) {
      return;
    }

    void searchIndex.search(search).then((hits) => {
      setPostsBySearch(
        hits.map<PostCardListContainerProps['allPosts'][0]>((hit) => ({
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
        }))
      );
      setIsLoading(false);
    });
  }, [searchIndex, search]);

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
