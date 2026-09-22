import type { AutocompleteItem, AutocompleteResultOptions } from './AutocompleteResult';
import type { UseComboboxProps } from 'downshift';

import type { BoxProps, SearchFieldProps } from '@/design-system';

import classNames from 'classnames';
import { useCombobox } from 'downshift';
import React from 'react';

import { Box, SearchField } from '@/design-system';
import { polyRef } from '@/design-system/helpers';

import { AutocompleteResult } from './AutocompleteResult';

import './Autocomplete.scss';

export type AutocompleteOptions = {
  placeholder: string;
  searchLink: Exclude<AutocompleteResultOptions['searchLink'], undefined>;
  defaultValue?: string;
  onEnter?: (value: string) => void;
};

export type AutocompleteProps = BoxProps &
  AutocompleteOptions &
  Omit<AutocompleteResultOptions, 'highlightedIndex' | 'searchLink'> &
  Pick<UseComboboxProps<AutocompleteItem>, 'onInputValueChange' | 'onSelectedItemChange' | 'isOpen'>;

export const Autocomplete = polyRef<'div', AutocompleteProps>(
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
      isOpen: defaultIsOpen,
      ...props
    },
    ref
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (onEnter && event.key === 'Enter') {
        onEnter(event.currentTarget.value);
      }
    };

    const {
      getInputProps,
      getLabelProps,
      getMenuProps,
      getItemProps,
      selectItem,
      toggleMenu,
      isOpen,
      inputValue,
      highlightedIndex,
    } = useCombobox<AutocompleteItem>({
      // Sans identifiant fixe, downshift dérive le sien de `useId`. Le serveur rend le champ dans la
      // page entière quand le navigateur n'hydrate que l'en-tête : les deux identifiants diffèrent
      // et React signale alors un défaut d'hydratation.
      id: 'autocomplete',
      defaultInputValue: defaultValue,
      onInputValueChange,
      onSelectedItemChange,
      items,
      itemToString: (item) => (item ? item.title : ''),
      isOpen: defaultIsOpen,
    });

    const onClose = (): void => selectItem(null);

    const itemsWithDownshiftProps = React.useMemo(
      () =>
        items.map((item, index) => ({
          ...item,
          ...getItemProps({ item, index }),
        })),
      [items, getItemProps]
    );

    return (
      <Box {...props} className={classNames('autocomplete', props.className)} ref={ref}>
        <Box as="label" {...getLabelProps()} className="autocomplete__label">
          {placeholder}
        </Box>
        <SearchField
          input={getInputProps({ placeholder, onKeyDown: handleKeyDown })}
          buttonSearch={{ as: 'a', ...searchLinkProps } as unknown as SearchFieldProps['buttonSearch']}
          buttonClose={{ onClick: onClose }}
          className="autocomplete__input"
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

Autocomplete.displayName = 'Autocomplete';
