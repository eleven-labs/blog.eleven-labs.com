import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { SummaryBlock } from './SummaryBlock';

const meta: Meta<typeof SummaryBlock> = {
  title: 'Components/Blocks/SummaryBlock',
  component: SummaryBlock,
  args: {
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
type Story = StoryObj<typeof SummaryBlock>;

export const Overview: Story = {};
