import type { Meta, StoryObj } from '@storybook/react-vite';

import { SummaryCard } from './summary-card';

const meta = {
  title: 'Shared/SummaryCard',
  component: SummaryCard,
  args: {
    title: 'Sommaire',
    sections: [
      { name: 'introduction', label: 'Introduction', href: '#introduction' },
      {
        name: 'a-la-decouverte-de-l-espace',
        label: 'À la découverte de l’espace',
        href: '#a-la-decouverte-de-l-espace',
      },
      { name: 'conclusion', label: 'Conclusion', href: '#conclusion' },
    ],
  },
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const WithActiveSection: Story = {
  args: { sectionActive: 'a-la-decouverte-de-l-espace' },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    title: 'Progression',
    sectionActive: 'initialisation-du-projet',
    sections: [
      { name: 'introduction', label: 'Introduction', href: '#introduction' },
      { name: 'initialisation-du-projet', label: 'Initialisation du projet', href: '#initialisation-du-projet' },
      { name: 'vue-et-logique-de-base', label: 'Vues et logique de base', href: '#vue-et-logique-de-base' },
      { name: 'envoi-de-message', label: 'Envoi de message', href: '#envoi-de-message' },
      { name: 'configuration-de-mercure', label: 'Configuration de Mercure', href: '#configuration-de-mercure' },
      { name: 'conclusion', label: 'Conclusion', href: '#conclusion' },
    ],
  },
};

export const WithoutTitle: Story = {
  args: { withTitle: false },
};
