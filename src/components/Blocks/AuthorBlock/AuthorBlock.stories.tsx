import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { AuthorBlock } from './AuthorBlock';

const meta: Meta<typeof AuthorBlock> = {
  title: 'Components/Blocks/AuthorBlock',
  component: AuthorBlock,
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
type Story = StoryObj<typeof AuthorBlock>;

export const Overview: Story = {};
