import type { SearchIndex } from '@/helpers/searchHelper';
import type { SearchPostData } from '@/types';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { BASE_URL } from '@/constants';

const searchIndexesByLang = new Map<string, Promise<SearchIndex>>();

// Le moteur de recherche et les documents à indexer ne sont téléchargés qu'une fois par langue, et
// seulement quand la recherche est utilisée.
const getSearchIndex = (lang: string): Promise<SearchIndex> => {
  let searchIndex = searchIndexesByLang.get(lang);
  if (!searchIndex) {
    searchIndex = Promise.all([
      import('@/helpers/searchHelper'),
      fetch(`${BASE_URL}data/${lang}/search.json`).then((response) => {
        if (!response.ok) {
          throw new Error(`Unable to load the search data (${response.status})`);
        }
        return response.json() as Promise<SearchPostData[]>;
      }),
    ]).then(([{ createSearchIndex }, posts]) => createSearchIndex({ lang, posts }));
    searchIndex.catch(() => searchIndexesByLang.delete(lang));
    searchIndexesByLang.set(lang, searchIndex);
  }

  return searchIndex;
};

export const useSearchIndex = (): { searchIndex?: SearchIndex; loadSearchIndex: () => void } => {
  const { i18n } = useTranslation();
  const [searchIndexByLang, setSearchIndexByLang] = React.useState<{ lang: string; searchIndex: SearchIndex }>();

  const loadSearchIndex = React.useCallback((): void => {
    const lang = i18n.language;
    getSearchIndex(lang)
      .then((searchIndex) => setSearchIndexByLang({ lang, searchIndex }))
      .catch((error) => console.error(error));
  }, [i18n.language]);

  return {
    searchIndex: searchIndexByLang?.lang === i18n.language ? searchIndexByLang.searchIndex : undefined,
    loadSearchIndex,
  };
};
