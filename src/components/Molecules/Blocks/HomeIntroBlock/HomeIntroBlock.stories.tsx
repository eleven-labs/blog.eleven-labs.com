import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { Link } from '@/design-system';

import { HomeIntroBlock } from './HomeIntroBlock';

const meta: Meta<typeof HomeIntroBlock> = {
  component: HomeIntroBlock,
  args: {
    intro: 'Explorons de nouveaux savoirs',
    title: (
      <>
        Le blog des astronautes
        <br />
        d’Eleven Labs sur les
        <br />
        nouvelles technologies
      </>
    ),
    description: (
      <>
        Dans ce blog, retrouvez les retours d’expériences, conseils et convictions de nos collaborateurs autour des
        dernières tendances technologiques en <Link href="#">développement web et mobile</Link>,{' '}
        <Link href="#">agilité</Link> et de <Link href="#">l’écosystème Javascript</Link> et{' '}
        <Link href="#">PHP Symfony</Link>. Découvrez également nos tutoriels pour apprendre pas à pas à créer
        différentes features !
      </>
    ),
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
