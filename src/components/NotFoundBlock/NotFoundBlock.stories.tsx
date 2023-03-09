import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { NotFoundBlock } from './NotFoundBlock';

export default {
  title: 'Components/NotFoundBlock',
  component: NotFoundBlock,
  args: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
} as Meta<typeof NotFoundBlock>;

const Template: StoryFn<typeof NotFoundBlock> = (args) => <NotFoundBlock {...args} />;

export const Overview = Template.bind({});
