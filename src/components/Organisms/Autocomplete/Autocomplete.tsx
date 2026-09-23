import type { AutocompleteItem, AutocompleteResultOptions } from './AutocompleteResult';
import type { UseComboboxProps } from 'downshift';

import { useCombobox } from 'downshift';
import React from 'react';

import { SearchField } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

import { AutocompleteResult } from './AutocompleteResult';

export type AutocompleteOptions = {
  placeholder: string;
  searchLink: Exclude<AutocompleteResultOptions['searchLink'], undefined>;
  defaultValue?: string;
  onEnter?: (value: string) => void;
  className?: string;
};

export type AutocompleteProps = AutocompleteOptions &
  Omit<AutocompleteResultOptions, 'highlightedIndex' | 'searchLink'> &
  Pick<UseComboboxProps<AutocompleteItem>, 'onInputValueChange' | 'onSelectedItemChange' | 'isOpen'>;

export const Autocomplete: React.FC<AutocompleteProps> = ({
  placeholder,
  defaultValue,
  items = [],
  searchLink: { label: searchLinkLabel, ...searchLinkProps },
  searchNotFound,
  onInputValueChange,
  onSelectedItemChange,
  onEnter,
  isOpen: defaultIsOpen,
  className,
}) => {
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
    // Les résultats se déploient sous le champ à partir de `md`, et sur toute la page en dessous.
    <div className={cn('md:relative', className)}>
      {/* Le champ n'affiche pas de libellé : on en rend un pour les lecteurs d'écran, faute de
          quoi l'`aria-labelledby` posé par downshift ne désigne aucun élément de la page. */}
      <label {...getLabelProps()} className="sr-only">
        {placeholder}
      </label>
      <SearchField
        input={getInputProps({ placeholder, onKeyDown: handleKeyDown })}
        buttonSearch={{ render: <a {...searchLinkProps} /> }}
        buttonClose={{ onClick: onClose }}
        className="relative z-3"
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
    </div>
  );
};
