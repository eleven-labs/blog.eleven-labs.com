import type { PostCardProps } from './post-card';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { PostCard } from './post-card';

/** Contenu commun aux histoires, partagé avec celles de `PostCardList`. */
export const postCardArgs: PostCardProps = {
  contentType: 'article',
  cover: {
    img: {
      src: '/imgs/default-cover.jpg',
      alt: 'Illustration de l’article',
    },
  },
  title: 'Migrer son design system vers Tailwind CSS 4 : retour d’expérience sur un blog Astro',
  date: '9 févr. 2021',
  readingTime: { label: '24 min', dateTime: 'PT24M' },
  authors: [
    { username: 'mdupont', name: 'Marie Dupont' },
    { username: 'jmartin', name: 'Jean Martin' },
  ],
  excerpt:
    'Nous avons remplacé nos feuilles SCSS par des tokens et des classes sémantiques. Voici la méthode suivie, les pièges rencontrés et les gains obtenus sur la maintenance du blog.',
  link: {
    href: '#',
  },
};

const meta = {
  title: 'Shared/PostCard',
  component: PostCard,
  args: postCardArgs,
  parameters: {
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const HighlightLight: Story = {
  args: { variant: 'highlight-light' },
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '380px' }}>
        <Story />
      </div>
    ),
  ],
};

export const HighlightDark: Story = {
  args: { variant: 'highlight-dark' },
  // Carte translucide : elle se pose sur le bleu de la marque (bloc des derniers tutoriels)
  decorators: [
    (Story) => (
      <div className="bg-brand p-6">
        <div className="mx-auto max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const SideImage: Story = {
  args: { variant: 'side-image' },
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '764px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Tutorial: Story = {
  args: { contentType: 'tutorial', tutorialLabel: 'Tutoriel' },
};

export const Loading: Story = {
  args: { isLoading: true },
};
