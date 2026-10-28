import type { Meta, StoryFn } from '@storybook/react-vite';

import * as React from 'react';

import { Logo, logoName } from '@/components';

const meta: Meta<typeof Logo> = {
  component: Logo,
  argTypes: {
    name: {
      control: 'select',
      options: logoName,
    },
    size: {
      control: 'text',
    },
  },
  args: {
    name: 'blog',
    className: 'text-brand',
    size: '10em',
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

const Template: StoryFn<typeof Logo> = (args) => <Logo {...args} />;

export const LogoWebsite = Template.bind({});
LogoWebsite.args = {
  name: 'website',
};

export const LogoBlog = Template.bind({});
LogoBlog.args = {
  name: 'blog',
};
