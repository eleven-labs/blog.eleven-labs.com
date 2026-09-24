import type { HeaderProps } from './Header';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { Header } from './Header';

const SEARCH_LABEL = 'Rechercher un article';

const HeaderWithState: React.FC = () => {
  const [menuIsOpen, setMenuIsOpen] = React.useState(false);
  const [searchIsOpen, setSearchIsOpen] = React.useState(false);

  const props: HeaderProps = {
    homeLink: { href: '/' },
    categories: [{ label: 'Tous les articles', href: '/all' }],
    hasTutorial: false,
    tutorialLink: { label: 'Tutoriels', href: '/tutorial' },
    contactLink: { label: 'Contact', href: '/contact' },
    autocomplete: {
      placeholder: 'Nom d’article, auteur...',
      items: [],
      searchLink: { label: 'Voir tous les résultats', href: '/search' },
    },
    menuIsOpen,
    onToggleMenu: () => {
      setMenuIsOpen((currentIsOpen) => !currentIsOpen);
      setSearchIsOpen(false);
    },
    searchIsOpen,
    searchButtonLabel: SEARCH_LABEL,
    onToggleSearch: () => {
      setSearchIsOpen((currentIsOpen) => !currentIsOpen);
      setMenuIsOpen(false);
    },
  };

  return <Header {...props} />;
};

describe('Header', () => {
  const getSearchButton = (): HTMLElement => screen.getByRole('button', { name: SEARCH_LABEL });
  const getSearch = (): HTMLElement => document.getElementById('header-search') as HTMLElement;

  it('should expose a search button that controls the search field', () => {
    render(<HeaderWithState />);

    expect(getSearchButton()).toHaveAttribute('aria-expanded', 'false');
    expect(getSearchButton()).toHaveAttribute('aria-controls', 'header-search');
    expect(getSearch()).toHaveClass('max-md:hidden');
  });

  it('should open the search field and move the focus into it', () => {
    render(<HeaderWithState />);

    fireEvent.click(getSearchButton());

    expect(getSearchButton()).toHaveAttribute('aria-expanded', 'true');
    expect(getSearch()).not.toHaveClass('max-md:hidden');
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
  });

  it('should close the search field with the Escape key and give the focus back to the button', () => {
    render(<HeaderWithState />);

    fireEvent.click(getSearchButton());
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });

    expect(getSearchButton()).toHaveAttribute('aria-expanded', 'false');
    expect(getSearch()).toHaveClass('max-md:hidden');
    expect(document.activeElement).toBe(getSearchButton());
  });

  it('should close the search field with its close button and give the focus back to the button', () => {
    render(<HeaderWithState />);

    fireEvent.click(getSearchButton());
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'react' } });
    const closeButton = getSearch().querySelector('input + div button') as HTMLElement;
    fireEvent.click(closeButton);

    expect(getSearchButton()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('combobox')).toHaveValue('');
    expect(document.activeElement).toBe(getSearchButton());
  });
});
