import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { SummaryCard } from '@/components';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { LayoutContentWithSidebar } from './LayoutContentWithSidebar';

const meta: Meta<typeof LayoutContentWithSidebar> = {
  component: LayoutContentWithSidebar,
  args: {
    my: 'xl',
    content: <>Content</>,
    sidebar: (
      <SummaryCard
        title="Progression"
        sectionActive="initialisation-du-projet"
        sections={[
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
        ]}
      />
    ),
  },
  parameters: {
    layout: 'full',
  },
  decorators: [LayoutTemplateDecorator],
};

export default meta;
type Story = StoryObj<typeof LayoutContentWithSidebar>;

export const Overview: Story = {};
