import { Text } from '@eleven-labs/design-system';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link, To, useLocation, useParams } from 'react-router-dom';

import { AutocompleteFieldProps } from '@/components';
import { contact, socialNetworks, websiteUrl } from '@/config/website';
import { AUTHORIZED_LANGUAGES, PATHS } from '@/constants';
import { useAlgoliaSearchIndex } from '@/hooks/useAlgoliaSearchIndex';
import { useDebounce } from '@/hooks/useDebounce';
import { useLayoutEffect } from '@/hooks/useLayoutEffect';
import { LayoutTemplateProps } from '@/templates/LayoutTemplate';

export const useLayoutTemplateContainer = (): Omit<LayoutTemplateProps, 'children'> => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { search: defaultSearch } = useParams<{ search?: string }>();

  const [autocompleteIsDisplayed, setAutocompleteIsDisplayed] = React.useState<boolean>(false);
  const [search, setSearch] = useState<string>(defaultSearch || '');
  const [searchLinkPath, setSearchLinkPath] = useState<To>(generatePath(PATHS.SEARCH, { lang: i18n.language }));
  const debouncedSearch = useDebounce<string>(search, 500);
  const [searchHits, setSearchHits] = useState<{ objectID: string; slug: string; title: string; excerpt: string }[]>(
    []
  );
  const algoliaSearchIndex = useAlgoliaSearchIndex();

  const onToggleSearch = useCallback(() => {
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

  useEffect(() => {
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

  const items = useMemo<AutocompleteFieldProps['items']>(
    () =>
      searchHits.map<AutocompleteFieldProps['items'][0]>((hit) => ({
        id: hit.objectID,
        title: hit.title,
        description: hit.excerpt,
        as: Link,
        to: generatePath(PATHS.POST, { lang: i18n.language, slug: hit.slug }),
      })),
    [i18n.language, searchHits]
  );

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return {
    header: {
      homeLink: {
        as: Link,
        to: generatePath(PATHS.HOME, { lang: i18n.language }),
      } as LayoutTemplateProps['header']['homeLink'],
      autocompleteIsDisplayed,
      onToggleSearch,
      autocomplete: {
        placeholder: t('autocomplete.placeholder') as string,
        defaultValue: search,
        onInputValueChange: handleChange,
        items,
        searchLink: {
          label: t('autocomplete.see_all_search_label'),
          as: Link,
          to: searchLinkPath,
        },
        searchNotFound: {
          title: t('search_not_found.title'),
          description: t('search_not_found.description'),
        },
      } as AutocompleteFieldProps,
    },
    footer: {
      introBlock: {
        title: t('footer.intro_block.title'),
        description: t('footer.intro_block.description'),
      },
      elevenLabsSiteLink: {
        as: 'a',
        label: t('footer.link_to_eleven_labs_site'),
        target: '_blank',
        href: websiteUrl,
      },
      contact: {
        title: t('footer.contact.title'),
        list: [
          ...contact.addressList.map(({ name, address }) => ({
            title: name,
            description: (
              <>
                {address.map((line, index) => (
                  <Text key={index}>{line}</Text>
                ))}
              </>
            ),
          })),
          {
            title: contact.email,
            description: contact.phoneNumber,
          },
        ],
      },
      socialLinks: socialNetworks.map((socialNetwork) => ({
        iconName: socialNetwork.iconName,
        href: socialNetwork.url,
      })),
      languageLinks: AUTHORIZED_LANGUAGES.map((currentLang) => {
        const isActive = currentLang === i18n.language;
        const languageLinkProps = {
          to: generatePath(PATHS.HOME, { lang: currentLang }),
          onClick: () => i18n.changeLanguage(currentLang),
        };
        return {
          as: Link,
          isActive,
          label: t(`languages.${currentLang}`),
          ...(!isActive ? languageLinkProps : {}),
        };
      }),
    },
  };
};
