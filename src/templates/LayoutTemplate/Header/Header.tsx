import './Header.scss';

import { Box, Button, Flex, Link, Logo } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { AutocompleteField, AutocompleteFieldProps, BurgerButton, CloseButton } from '@/components';

export interface HeaderProps {
  homeLink: React.ComponentPropsWithoutRef<'a'>;
  categories: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & React.ComponentPropsWithoutRef<'a'>)[];
  hasTutorial: boolean;
  tutorialLink: { label: React.ReactNode } & React.ComponentPropsWithoutRef<'a'>;
  contactLink: { label: React.ReactNode } & React.ComponentPropsWithoutRef<'a'>;
  autocomplete: AutocompleteFieldProps;
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
}) => {
  return (
    <Flex as="header" justifyContent="between" alignItems="center" bg="white" p="m" className="header">
      <Box as="a" {...homeLink} color="navy">
        <Logo name="blog" className="header__logo" />
      </Box>
      <Box className={classNames('header__menu', { 'header__menu--is-open': menuIsOpen })}>
        {categories.map(({ label, isActive, ...categoryLink }, index) => (
          <Link as="a" key={index} {...categoryLink} data-internal-link="category" className="header__menu-item">
            {label}
          </Link>
        ))}
        {hasTutorial && (
          <>
            <Box className="header__separator" />
            <Link as="a" {...tutorialLink} data-internal-link="category" className="header__menu-item">
              {tutorialLinkLabel}
            </Link>
          </>
        )}
        <Flex justifyContent="center" alignItems="center" mt="m" hiddenAbove="md">
          <Button as="a" {...contactLink}>
            {contactLinkLabel}
          </Button>
        </Flex>
      </Box>
      <AutocompleteField hiddenBelow="md" {...autocomplete} />
      {menuIsOpen ? (
        <CloseButton hiddenAbove="md" onClick={onToggleMenu} />
      ) : (
        <BurgerButton hiddenAbove="md" onClick={onToggleMenu} />
      )}
    </Flex>
  );
};
