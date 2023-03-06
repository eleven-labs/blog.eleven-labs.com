import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useSearchParams } from 'react-router-dom';

import { getPostListDataPage } from '@/helpers/apiHelper';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useBackLink } from '@/hooks/useBackLink';
import { useNewsletterBlock } from '@/hooks/useNewsletterBlock';
import { usePostPreviewList, UsePostPreviewListOptions } from '@/hooks/usePostPreviewList';
import { SearchPageProps } from '@/pages/SearchPage';

export const useSearchPageContainer = (): SearchPageProps => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { posts } = useLoaderData() as Awaited<ReturnType<typeof getPostListDataPage>>;
  const algoliaSearchIndex = useAlgoliaSearchIndex();
  const backLink = useBackLink();
  const newsletterBlock = useNewsletterBlock();
  const [postsBySearch, setPostsBySearch] = useState<UsePostPreviewListOptions['allPosts']>([]);
  const postPreviewList = usePostPreviewList({ allPosts: postsBySearch });

  useEffect(() => {
    algoliaSearchIndex
      .search<{ slug: string; title: string; excerpt: string }>(searchParams?.get('search') as string, {
        hitsPerPage: 1000,
        facetFilters: [`lang:${i18n.language}`],
      })
      .then(({ hits }) => {
        const slugs = hits.map((hit) => hit.slug);
        const currentPostBySearch = posts.filter((post) => slugs.includes(post.slug));
        setPostsBySearch(currentPostBySearch);
      });
  }, [i18n.language, searchParams?.get('search')]);

  return {
    backLink,
    title: t('pages.search.title', { numberOfHits: postsBySearch.length }),
    description: t('pages.search.description'),
    searchNotFound: {
      title: t('pages.search.not_found.title'),
      description: t('pages.search.not_found.description'),
    },
    newsletterBlock,
    postPreviewList,
  };
};
