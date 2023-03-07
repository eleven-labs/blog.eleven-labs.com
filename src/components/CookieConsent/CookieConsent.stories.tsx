import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { CookieConsent } from './CookieConsent';

export default {
  title: 'Components/CookieConsent',
  component: CookieConsent,
  args: {
    title: 'Ce site web utilise des cookies de Google Analytics',
    description: `Ces cookies nous aident à identifier le contenu qui vous intéresse le plus ainsi qu'à repérer certains dysfonctionnements. Vos données de navigations sont envoyées à Google Inc.`,
    declineButton: {
      label: `S'opposer`,
    },
    acceptButton: {
      label: 'Accepter',
    },
  },
} as Meta<typeof CookieConsent>;

const Template: StoryFn<typeof CookieConsent> = (args) => <CookieConsent {...args} />;

export const Overview = Template.bind({});
