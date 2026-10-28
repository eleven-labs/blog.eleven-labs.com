import type { Meta, StoryObj } from '@storybook/react-vite';

import { SummaryBar } from './summary-bar';

const sections = [
  { name: 'introduction', label: 'Introduction', href: '#introduction' },
  { name: 'installation', label: 'Installation du profiler', href: '#installation' },
  { name: 'configuration', label: 'Configuration des collecteurs', href: '#configuration' },
  { name: 'conclusion', label: 'Conclusion', href: '#conclusion' },
];

const meta = {
  title: 'Shared/SummaryBar',
  component: SummaryBar,
  args: {
    title: 'Sommaire',
    sections,
    sectionActive: 'installation',
  },
  parameters: { viewport: { defaultViewport: 'extraSmallScreen' } },
} satisfies Meta<typeof SummaryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: 'secondary', title: 'Tutoriel' } };
