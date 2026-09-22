import type { Meta, StoryObj } from '@storybook/react';

import { SummaryCard } from './SummaryCard';

const meta: Meta<typeof SummaryCard> = {
  component: SummaryCard,
  args: {
    title: 'Sommaire',
    sections: [
      {
        name: 'introduction',
        label: 'Introduction',
        href: '#',
      },
      {
        name: 'a-la-decouverte-de-l-espace',
        label: 'À la découverte de l’espace',
        href: '#',
      },
      {
        name: 'conclusion',
        label: 'Conclusion',
        href: '#',
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof SummaryCard>;

export const Overview: Story = {};

export const WithVariantSecondary: Story = {};
WithVariantSecondary.args = {
  variant: 'secondary',
  title: 'Progression',
  sectionActive: 'initialisation-du-projet',
  sections: [
    {
      name: 'introduction',
      label: 'Introduction',
      href: '#',
    },
    {
      name: 'initialisation-du-projet',
      label: 'Initialisation du projet',
      href: '#',
    },
    {
      name: 'vue-et-logique-de-base',
      label: 'Vues et logique de base',
      href: '#',
    },
    {
      name: 'envoi-de-message',
      label: 'Envoi de message',
      href: '#',
    },
    {
      name: 'configuration-de-mercure',
      label: 'Configuration de Mercure',
      href: '#',
    },
    {
      name: 'discovery-abonnement',
      label: 'Discovery, abonnement...',
      href: '#',
    },
    {
      name: 'conclusion',
      label: 'Conclusion',
      href: '#',
    },
  ],
};
