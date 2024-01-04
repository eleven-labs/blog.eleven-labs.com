import type { Meta, StoryObj } from '@storybook/react';

import { HomeIntroBlock } from './HomeIntroBlock';

const meta: Meta<typeof HomeIntroBlock> = {
  title: 'Components/Blocks/HomeIntroBlock',
  component: HomeIntroBlock,
  args: {
    intro: 'Explorons de nouveaux savoirs',
    title: 'Le blog des astronautes<br />d’Eleven Labs sur les<br />nouvelles technologies',
    description: `Dans ce blog, retrouvez les retours d’expériences, conseils et convictions de nos collaborateurs autour des dernières tendances technologiques en <a href="#">développement web et mobile</a>, <a href="#">agilité</a> et de <a href="#">l’écosystème Javascript</a> et <a href="#">PHP Symfony</a>. Découvrez également nos tutoriels pour apprendre pas à pas à créer différentes features !`,
    elevenLabsLink: {
      label: 'En savoir plus sur Eleven Labs',
      href: '#',
    },
  },
  parameters: {
    layout: 'full',
  },
};

export default meta;
type Story = StoryObj<typeof HomeIntroBlock>;

export const Overview: Story = {};
