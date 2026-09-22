import type { BoxProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import classNames from 'classnames';
import React from 'react';

import { PostMetadata } from '@/components';
import { Box, Flex, Heading, Link, Text, TextHighlight } from '@/design-system';
import { polyRef } from '@/design-system/helpers';

import './AutocompleteResult.scss';

export interface AutocompleteItem {
  slug: string;
  title: string;
  date: string;
  authors?: { username: string; name: string }[];
  link: ComponentPropsWithoutRef<'a'>;
}

export type AutocompleteResultOptions = {
  isOpen?: boolean;
  items: AutocompleteItem[];
  searchValue?: string;
  searchLink?: ComponentPropsWithoutRef<'a'> & { label: string };
  searchNotFound?: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  highlightedIndex?: number;
};

export type AutocompleteResultProps = BoxProps & AutocompleteResultOptions;

export const AutocompleteResult = polyRef<'div', AutocompleteResultProps>(
  (
    {
      isOpen = false,
      items,
      searchValue,
      searchLink: { label: searchLinkLabel, ...searchLinkProps } = {},
      searchNotFound,
      highlightedIndex = 0,
      ...props
    },
    ref
  ) => (
    <Box className={classNames('autocomplete-result', props.className)} ref={ref} hidden={!isOpen}>
      {items.length > 0 && (
        <>
          {items.map(({ slug, title, date, authors, link }, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <React.Fragment key={slug}>
                <Flex
                  alignItems="center"
                  gap="xxs"
                  pt={{ xs: 'xxs' }}
                  pb={{ xs: 'xs' }}
                  px={{ xs: 'm' }}
                  className={classNames('autocomplete-result__item', {
                    'autocomplete-result__item--is-highlighted': isHighlighted,
                  })}
                >
                  <TextHighlight
                    as="a"
                    {...link}
                    size="s"
                    text={title}
                    textQuery={searchValue}
                    lineClamp={{ xs: 4, md: 2 }}
                    className="autocomplete-result__link"
                  />
                  <PostMetadata mt="xxs-3" date={date} authors={authors} displayedFields={['date', 'authors']} />
                </Flex>
              </React.Fragment>
            );
          })}
          {searchLinkProps && searchLinkLabel && (
            <Box
              pt={{ xs: 's', md: 'm' }}
              pb={{ xs: 'm', md: 'l' }}
              textSize="s"
              fontWeight="medium"
              textAlign="center"
            >
              <Link {...searchLinkProps}>{searchLinkLabel}</Link>
            </Box>
          )}
        </>
      )}
      {items.length === 0 && searchNotFound && (
        <Box textAlign="center" px="xl" py="m">
          <div className="autocomplete-result__background-not-found" />
          <Heading size="m" mt="s">
            {searchNotFound.title}
          </Heading>
          <Text size="xs" mt="xxs">
            {searchNotFound.description}
          </Text>
        </Box>
      )}
    </Box>
  )
);

AutocompleteResult.displayName = 'AutocompleteResult';
