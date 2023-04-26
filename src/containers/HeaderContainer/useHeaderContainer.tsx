import { AsProps } from '@eleven-labs/design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { AutocompleteFieldProps } from '@/components';
import { IS_SSR, NUMBER_OF_ITEMS_PER_PAGE, PATHS } from '@/constants';
import { LinkContainer } from '@/containers/LinkContainer';
import { generatePath } from '@/helpers/routerHelper';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useDebounce } from '@/hooks/useDebounce';
import { HeaderProps } from '@/templates/LayoutTemplate';

export const useHeaderContainer = (): HeaderProps => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(!IS_SSR ? location.search : '');

  const [autocompleteIsDisplayed, setAutocompleteIsDisplayed] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>(searchParams.get('search') ?? '');
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
  };

  const handleEnter: AutocompleteFieldProps['onEnter'] = (value): void => {
    navigate({
      pathname: generatePath(PATHS.SEARCH, { lang: i18n.language }),
      search: `search=${value}`,
    });
  };

  React.useEffect(() => {
    if (debouncedSearch.length > 0) {
      setAutocompleteIsDisplayed(true);
      algoliaSearchIndex
        .search<{ slug: string; title: string; excerpt: string }>(debouncedSearch, {
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
        title: hit.title,
        description: hit.excerpt,
        as: LinkContainer,
        hrefLang: i18n.language,
        to: generatePath(PATHS.POST, { lang: i18n.language, slug: hit.slug }),
      })),
    [i18n.language, searchHits]
  );

  return {
    homeLink: {
      as: LinkContainer,
      hrefLang: i18n.language,
      to: generatePath(PATHS.HOME, { lang: i18n.language }),
    } as AsProps<'a'>,
    autocompleteIsDisplayed,
    onToggleSearch,
    autocomplete: {
      placeholder: t('autocomplete.placeholder') as string,
      defaultValue: search,
      onInputValueChange: handleChange,
      onEnter: handleEnter,
      items,
      searchLink: {
        as: LinkContainer,
        hrefLang: i18n.language,
        to: {
          pathname: generatePath(PATHS.SEARCH, { lang: i18n.language }),
          search: search ? `?search=${search}` : '',
        },
        label: t('autocomplete.see_all_search_label'),
      },
      searchNotFound: {
        title: t('search_not_found.title'),
        description: t('search_not_found.description'),
      },
    } as AutocompleteFieldProps,
  };
};
