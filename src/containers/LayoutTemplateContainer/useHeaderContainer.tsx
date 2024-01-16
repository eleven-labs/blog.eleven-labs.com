import { AutocompleteProps, HeaderProps } from '@eleven-labs/design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { contactUrl } from '@/config/website';
import { IS_SSR, NUMBER_OF_ITEMS_FOR_SEARCH, PATHS } from '@/constants';
import { HeaderContainerProps } from '@/containers/LayoutTemplateContainer/HeaderContainer';
import { trackContentSearchEvent } from '@/helpers/dataLayerHelper';
import { generatePath } from '@/helpers/routerHelper';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useDateToString } from '@/hooks/useDateToString';
import { useDebounce } from '@/hooks/useDebounce';
import { AlgoliaPostData } from '@/types';

export const useHeaderContainer = ({ layoutTemplateData }: HeaderContainerProps): HeaderProps => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  const searchParams = new URLSearchParams(!IS_SSR ? window.location.search : '');

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [search, setSearch] = React.useState<string>(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce<string>(search, 500);
  const [searchHits, setSearchHits] = React.useState<AlgoliaPostData[]>([]);
  const algoliaSearchIndex = useAlgoliaSearchIndex();

  const handleChange: AutocompleteProps['onInputValueChange'] = ({ inputValue }): void => {
    setSearch(inputValue || '');
  };

  const handleEnter: AutocompleteProps['onEnter'] = (value): void => {
    window.location.href = `${generatePath(PATHS.SEARCH, { lang: i18n.language })}?search=${value}`;
  };

  React.useEffect(() => {
    if (debouncedSearch.length > 0) {
      trackContentSearchEvent(debouncedSearch);
      algoliaSearchIndex
        .search<AlgoliaPostData>(debouncedSearch, {
          hitsPerPage: NUMBER_OF_ITEMS_FOR_SEARCH,
          facetFilters: [`lang:${i18n.language}`],
        })
        .then(({ hits }) => {
          setSearchHits(hits);
        });
    }
  }, [i18n.language, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = React.useMemo<AutocompleteProps['items']>(
    () =>
      searchHits.map<AutocompleteProps['items'][0]>((hit) => ({
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
        link: {
          hrefLang: i18n.language,
          href: generatePath(PATHS.POST, { lang: i18n.language, slug: hit.slug }),
        },
      })),
    [i18n.language, searchHits] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return {
    menuIsOpen: menuIsOpen,
    onToggleMenu: () => setMenuIsOpen((currentIsOpen) => !currentIsOpen),
    homeLink: {
      hrefLang: i18n.language,
      href: generatePath(PATHS.HOME, { lang: i18n.language }),
    },
    categories:
      layoutTemplateData.categories.map((currentCategoryName) => ({
        hrefLang: i18n.language,
        href: generatePath(PATHS.CATEGORY, {
          lang: i18n.language,
          categoryName: currentCategoryName,
        }),
        label:
          currentCategoryName === 'all' ? t('common.categories.all') : t(`common.categories.${currentCategoryName}`),
      })) ?? [],
    hasTutorial: layoutTemplateData.hasTutorial,
    tutorialLink: {
      label: t(`common.categories.tutorial`),
      href: generatePath(PATHS.CATEGORY, {
        lang: i18n.language,
        categoryName: 'tutorial',
      }),
    },
    contactLink: {
      label: t('common.header.contact_label_link'),
      href: contactUrl,
    },
    autocomplete: {
      placeholder: t('autocomplete.placeholder') as string,
      defaultValue: search,
      onInputValueChange: handleChange,
      onEnter: handleEnter,
      items,
      searchLink: {
        hrefLang: i18n.language,
        href: `${generatePath(PATHS.SEARCH, { lang: i18n.language })}${search ? `?search=${search}` : ''}`,
        label: t('common.autocomplete.see_all_search_label'),
      },
      searchNotFound: {
        title: t('common.search_not_found.title'),
        description: t('common.search_not_found.description'),
      },
    },
  };
};
