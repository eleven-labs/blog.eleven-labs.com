import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AuthorCard } from './AuthorCard';

const meta: Meta<typeof AuthorCard> = {
  title: 'Components/AuthorCard',
  component: AuthorCard,
  args: {
    name: 'John Doe',
    description: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
    link: {
      href: '/fr/authors/jdoe',
    },
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [
    (Story): React.ReactElement => (
      <div style={{ maxWidth: '764px', margin: '32px auto' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AuthorCard>;

export const Overview: Story = {};
