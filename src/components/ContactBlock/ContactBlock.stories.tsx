import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { ContactBlock } from './ContactBlock';

const meta: Meta<typeof ContactBlock> = {
  title: 'Components/ContactBlock',
  component: ContactBlock,
  args: {
    title: 'Vous avez un projet ?',
    subtitle: 'Contactez nous !',
    description: `Vous souhaitez en savoir plus sur le sujet ? Organisons un échange !<br />Notre équipe d'experts répond à toutes vos questions.`,
    link: {
      label: 'Nous contacter',
      href: '#',
    },
  },
  decorators: [
    (Story): React.ReactElement => (
      <div style={{ width: '764px', height: '238px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ContactBlock>;

export const Overview: Story = {};
