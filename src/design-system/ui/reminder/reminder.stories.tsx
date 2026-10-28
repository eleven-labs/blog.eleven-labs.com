import type { Meta, StoryObj } from '@storybook/react-vite';

import { Reminder, reminderVariantList } from './reminder';

const meta = {
  title: 'UI/Display/Reminder',
  component: Reminder,
  args: {
    variant: 'note',
    title: 'Note',
    children: 'Les tokens sont définis dans un seul fichier, jamais dans les composants.',
  },
  argTypes: { variant: { control: 'select', options: reminderVariantList } },
} satisfies Meta<typeof Reminder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Note: Story = {};

export const Tip: Story = {
  args: {
    variant: 'tip',
    title: 'Astuce',
    children: 'Lancez Storybook en local pour vérifier vos composants.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Attention',
    children: 'Cette API sera supprimée dans la prochaine version majeure.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: 'Danger',
    children: 'Ne commitez jamais de secrets dans le dépôt.',
  },
};

/** Les douze variantes du markdown. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {reminderVariantList.map((variant) => (
        <Reminder key={variant} variant={variant} title={variant}>
          Un encart de type « {variant} » dans un article.
        </Reminder>
      ))}
    </div>
  ),
};
