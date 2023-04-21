import './Header.scss';

import { AsProps, Box, Flex, Icon, Logo, useMediaQuery } from '@eleven-labs/design-system';
import React from 'react';

import { AutocompleteField, AutocompleteFieldProps } from '@/components';

export interface HeaderProps {
  homeLink: AsProps<'a'>;
  autocomplete: AutocompleteFieldProps;
  autocompleteIsDisplayed?: boolean;
  onToggleSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  homeLink,
  autocomplete,
  autocompleteIsDisplayed = false,
  onToggleSearch,
}) => {
  const isNotTablet = useMediaQuery('aboveTablet');
  return (
    <Box as="header" bg="azure" className="header">
      <Flex justifyContent="between" alignItems="center" py="s" px={{ xs: 'm', md: 'l' }}>
        {!isNotTablet && autocompleteIsDisplayed ? (
          <Box as="button" className="header__icon-button" color="white" onClick={onToggleSearch}>
            <Icon name="arrow-back" color="white" size="28px" />
          </Box>
        ) : (
          <Box {...(homeLink as typeof Box)} color="white">
            <Logo name="blog" className="header__logo" />
          </Box>
        )}
        {isNotTablet || autocompleteIsDisplayed ? (
          <AutocompleteField {...autocomplete} />
        ) : (
          <Box as="button" className="header__icon-button" onClick={onToggleSearch} aria-label="Open search">
            <Icon name="search" color="white" size="28px" />
          </Box>
        )}
      </Flex>
    </Box>
  );
};
