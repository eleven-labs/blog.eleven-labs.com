import './AutocompleteField.scss';

import { Box, BoxProps, polyRef, SearchField } from '@eleven-labs/design-system';
import { SearchFieldProps } from '@eleven-labs/design-system/dist/components/Molecules/SearchField/SearchField';
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
  onEnter?: (value: string) => void;
};

export type AutocompleteFieldProps = BoxProps &
  AutocompleteFieldOptions &
  Omit<AutocompleteResultOptions, 'highlightedIndex' | 'searchLink'> &
  Pick<UseComboboxProps<AutocompleteItem>, 'onInputValueChange' | 'onSelectedItemChange'>;

export const AutocompleteField = polyRef<'div', AutocompleteFieldProps>(
  (
    {
      placeholder,
      defaultValue,
      items = [],
      searchLink: { label: searchLinkLabel, ...searchLinkProps },
      searchNotFound,
      onInputValueChange,
      onSelectedItemChange,
      onEnter,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (onEnter && event.key === 'Enter') {
        onEnter(event.currentTarget.value);
      }
    };

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
          input={getInputProps({ placeholder, onKeyDown: handleKeyDown })}
          buttonSearch={{ as: 'a', ...searchLinkProps } as unknown as SearchFieldProps['buttonSearch']}
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
