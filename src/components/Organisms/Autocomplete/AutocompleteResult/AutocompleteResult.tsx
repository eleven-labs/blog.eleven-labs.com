import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostMetadata } from '@/components';
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
  className?: string;
};

export type AutocompleteResultProps = AutocompleteResultOptions;

/** La ref est celle que downshift pose sur le menu, via `getMenuProps()`. */
export const AutocompleteResult = React.forwardRef<HTMLDivElement, AutocompleteResultProps>(
  (
    {
      isOpen = false,
      items,
      searchValue,
      searchLink: { label: searchLinkLabel, ...searchLinkProps } = {},
      searchNotFound,
      highlightedIndex = 0,
      className,
      ...props
    },
    ref
  ) => (
    <div
      {...props}
      ref={ref}
      hidden={!isOpen}
      className={cn(
        'mt-4 bg-surface px-4 pt-4',
        // Sous `md` les suggestions restent dans le panneau de recherche de l'en-tête et y défilent.
        'max-md:-mx-4 max-md:min-h-0 max-md:overflow-y-auto max-md:overscroll-contain',
        'md:absolute md:left-0 md:z-2 md:-mt-6 md:w-full md:rounded-b-card md:px-0 md:pt-8 md:filter-[drop-shadow(0_4px_14px_rgb(0_0_0/25%))]',
        className
      )}
    >
      {items.length > 0 && (
        <>
          {items.map(({ slug, title, date, authors, link }, index) => (
            <React.Fragment key={slug}>
              <div className={cn('relative block px-6 pt-2 pb-3', highlightedIndex === index && 'bg-canvas')}>
                <TextHighlight
                  render={<a {...link} />}
                  size="s"
                  text={title}
                  textQuery={searchValue}
                  className="line-clamp-4 text-ink before:absolute before:inset-0 before:z-1 before:content-['_'] md:line-clamp-2"
                />
                <PostMetadata className="mt-1" date={date} authors={authors} displayedFields={['date', 'authors']} />
              </div>
            </React.Fragment>
          ))}
          {searchLinkProps && searchLinkLabel && (
            <div className="pt-4 pb-6 text-center body-s font-medium md:pt-6 md:pb-8">
              <Link {...searchLinkProps}>{searchLinkLabel}</Link>
            </div>
          )}
        </>
      )}
      {items.length === 0 && searchNotFound && (
        <div className="px-10 py-6 text-center">
          <div className="h-[135px] w-full bg-[url(/imgs/not-found.png)] bg-center bg-no-repeat" />
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
