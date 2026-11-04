import type { Meta, StoryObj } from '@storybook/react-vite';

import type { PostCardProps } from '@/components/post-card';

import { LastArticlesBlock } from './last-articles-block';

const basePost: Partial<PostCardProps> = {
  contentType: 'article',
  cover: { img: { src: '/imgs/default-cover.jpg', alt: '' } },
  date: '9 févr. 2024',
  readingTime: { label: '12 min', dateTime: 'PT12M' },
  link: { href: '#' },
};

const meta = {
  title: 'Shared/LastArticlesBlock',
  component: LastArticlesBlock,
  args: {
    title: 'Nos articles récents autour des dernières tendances technologiques',
    posts: [
      {
        ...basePost,
        slug: 'nestjs-profiler',
        title: 'Profiler une application NestJS en développement',
        excerpt: 'Un profiler maison pour comprendre les requêtes, les logs et les requêtes SQL d’une API NestJS.',
        authors: [{ username: 'fpasquet', name: 'Fabien Pasquet' }],
      },
      {
        ...basePost,
        slug: 'design-system-tokens',
        title: 'Mettre en place des tokens de design dans une application React',
        excerpt:
          'Couleurs, typographie, espacements : comment centraliser les décisions visuelles dans un seul fichier.',
        authors: [{ username: 'jdupont', name: 'Jeanne Dupont' }],
      },
      {
        ...basePost,
        slug: 'symfony-messenger',
        title: 'Symfony Messenger : traiter des messages en asynchrone',
        excerpt: 'Bus, transports et handlers : les bases pour sortir les traitements lourds de la requête HTTP.',
        authors: [
          { username: 'jdoe', name: 'Julien Doe' },
          { username: 'phowell', name: 'Patricia Howell' },
        ],
      },
    ],
    linkSeeMore: { label: 'Voir tous les articles', href: '#' },
  },
} satisfies Meta<typeof LastArticlesBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
