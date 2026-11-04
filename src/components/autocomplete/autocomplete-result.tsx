import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostMetadata } from '@/components/post-metadata';
import { cn } from '@/design-system/helpers/cn';
import { Heading } from '@/design-system/ui/heading';
import { Link } from '@/design-system/ui/link';
import { Text } from '@/design-system/ui/text';
import { TextHighlight } from '@/design-system/ui/text-highlight';

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
  /** Attributs ARIA et gestionnaires de chaque suggestion (`getItemProps` de downshift). */
  getItemProps?: (options: { item: AutocompleteItem; index: number }) => ComponentPropsWithoutRef<'a'>;
  className?: string;
};

export type AutocompleteResultProps = AutocompleteResultOptions &
  Omit<ComponentPropsWithoutRef<'ul'>, keyof AutocompleteResultOptions>;

/**
 * Suggestions de l'autocomplétion. La ref et les attributs restants sont ceux que downshift pose sur la liste, via
 * `getMenuProps()` : cette liste (`role="listbox"`) ne contient que les suggestions (`role="option"`, posé sur le
 * lien). Le lien « tous les résultats » et le message d'absence de résultat sont à côté, hors de la liste.
 */
export const AutocompleteResult = React.forwardRef<HTMLUListElement, AutocompleteResultProps>(
  (
    {
      isOpen = false,
      items,
      searchValue,
      searchLink: { label: searchLinkLabel, ...searchLinkProps } = {},
      searchNotFound,
      highlightedIndex = 0,
      getItemProps,
      className,
      ...props
    },
    ref
  ) => (
    <div hidden={!isOpen} className={cn('autocomplete-result', className)}>
      <ul {...props} ref={ref} hidden={items.length === 0} className="autocomplete-result-list">
        {items.map((item, index) => (
          <li
            key={item.slug}
            role="presentation"
            className={cn('autocomplete-result-item', highlightedIndex === index && 'autocomplete-result-item-active')}
          >
            <TextHighlight
              render={<a {...item.link} {...getItemProps?.({ item, index })} />}
              size="s"
              text={item.title}
              textQuery={searchValue}
              className="autocomplete-result-link"
            />
            <PostMetadata
              className="mt-1"
              date={item.date}
              authors={item.authors}
              displayedFields={['date', 'authors']}
            />
          </li>
        ))}
      </ul>
      {items.length > 0 && searchLinkProps && searchLinkLabel && (
        <div className="autocomplete-result-more">
          <Link {...searchLinkProps}>{searchLinkLabel}</Link>
        </div>
      )}
      {items.length === 0 && searchNotFound && (
        <div role="status" className="autocomplete-not-found">
          <div className="autocomplete-not-found-image" aria-hidden="true" />
          <Heading size="m" className="mt-4">
            {searchNotFound.title}
          </Heading>
          <Text size="xs" className="mt-2">
            {searchNotFound.description}
          </Text>
        </div>
      )}
    </div>
  )
);

AutocompleteResult.displayName = 'AutocompleteResult';
