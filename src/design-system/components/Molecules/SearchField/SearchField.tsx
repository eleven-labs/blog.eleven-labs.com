import type { PolymorphicPropsWithoutRef } from 'react-polymorphed';

import type { BoxProps } from '@/design-system';

import classNames from 'classnames';
import * as React from 'react';

import { CloseButton, Box, Flex, Icon } from '@/design-system';
import { polyRef } from '@/design-system/helpers/polyRef';

import './SearchField.scss';

export interface SearchFieldProps extends BoxProps {
  input: Omit<PolymorphicPropsWithoutRef<'input', object>, keyof BoxProps>;
  buttonSearch: Omit<PolymorphicPropsWithoutRef<'button', object>, keyof BoxProps>;
  buttonClose?: Omit<PolymorphicPropsWithoutRef<'button', object>, keyof BoxProps>;
}

export const SearchField = polyRef<'div', SearchFieldProps>(
  ({ input, buttonClose = {}, buttonSearch, className, ...props }, ref) => (
    <Box {...props} className={classNames('search-field', className)} ref={ref}>
      <Box {...{ as: 'input', ...input }} className="search-field__input" />
      <Flex justifyContent="center" alignItems="center" className="search-field__actions-container">
        {Boolean(input.value) && (
          <CloseButton {...buttonClose} variant="secondary" className="search-field__button-action" />
        )}
        <Box as="button" {...buttonSearch} className="search-field__button-action">
          <Icon name="search" color="primary" size="2.5rem" mx="xs" />
        </Box>
      </Flex>
    </Box>
  )
);

SearchField.displayName = 'SearchField';
