import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { Text } from '@/design-system';

import { ContactCard } from './ContactCard';

const meta: Meta<typeof ContactCard> = {
  component: ContactCard,
  args: {
    title: (
      <>
        Vous souhaitez en savoir plus sur le sujet ?<br />
        <Text as="span" fontWeight="bold">
          Organisons un échange !
        </Text>
      </>
    ),
    description: "Notre équipe d'experts répond à toutes vos questions.",
    link: {
      label: 'Nous contacter',
      href: '#',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContactCard>;

export const Overview: Story = {};
