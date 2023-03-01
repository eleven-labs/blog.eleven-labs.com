import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { NewsletterBlock } from './NewsletterBlock';

export default {
  title: 'Components/NewsletterBlock',
  component: NewsletterBlock,
  args: {
    title: 'En quête d’un outil de veille ?',
    description: 'Abonne-toi à notre newsletter',
    subscribeButton: {
      as: 'a',
      label: `Je m'abonne`,
      target: '_blank',
      href: 'https://eleven-labs.com/',
    },
  },
} as Meta<typeof NewsletterBlock>;

const Template: StoryFn<typeof NewsletterBlock> = (args) => <NewsletterBlock {...args} />;

export const Overview = Template.bind({});
