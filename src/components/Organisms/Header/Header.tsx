import type { AutocompleteProps } from '@/components';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Autocomplete, Logo } from '@/components';
import { BurgerButton, Button, CloseButton, Icon, Link } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface HeaderProps {
  homeLink: ComponentPropsWithoutRef<'a'>;
  categories: ({
    label: React.ReactNode;
  } & ComponentPropsWithoutRef<'a'>)[];
  hasTutorial: boolean;
  tutorialLink: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
  contactLink: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
  autocomplete: AutocompleteProps;
  onToggleMenu: () => void;
  menuIsOpen?: boolean;
  searchButtonLabel: string;
  onToggleSearch: () => void;
  searchIsOpen?: boolean;
}

const SEARCH_ID = 'header-search';

/* Sous `md` le menu quitte le flux pour occuper l'écran sous l'en-tête, haut de 80px. */
const menuClassName =
  'flex font-heading font-bold tracking-[0.5px] uppercase md:mx-xs md:gap-m lg:mx-0 lg:gap-xl max-md:fixed max-md:top-[80px] max-md:bottom-0 max-md:left-0 max-md:z-10 max-md:w-full max-md:flex-col max-md:border-t-[0.5px] max-md:border-secondary-dark max-md:bg-white';

/* Sous `md` le champ de recherche ne s'affiche qu'à la demande, sur toute la largeur sous l'en-tête. */
const searchClassName =
  'max-md:absolute max-md:top-full max-md:left-0 max-md:z-10 max-md:w-full max-md:border-y-[0.5px] max-md:border-ultra-light-grey max-md:bg-white max-md:p-s';

const menuItemClassName =
  'self-center font-bold text-info no-underline hover:text-primary hover:underline max-md:border-b-[0.5px] max-md:border-secondary-dark max-md:px-m max-md:py-xs';

export const Header: React.FC<HeaderProps> = ({
  homeLink,
  categories,
  hasTutorial,
  tutorialLink: { label: tutorialLinkLabel, ...tutorialLink },
  contactLink: { label: contactLinkLabel, ...contactLink },
  autocomplete,
  onToggleMenu,
  menuIsOpen = false,
  searchButtonLabel,
  onToggleSearch,
  searchIsOpen = false,
}) => {
  const searchRef = React.useRef<HTMLDivElement>(null);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);

  const closeSearch = (): void => {
    if (searchIsOpen) {
      onToggleSearch();
      searchButtonRef.current?.focus();
    }
  };

  React.useEffect(() => {
    if (searchIsOpen) {
      searchRef.current?.querySelector('input')?.focus();
    }
  }, [searchIsOpen]);

  React.useEffect(() => {
    if (!searchIsOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onToggleSearch();
        searchButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchIsOpen, onToggleSearch]);

  return (
    <header className="relative flex items-center justify-between border-b-[0.5px] border-ultra-light-grey bg-white p-m">
      <a {...homeLink} className="text-primary">
        <Logo name="blog" className="text-[2rem] md:text-[2.75rem]" />
      </a>
      <div data-header-menu className={cn(menuClassName, menuIsOpen ? 'max-md:flex' : 'max-md:hidden')}>
        {categories.map(({ label, ...categoryLink }, index) => (
          <Link key={index} {...categoryLink} data-internal-link="category" className={menuItemClassName}>
            {label}
          </Link>
        ))}
        {hasTutorial && (
          <>
            <div className="w-px bg-primary" />
            <a {...tutorialLink} data-internal-link="category" className={menuItemClassName}>
              {tutorialLinkLabel}
            </a>
          </>
        )}
        <div className="mt-m flex items-center justify-center md:hidden">
          <Button render={<a {...contactLink} />}>
            {contactLinkLabel}
          </Button>
        </div>
      </div>
      <div
        ref={searchRef}
        id={SEARCH_ID}
        data-header-search
        className={cn(searchClassName, !searchIsOpen && 'max-md:hidden')}
      >
        <Autocomplete {...autocomplete} onClose={closeSearch} />
      </div>
      <div className="flex items-center gap-s md:hidden">
        <button
          ref={searchButtonRef}
          type="button"
          aria-label={searchButtonLabel}
          aria-expanded={searchIsOpen}
          aria-controls={SEARCH_ID}
          className="flex bg-transparent text-primary"
          onClick={onToggleSearch}
        >
          <Icon name="search" size="2.5rem" />
        </button>
        {menuIsOpen ? <CloseButton onClick={onToggleMenu} /> : <BurgerButton onClick={onToggleMenu} />}
      </div>
    </header>
  );
};
