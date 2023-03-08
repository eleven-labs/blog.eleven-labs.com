import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, To, useParams } from 'react-router-dom';

import { AutocompleteFieldProps } from '@/components';
import { PATHS } from '@/constants';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useDebounce } from '@/hooks/useDebounce';
import { useLink } from '@/hooks/useLink';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useHeaderContainer = (): LayoutTemplateProps['header'] => {
  const { t, i18n } = useTranslation();
  const { search: defaultSearch } = useParams<{ search?: string }>();
  const { getLink } = useLink();

  const [autocompleteIsDisplayed, setAutocompleteIsDisplayed] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>(defaultSearch || '');
  const [searchLinkPath, setSearchLinkPath] = React.useState<To>(generatePath(PATHS.SEARCH, { lang: i18n.language }));
  const debouncedSearch = useDebounce<string>(search, 500);
  const [searchHits, setSearchHits] = React.useState<
    { objectID: string; slug: string; title: string; excerpt: string }[]
  >([]);
  const algoliaSearchIndex = useAlgoliaSearchIndex();

  const onToggleSearch = React.useCallback(() => {
    if (autocompleteIsDisplayed) {
      setSearch('');
    }
    setAutocompleteIsDisplayed((isDisplayed) => !isDisplayed);
  }, [autocompleteIsDisplayed, setAutocompleteIsDisplayed]);

  const handleChange: AutocompleteFieldProps['onInputValueChange'] = ({ inputValue }): void => {
    setSearch(inputValue || '');
    setSearchLinkPath({
      pathname: generatePath(PATHS.SEARCH, { lang: i18n.language }),
      search: `search=${inputValue}`,
    });
  };

  React.useEffect(() => {
    if (debouncedSearch.length > 0) {
      setAutocompleteIsDisplayed(true);
      algoliaSearchIndex
        .search<{ slug: string; title: string; excerpt: string }>(debouncedSearch, {
          hitsPerPage: 6,
          facetFilters: [`lang:${i18n.language}`],
        })
        .then(({ hits }) => {
          setSearchHits(hits);
        });
    }
  }, [i18n.language, debouncedSearch]);

  const items = React.useMemo<AutocompleteFieldProps['items']>(
    () =>
      searchHits.map<AutocompleteFieldProps['items'][0]>((hit) => ({
        id: hit.objectID,
        title: hit.title,
        description: hit.excerpt,
        ...getLink({
          to: generatePath(PATHS.POST, { lang: i18n.language, slug: hit.slug }),
        }),
      })),
    [i18n.language, searchHits]
  );

  return {
    homeLink: getLink({
      to: generatePath(PATHS.HOME, { lang: i18n.language }),
    }),
    autocompleteIsDisplayed,
    onToggleSearch,
    autocomplete: {
      placeholder: t('autocomplete.placeholder') as string,
      defaultValue: search,
      onInputValueChange: handleChange,
      items,
      searchLink: {
        ...getLink({
          to: searchLinkPath,
        }),
        label: t('autocomplete.see_all_search_label'),
      },
      searchNotFound: {
        title: t('search_not_found.title'),
        description: t('search_not_found.description'),
      },
    } as AutocompleteFieldProps,
  };
};
