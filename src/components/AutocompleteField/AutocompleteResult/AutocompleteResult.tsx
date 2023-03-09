import './AutocompleteResult.scss';

import { AsProps, Box, BoxProps, forwardRef, Heading, Link, Text, TextHighlight } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { getPathFile } from '@/helpers/assetHelper';

export interface AutocompleteItem {
  title: string;
  description: string;
}

export type AutocompleteResultOptions = {
  isOpen?: boolean;
  items: (AsProps<'a'> & AutocompleteItem)[];
  searchValue?: string;
  searchLink?: AsProps<'a'> & { label: string };
  searchNotFound?: {
    title: string;
    description: string;
  };
  highlightedIndex?: number;
};

export type AutocompleteResultProps = BoxProps & AutocompleteResultOptions;

export const AutocompleteResult = forwardRef<AutocompleteResultProps, 'div'>(
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
          {items.map(({ title, description, ...itemProps }, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <React.Fragment key={index}>
                <Box
                  {...(itemProps as AsProps)}
                  pt={{ xs: 'xxs' }}
                  pb={{ xs: 'xs' }}
                  px={{ xs: 'm' }}
                  className={classNames('autocomplete-result__item', {
                    'autocomplete-result__item--is-highlighted': isHighlighted,
                  })}
                >
                  <TextHighlight size="s" text={title} textQuery={searchValue} />
                  <TextHighlight size="xs" text={description} textQuery={searchValue} hiddenBelow="sm" />
                </Box>
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
          <img src={getPathFile('/imgs/not-found.png')} alt="not-found" />
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
