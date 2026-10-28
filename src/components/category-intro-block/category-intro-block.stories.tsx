import type { Meta, StoryObj } from '@storybook/react-vite';

import { CategoryIntroBlock } from './category-intro-block';

const meta = {
  title: 'Shared/CategoryIntroBlock',
  component: CategoryIntroBlock,
  args: {
    breadcrumb: {
      items: [{ label: 'Accueil', href: '#' }, { label: 'JavaScript' }],
    },
    title: (
      <>
        Nos articles et retours d’expérience
        <br />
        en développement JavaScript
      </>
    ),
    description:
      'JavaScript est un langage de programmation dynamique complet et doté d’une incroyable flexibilité ! Dans cette catégorie, retrouvez tous les articles, retours d’expérience et tutoriels de nos astronautes autour de React, Node.js, NestJS, Next.js, Vue.js ou Svelte, mais également des outils pour faciliter votre delivery, du Design System et bien plus encore ! Bonne lecture.',
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CategoryIntroBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
