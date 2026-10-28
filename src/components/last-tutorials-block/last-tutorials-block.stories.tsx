import type { Meta, StoryObj } from '@storybook/react-vite';

import type { PostCardProps } from '@/components/post-card';

import { LastTutorialsBlock } from './last-tutorials-block';

const baseTutorial: Partial<PostCardProps> = {
  contentType: 'tutorial',
  cover: { img: { src: '/imgs/default-cover.jpg', alt: '' } },
  date: '14 mars 2024',
  readingTime: { label: '25 min', dateTime: 'PT25M' },
  link: { href: '#' },
};

const meta = {
  title: 'Shared/LastTutorialsBlock',
  component: LastTutorialsBlock,
  args: {
    title: 'Les tutoriels tech’ de nos astronautes !',
    description:
      'Avec nos tutoriels, apprenez pas à pas à créer de nouvelles features : créer un chat avec Mercure et Symfony, mettre en place un CI/CD avec GitLab CI pour une application JavaScript et bien plus encore. Suivez le guide !',
    tutorialLabel: 'Tutoriel',
    posts: [
      {
        ...baseTutorial,
        slug: 'chat-mercure-symfony',
        title: 'Créer un chat en temps réel avec Mercure et Symfony',
        excerpt: 'Un hub Mercure, un contrôleur Symfony et quelques lignes de JavaScript pour diffuser des messages.',
        authors: [{ username: 'jdoe', name: 'Julien Doe' }],
      },
      {
        ...baseTutorial,
        slug: 'ci-cd-gitlab-javascript',
        title: 'Mettre en place un CI/CD avec GitLab CI pour une application JavaScript',
        excerpt: 'Tests, build et déploiement : une pipeline complète, étape par étape.',
        authors: [{ username: 'jdupont', name: 'Jeanne Dupont' }],
      },
    ],
    linkSeeMore: { label: 'Découvrir tous nos tutoriels', href: '#' },
  },
} satisfies Meta<typeof LastTutorialsBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
