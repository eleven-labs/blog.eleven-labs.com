import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { TutorialSteps } from './TutorialSteps';

export default {
  title: 'Components/TutorialSteps',
  component: TutorialSteps,
  args: {
    stepActive: 'vue-et-logique-de-base',
    steps: [
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
} as Meta<typeof TutorialSteps>;

const Template: StoryFn<typeof TutorialSteps> = (args) => <TutorialSteps {...args} />;

export const Overview = Template.bind({});
