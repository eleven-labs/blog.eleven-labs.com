import type { Meta, StoryObj } from '@storybook/react-vite';

import { ShareLinks } from './ShareLinks';

const meta: Meta<typeof ShareLinks> = {
  // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
  parameters: { a11y: { test: 'todo' } },
  component: ShareLinks,
  args: {
    urlToShare: 'https://eleven-labs.com/',
    shares: {
      twitter: true,
      facebook: true,
      linkedIn: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ShareLinks>;

export const Overview: Story = {};
