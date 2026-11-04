import type { AutocompleteProps } from '@/components/autocomplete';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Autocomplete } from '@/components/autocomplete';
import { Logo } from '@/components/logo';
import { cn } from '@/design-system/helpers/cn';
import { BurgerButton } from '@/design-system/ui/burger-button';
import { Button } from '@/design-system/ui/button';
import { CloseButton } from '@/design-system/ui/close-button';
import { Icon } from '@/design-system/ui/icon';
import { Link } from '@/design-system/ui/link';

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

/**
 * En-tête du blog : logo, catégories, recherche avec autocomplétion et lien de contact. Sous `md`, le menu et la
 * recherche s'ouvrent à la demande ; Échap ferme la recherche et rend le focus à la loupe.
 * Les attributs `data-header-menu` et `data-header-search` sont lus par `stickyHeaderHelper` (en-tête collant).
 */
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
    <header className="header">
      <a {...homeLink} className="header-logo">
        <Logo name="blog" />
      </a>
      <div data-header-menu className={cn('header-menu', menuIsOpen && 'header-menu-open')}>
        {categories.map(({ label, ...categoryLink }, index) => (
          <Link key={index} {...categoryLink} data-internal-link="category" className="header-menu-item">
            {label}
          </Link>
        ))}
        {hasTutorial && (
          <>
            <div className="header-menu-divider" aria-hidden="true" />
            <a {...tutorialLink} data-internal-link="category" className="header-menu-item">
              {tutorialLinkLabel}
            </a>
          </>
        )}
        <div className="header-menu-contact">
          <Button render={<a {...contactLink} />}>{contactLinkLabel}</Button>
        </div>
      </div>
      <div
        ref={searchRef}
        id={SEARCH_ID}
        data-header-search
        className={cn('header-search', searchIsOpen && 'header-search-open')}
      >
        <Autocomplete {...autocomplete} onClose={closeSearch} />
      </div>
      <div className="header-actions">
        <button
          ref={searchButtonRef}
          type="button"
          aria-label={searchButtonLabel}
          aria-expanded={searchIsOpen}
          aria-controls={SEARCH_ID}
          className="header-search-toggle"
          onClick={onToggleSearch}
        >
          <Icon name="search" size="2.5rem" aria-hidden="true" />
        </button>
        {menuIsOpen ? (
          <CloseButton className="header-menu-toggle" onClick={onToggleMenu} />
        ) : (
          <BurgerButton className="header-menu-toggle" onClick={onToggleMenu} />
        )}
      </div>
    </header>
  );
};
