import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { NotFoundPage } from './NotFoundPage';

export default {
  title: 'Pages/NotFound',
  component: NotFoundPage,
  args: {
    backLink: {
      label: 'Retour',
      href: '/',
    },
    title: 'Page non trouvé',
    description: `Nous nous excusons pour le désagrément, mais la page que vous avez demandée n'a pas été trouvée.`,
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof NotFoundPage>;

const Template: StoryFn<typeof NotFoundPage> = (args) => <NotFoundPage {...args} />;

export const Overview = Template.bind({});
