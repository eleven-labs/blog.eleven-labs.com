import type { Meta, StoryObj } from '@storybook/react-vite';

import { textSizeList } from '@/design-system/types';
import { Text } from '@/design-system/ui/text';

const meta = {
  title: 'UI/Display/Text',
  component: Text,
  argTypes: {
    size: { control: 'radio', options: textSizeList },
  },
  args: {
    size: 'm',
    children: 'Découvrez comment mettre en place une intégration continue fiable en quelques étapes.',
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExtraSmall: Story = { args: { size: 'xs' } };

export const Small: Story = { args: { size: 's' } };

export const Default: Story = {};
