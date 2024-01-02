import './AutocompleteResult.scss';

import { Box, BoxProps, Flex, Heading, Link, polyRef, Text, TextHighlight } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { ArticleMetadata, TutoTag } from '@/components';
import { ContentTypeEnum } from '@/constants';
import { getPathFile } from '@/helpers/assetHelper';

export interface AutocompleteItem {
  contentType: ContentTypeEnum.ARTICLE | ContentTypeEnum.TUTORIAL;
  slug: string;
  title: string;
  description: string;
  date: React.ReactNode;
  readingTime: number;
  authors?: { username: string; name: string }[];
}

export type AutocompleteResultOptions = {
  isOpen?: boolean;
  items: (React.ComponentPropsWithoutRef<'a'> & AutocompleteItem)[];
  searchValue?: string;
  searchLink?: React.ComponentPropsWithoutRef<'a'> & { label: string };
  searchNotFound?: {
    title: string;
    description: string;
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
          {items.map(({ contentType, slug, title, description, date, readingTime, authors, ...itemProps }, index) => {
            const isHighlighted = highlightedIndex === index;
            return (
              <React.Fragment key={slug}>
                <Box
                  as="a"
                  {...itemProps}
                  pt={{ xs: 'xxs' }}
                  pb={{ xs: 'xs' }}
                  px={{ xs: 'm' }}
                  className={classNames('autocomplete-result__item', {
                    'autocomplete-result__item--is-highlighted': isHighlighted,
                  })}
                >
                  <Flex alignItems="center" gap="xxs">
                    {contentType === ContentTypeEnum.TUTORIAL && <TutoTag />}
                    <TextHighlight size="s" text={title} textQuery={searchValue} />
                  </Flex>
                  <TextHighlight size="xs" text={description} textQuery={searchValue} hiddenBelow="sm" />
                  <ArticleMetadata color="black" date={date} authors={authors} displayedFields={['date', 'authors']} />
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
          <Heading as="p" size="m" mt="s">
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
