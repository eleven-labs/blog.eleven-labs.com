import type { Meta, StoryObj } from '@storybook/react-vite';

import { ShareLinks } from './share-links';

const meta = {
  title: 'Shared/ShareLinks',
  component: ShareLinks,
  args: {
    urlToShare: 'https://blog.eleven-labs.com/fr/profiler-nestjs/',
    shares: { twitter: true, facebook: true, linkedIn: true },
  },
} satisfies Meta<typeof ShareLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LinkedInOnly: Story = { args: { shares: { linkedIn: true } } };
