import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Text } from '@/design-system/ui/text';

import { ContactCard } from './ContactCard';

const meta: Meta<typeof ContactCard> = {
  // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
  parameters: { a11y: { test: 'todo' } },
  component: ContactCard,
  args: {
    title: (
      <>
        Vous souhaitez en savoir plus sur le sujet ?<br />
        <Text render={<span />} className="font-bold">
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
