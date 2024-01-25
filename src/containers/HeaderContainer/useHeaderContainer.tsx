import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { AutocompleteFieldProps } from '@/components';
import { IS_SSR, NUMBER_OF_ITEMS_PER_PAGE, PATHS } from '@/constants';
import { trackContentSearchEvent } from '@/helpers/dataLayerHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useDateToString } from '@/hooks/useDateToString';
import { useDebounce } from '@/hooks/useDebounce';
import { HeaderProps } from '@/templates/LayoutTemplate';
import { AlgoliaPostData } from '@/types';

export const useHeaderContainer = (): HeaderProps => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { getDateToString } = useDateToString();
  const searchParams = new URLSearchParams(!IS_SSR ? location.search : '');

  const [autocompleteIsDisplayed, setAutocompleteIsDisplayed] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce<string>(search, 500);
  const [searchHits, setSearchHits] = React.useState<AlgoliaPostData[]>([]);
  const algoliaSearchIndex = useAlgoliaSearchIndex();

  const onToggleSearch = React.useCallback(() => {
    if (autocompleteIsDisplayed) {
      setSearch('');
    }
    setAutocompleteIsDisplayed((isDisplayed) => !isDisplayed);
  }, [autocompleteIsDisplayed, setAutocompleteIsDisplayed]);

  const handleChange: AutocompleteFieldProps['onInputValueChange'] = ({ inputValue }): void => {
    setSearch(inputValue || '');
  };

  const handleEnter: AutocompleteFieldProps['onEnter'] = (value): void => {
    navigate({
      pathname: generatePath(PATHS.SEARCH, { lang: i18n.language }),
      search: `search=${value}`,
    });
  };

  React.useEffect(() => {
    if (debouncedSearch.length > 0) {
      trackContentSearchEvent(debouncedSearch);
      setAutocompleteIsDisplayed(true);
      algoliaSearchIndex
        .search<AlgoliaPostData>(debouncedSearch, {
          hitsPerPage: NUMBER_OF_ITEMS_PER_PAGE,
          facetFilters: [`lang:${i18n.language}`],
        })
        .then(({ hits }) => {
          setSearchHits(hits);
        });
    }
  }, [i18n.language, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = React.useMemo<AutocompleteFieldProps['items']>(
    () =>
      searchHits.map<AutocompleteFieldProps['items'][0]>((hit) => ({
        id: hit.objectID,
        slug: hit.slug,
        contentType: hit.contentType,
        title: hit.title,
        description: hit.excerpt,
        date: getDateToString({ date: hit.date }),
        readingTime: hit.readingTime,
        authors: hit.authorUsernames.map((authorUsername, index) => ({
          username: authorUsername,
          name: hit.authorNames[index],
        })),
        hrefLang: i18n.language,
        href: generatePath(PATHS.POST, { lang: i18n.language, slug: hit.slug }),
      })),
    [i18n.language, searchHits] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    homeLink: {
      hrefLang: i18n.language,
      href: generatePath(PATHS.HOME, { lang: i18n.language }),
    },
    autocompleteIsDisplayed,
    onToggleSearch,
    autocomplete: {
      placeholder: t('autocomplete.placeholder') as string,
      defaultValue: search,
      onInputValueChange: handleChange,
      onEnter: handleEnter,
      items,
      searchLink: {
        hrefLang: i18n.language,
        href: `${generatePath(PATHS.SEARCH, { lang: i18n.language })}${search ? `?search=${search}` : ''}`,
        label: t('autocomplete.see_all_search_label'),
      },
      searchNotFound: {
        title: t('search_not_found.title'),
        description: t('search_not_found.description'),
      },
    },
  };
};
