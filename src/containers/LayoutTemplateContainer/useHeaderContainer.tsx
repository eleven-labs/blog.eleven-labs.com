import type { AutocompleteProps, HeaderProps } from '@/components';
import type { HeaderContainerProps } from '@/containers/LayoutTemplateContainer/HeaderContainer';
import type { SearchPostData } from '@/types';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { contactUrl } from '@/config/website';
import { IS_SSR, NUMBER_OF_ITEMS_FOR_SEARCH, PATHS } from '@/constants';
import { TransWithHtml } from '@/containers/TransWithHtml';
import { trackContentSearchEvent } from '@/helpers/dataLayerHelper';
import { generatePath, getHomePath } from '@/helpers/routerHelper';
import { useDateToString } from '@/hooks/useDateToString';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchIndex } from '@/hooks/useSearchIndex';

export const useHeaderContainer = ({ layoutTemplateData }: HeaderContainerProps): HeaderProps => {
  const { t, i18n } = useTranslation();
  const { getDateToString } = useDateToString();
  const searchParams = new URLSearchParams(!IS_SSR ? window.location.search : '');

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false);
  const [search, setSearch] = React.useState<string>(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce<string>(search, 500);
  const [searchHits, setSearchHits] = React.useState<SearchPostData[]>([]);
  const { searchIndex, loadSearchIndex } = useSearchIndex();

  const handleChange: AutocompleteProps['onInputValueChange'] = ({ inputValue }): void => {
    setSearch(inputValue || '');
  };

  const handleEnter: AutocompleteProps['onEnter'] = (value): void => {
    window.location.href = `${generatePath(PATHS.SEARCH, { lang: i18n.language })}?search=${value}`;
  };

  React.useEffect(() => {
    if (debouncedSearch.length > 0) {
      trackContentSearchEvent(debouncedSearch);
    }
  }, [debouncedSearch]);

  React.useEffect(() => {
    if (searchIndex && debouncedSearch.length > 0) {
      void searchIndex.search(debouncedSearch, { limit: NUMBER_OF_ITEMS_FOR_SEARCH }).then(setSearchHits);
    }
  }, [searchIndex, debouncedSearch]);

  const items = React.useMemo<AutocompleteProps['items']>(
    () =>
      searchHits.map<AutocompleteProps['items'][0]>((hit) => ({
        id: hit.slug,
        slug: hit.slug,
        contentType: hit.contentType,
        title: hit.title,
        description: hit.excerpt,
        date: getDateToString({ date: hit.date }),
        readingTime: hit.readingTime,
        cover: hit.cover,
        authors: hit.authorUsernames.map((authorUsername, index) => ({
          username: authorUsername,
          name: hit.authorNames[index],
        })),
        link: {
          hrefLang: i18n.language,
          href: generatePath(PATHS.POST, { lang: i18n.language, slug: hit.slug }),
        },
      })),
    [i18n.language, searchHits]
  );

  return {
    menuIsOpen: menuIsOpen,
    // Le menu et la recherche occupent tous deux l'espace sous l'en-tête : ouvrir l'un ferme l'autre.
    onToggleMenu: () => {
      setMenuIsOpen((currentIsOpen) => !currentIsOpen);
      setSearchIsOpen(false);
    },
    searchIsOpen,
    searchButtonLabel: t('common.header.search_label_button'),
    onToggleSearch: () => {
      setSearchIsOpen((currentIsOpen) => !currentIsOpen);
      setMenuIsOpen(false);
    },
    homeLink: {
      hrefLang: i18n.language,
      href: getHomePath(i18n.language),
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
      placeholder: t('common.autocomplete.placeholder') as string,
      defaultValue: search,
      onInputValueChange: handleChange,
      onEnter: handleEnter,
      onFocus: loadSearchIndex,
      items,
      searchLink: {
        hrefLang: i18n.language,
        href: `${generatePath(PATHS.SEARCH, { lang: i18n.language })}${search ? `?search=${search}` : ''}`,
        label: t('common.autocomplete.see_all_search_label'),
      },
      searchNotFound: {
        title: <TransWithHtml i18nKey="common.search_not_found.title" onlyLineBreak />,
        description: <TransWithHtml i18nKey="common.search_not_found.description" />,
      },
    },
  };
};
