import type { AutocompleteProps } from '@/components';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import classNames from 'classnames';
import React from 'react';

import { Autocomplete, Logo } from '@/components';
import { Box, BurgerButton, Button, CloseButton, Flex, Link } from '@/design-system';

import './Header.scss';

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
  <Flex as="header" justifyContent="between" alignItems="center" bg="white" p="m" className="header">
    <Box as="a" {...homeLink} color="primary">
      <Logo name="blog" className="header__logo" />
    </Box>
    <Box className={classNames('header__menu', { 'header__menu--is-open': menuIsOpen })}>
      {categories.map(({ label, ...categoryLink }, index) => (
        <Link as="a" key={index} {...categoryLink} data-internal-link="category" className="header__menu-item">
          {label}
        </Link>
      ))}
      {hasTutorial && (
        <>
          <Box className="header__separator" />
          <Box as="a" {...tutorialLink} data-internal-link="category" className="header__menu-item">
            {tutorialLinkLabel}
          </Box>
        </>
      )}
      <Flex justifyContent="center" alignItems="center" mt="m" hiddenAbove="md">
        <Button as="a" {...contactLink}>
          {contactLinkLabel}
        </Button>
      </Flex>
    </Box>
    <Autocomplete hiddenBelow="md" {...autocomplete} />
    {menuIsOpen ? (
      <CloseButton hiddenAbove="md" onClick={onToggleMenu} />
    ) : (
      <BurgerButton hiddenAbove="md" onClick={onToggleMenu} />
    )}
  </Flex>
);
