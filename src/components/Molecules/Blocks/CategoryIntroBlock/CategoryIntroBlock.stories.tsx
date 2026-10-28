import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { CategoryIntroBlock } from './CategoryIntroBlock';

const meta: Meta<typeof CategoryIntroBlock> = {
  component: CategoryIntroBlock,
  args: {
    breadcrumb: {
      items: [{ label: 'Accueil', href: '#' }, { label: 'JavaScript' }],
    },
    title: (
      <>
        Nos articles et retours d’expérience
        <br />
        en développement Javascript
      </>
    ),
    description: `Javascript est un langage de programmation dynamique complet et doté d’une incroyable flexibilité ! Ce n’est pas pour rien que ce langage est aujourd'hui le plus utilisé par les développeurs à travers le monde. Dans cette catégorie, retrouvez tous les articles, retours d’expérience et tutoriels de nos astronautes autour de React.js, Node.js, Nest.js, Next.js, Vue.js, Svelte.js mais également des outils à utiliser pour faciliter votre delivery, du Design System et bien plus encore ! Bonne lecture.`,
  },
  parameters: {
    // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
    a11y: { test: 'todo' },
    layout: 'full',
  },
};

export default meta;
type Story = StoryObj<typeof CategoryIntroBlock>;

export const Overview: Story = {};
