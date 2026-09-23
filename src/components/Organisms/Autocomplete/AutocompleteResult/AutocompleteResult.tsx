import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { PostMetadata } from '@/components';
import { Heading, Link, Text, TextHighlight } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

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
        'absolute left-0 z-2 mt-s w-screen bg-white px-s pt-s filter-[drop-shadow(0_4px_14px_rgb(0_0_0/25%))]',
        'md:-mt-m md:w-full md:rounded-b-xs md:px-0 md:pt-l',
        className
      )}
    >
      {items.length > 0 && (
        <>
          {items.map(({ slug, title, date, authors, link }, index) => (
            <React.Fragment key={slug}>
              <div
                className={cn(
                  'relative block px-m pt-xxs pb-xs',
                  highlightedIndex === index && 'bg-secondary'
                )}
              >
                <TextHighlight
                  render={<a {...link} />}
                  size="s"
                  text={title}
                  textQuery={searchValue}
                  className="line-clamp-4 text-black before:absolute before:inset-0 before:z-1 before:content-['_'] md:line-clamp-2"
                />
                <PostMetadata
                  className="mt-xxs-3"
                  date={date}
                  authors={authors}
                  displayedFields={['date', 'authors']}
                />
              </div>
            </React.Fragment>
          ))}
          {searchLinkProps && searchLinkLabel && (
            <div className="pt-s pb-m text-center text-s font-medium md:pt-m md:pb-l">
              <Link {...searchLinkProps}>{searchLinkLabel}</Link>
            </div>
          )}
        </>
      )}
      {items.length === 0 && searchNotFound && (
        <div className="px-xl py-m text-center">
          <div className="h-[135px] w-full bg-[url(/imgs/not-found.png)] bg-center bg-no-repeat" />
          <Heading size="m" className="mt-s">
            {searchNotFound.title}
          </Heading>
          <Text size="xs" className="mt-xxs">
            {searchNotFound.description}
          </Text>
        </div>
      )}
    </div>
  )
);

AutocompleteResult.displayName = 'AutocompleteResult';
