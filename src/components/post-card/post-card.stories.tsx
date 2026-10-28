import type { Meta, StoryObj } from '@storybook/react-vite';

import { postCardArgs } from '@/stories/post-card';

import { PostCard } from './post-card';

const meta = {
  title: 'Shared/PostCard',
  component: PostCard,
  args: postCardArgs,
  globals: { viewport: { value: 'mobile', isRotated: false } },
} satisfies Meta<typeof PostCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const HighlightLight: Story = {
  args: { variant: 'highlight-light' },
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '380px' }}>
        <Story />
      </div>
    ),
  ],
};

export const HighlightDark: Story = {
  args: { variant: 'highlight-dark' },
  // Carte translucide : elle se pose sur le bleu de la marque (bloc des derniers tutoriels)
  decorators: [
    (Story) => (
      <div className="bg-brand p-6">
        <div className="mx-auto max-w-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

export const SideImage: Story = {
  args: { variant: 'side-image' },
  decorators: [
    (Story) => (
      <div style={{ margin: '0 auto', maxWidth: '764px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Tutorial: Story = {
  args: { contentType: 'tutorial', tutorialLabel: 'Tutoriel' },
};

export const Loading: Story = {
  args: { isLoading: true },
};
