import type { AutocompleteProps } from '@/components';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Autocomplete, Logo } from '@/components';
import { BurgerButton, Button, CloseButton, Link } from '@/design-system';
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
}

/* Sous `md` le menu quitte le flux pour occuper l'écran sous l'en-tête, haut de 80px. */
const menuClassName =
  'flex font-heading font-bold tracking-[0.5px] uppercase md:mx-xs md:gap-m lg:mx-0 lg:gap-xl max-md:fixed max-md:top-[80px] max-md:bottom-0 max-md:left-0 max-md:z-10 max-md:w-full max-md:flex-col max-md:border-t-[0.5px] max-md:border-secondary-dark max-md:bg-white';

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
}) => (
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
    <Autocomplete className="max-md:hidden" {...autocomplete} />
    {menuIsOpen ? (
      <CloseButton className="md:hidden" onClick={onToggleMenu} />
    ) : (
      <BurgerButton className="md:hidden" onClick={onToggleMenu} />
    )}
  </header>
);
