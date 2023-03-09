import './AutocompleteField.scss';

import { AsProps, Box, BoxProps, forwardRef, SearchField } from '@eleven-labs/design-system';
import classNames from 'classnames';
import { useCombobox, UseComboboxProps } from 'downshift';
import React from 'react';

import {
  AutocompleteItem,
  AutocompleteResult,
  AutocompleteResultOptions,
} from './AutocompleteResult/AutocompleteResult';

export type AutocompleteFieldOptions = {
  placeholder: string;
  searchLink: Exclude<AutocompleteResultOptions['searchLink'], undefined>;
  defaultValue?: string;
};

export type AutocompleteFieldProps = BoxProps &
  AutocompleteFieldOptions &
  Omit<AutocompleteResultOptions, 'highlightedIndex' | 'searchLink'> &
  Pick<UseComboboxProps<AutocompleteItem>, 'onInputValueChange' | 'onSelectedItemChange'>;

export const AutocompleteField = forwardRef<AutocompleteFieldProps, 'div'>(
  (
    {
      placeholder,
      defaultValue,
      items = [],
      searchLink: { label: searchLinkLabel, ...searchLinkProps },
      searchNotFound,
      onInputValueChange,
      onSelectedItemChange,
      ...props
    },
    ref
  ) => {
    const { getInputProps, getMenuProps, getItemProps, selectItem, toggleMenu, isOpen, inputValue, highlightedIndex } =
      useCombobox<AutocompleteItem>({
        defaultInputValue: defaultValue,
        onInputValueChange,
        onSelectedItemChange,
        items,
        itemToString: (item) => (item ? item.title : ''),
      });

    const onClose = (): void => selectItem(null);

    const itemsWithDownshiftProps = React.useMemo(() => {
      return items.map((item, index) => ({
        ...item,
        ...getItemProps({ item, index }),
      }));
    }, [items, getItemProps]);

    return (
      <Box className={classNames('autocomplete-field', props.className)} ref={ref}>
        <SearchField
          input={getInputProps({ placeholder })}
          buttonSearch={searchLinkProps as AsProps<'button'>}
          buttonClose={{ onClick: onClose }}
          className="autocomplete-field__input"
        />
        <AutocompleteResult
          isOpen={isOpen && inputValue.length > 0}
          {...getMenuProps()}
          items={itemsWithDownshiftProps}
          highlightedIndex={highlightedIndex === -1 ? 0 : highlightedIndex}
          searchValue={inputValue}
          searchLink={{
            label: searchLinkLabel,
            ...searchLinkProps,
            onClick: toggleMenu,
          }}
          searchNotFound={searchNotFound}
        />
      </Box>
    );
  }
);

AutocompleteField.displayName = 'AutocompleteField';
