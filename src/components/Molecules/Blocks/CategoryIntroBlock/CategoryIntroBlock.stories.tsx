import type { CategoryIntroBlockProps } from './CategoryIntroBlock';
import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import BreadcrumbStories from '@/design-system/components/Atoms/Breadcrumb/Breadcrumb.stories';

import { CategoryIntroBlock } from './CategoryIntroBlock';

const meta: Meta<typeof CategoryIntroBlock> = {
  component: CategoryIntroBlock,
  args: {
    breadcrumb: BreadcrumbStories.args as CategoryIntroBlockProps['breadcrumb'],
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
    layout: 'full',
  },
};

export default meta;
type Story = StoryObj<typeof CategoryIntroBlock>;

export const Overview: Story = {};
