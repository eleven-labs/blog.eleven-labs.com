import './AutocompleteField.scss';

import { Box, BoxProps, forwardRef, SearchField, SearchFieldOptions } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { AutocompleteResult, AutocompleteResultOptions } from './AutocompleteResult/AutocompleteResult';

export type AutocompleteFieldOptions = {
  isOpen?: boolean;
};

export type AutocompleteFieldProps = BoxProps &
  AutocompleteFieldOptions &
  SearchFieldOptions &
  AutocompleteResultOptions;

export const AutocompleteField = forwardRef<AutocompleteFieldProps, 'div'>(
  (
    {
      input,
      buttonSearch,
      buttonClose,
      items = [],
      isOpen = false,
      seeAllSearchLink,
      searchNotFound,
      highlightedIndex,
      ...props
    },
    ref
  ) => (
    <Box className={classNames('autocomplete-field', props.className)} ref={ref}>
      <SearchField
        input={input}
        buttonSearch={buttonSearch}
        buttonClose={buttonClose}
        className="autocomplete-field__input"
      />
      {isOpen && (
        <AutocompleteResult
          items={items}
          highlightedIndex={highlightedIndex}
          searchValue={input?.value as string}
          seeAllSearchLink={seeAllSearchLink}
          searchNotFound={searchNotFound}
        />
      )}
    </Box>
  )
);

AutocompleteField.displayName = 'AutocompleteField';
