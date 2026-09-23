import type { LastTutorialsBlockProps } from './LastTutorialsBlock';
import type { Meta, StoryObj } from '@storybook/react';

import * as PostCardStories from '@/components/Molecules/Cards/PostCard/PostCard.stories';

import { LastTutorialsBlock } from './LastTutorialsBlock';

const meta: Meta<typeof LastTutorialsBlock> = {
  component: LastTutorialsBlock,
  args: {
    title: 'Les tutoriels tech’ de nos astronautes !',
    description:
      'Avec nos tutoriels, apprenez pas à pas à créer de nouvelles features : créer un chat avec Mercure et Symfony, mettre en place un CI/CD avec GitLab-CI pour une application Javascript et bien plus encore. Suivez le guide !',
    tutorialLabel: 'Tutoriel',
    posts: [
      {
        ...(PostCardStories.WithContentTypeTutorial.args as LastTutorialsBlockProps['posts'][0]),
      },
      {
        ...(PostCardStories.WithContentTypeTutorial.args as LastTutorialsBlockProps['posts'][0]),
        title: 'Nam molestie elementum libero, ut sollicitudin lorem placerat',
      },
    ],
    linkSeeMore: { label: 'Découvrir tous nos tutoriels', href: '#' },
  },
};

export default meta;
type Story = StoryObj<typeof LastTutorialsBlock>;

export const Overview: Story = {};
