import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { Link } from '@/design-system';

import { CategoryEndingBlock } from './CategoryEndingBlock';

const meta: Meta<typeof CategoryEndingBlock> = {
  component: CategoryEndingBlock,
  args: {
    title: 'Quels types d’applications peuvent être développées en Javascript ?',
    description: (
      <>
        Aujourd’hui, il est quasiment possible de tout faire avec le langage Javascript : applications web et mobile,
        progressive web apps, logiciels, applications métier, site web fullstack Javascript, API backend, jeux vidéos,
        applications TV et bien d’autres.
        <br />
        En bref, Javascript est devenu le langage central du web et celui le plus utilisé sur GitHub depuis plusieurs
        années. Choisir Javascript pour son projet de <Link href="#">développement web</Link> est donc, dans la majorité
        des cas, une bonne idée !<br />
        <br />
        Chez Eleven Labs, nous pouvons vous accompagner dans tous vos besoins en développement d’applications web ou
        mobile en Javascript.
      </>
    ),
    expertiseLink: {
      label: 'Découvrir notre expertise en JavaScript',
      href: '#',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CategoryEndingBlock>;

export const Overview: Story = {};
