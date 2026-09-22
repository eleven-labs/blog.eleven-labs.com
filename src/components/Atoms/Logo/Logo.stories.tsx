import type { Meta, StoryFn } from '@storybook/react';

import * as React from 'react';

import { Logo, logoName } from '@/components';
import { marginSystemPropsControls } from '@/design-system/constants/storybook';

export default {
  component: Logo,
  argTypes: {
    ...marginSystemPropsControls,
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
    color: 'primary',
    size: '10em',
  },
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Logo>;

const Template: StoryFn<typeof Logo> = (args) => <Logo {...args} />;

export const LogoWebsite = Template.bind({});
LogoWebsite.args = {
  name: 'website',
};

export const LogoBlog = Template.bind({});
LogoBlog.args = {
  name: 'blog',
};
