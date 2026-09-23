import type { Meta, StoryFn } from '@storybook/react';

import type { FooterProps, HeaderProps } from '@/components';

import React from 'react';

import { Header } from '@/components';
import FooterStories from '@/components/Organisms/Footer/Footer.stories';
import HeaderStories from '@/components/Organisms/Header/Header.stories';

import { LayoutTemplate } from './LayoutTemplate';

const meta: Meta<typeof LayoutTemplate> = {
  component: LayoutTemplate,
  args: {
    header: React.createElement<HeaderProps>(Header, HeaderStories.args as HeaderProps),
    footer: FooterStories.args as FooterProps,
    children: (
      <div className="flex flex-1 items-center justify-center p-l">Content</div>
    ),
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
};

export default meta;

const Template: StoryFn<typeof LayoutTemplate> = (args) => <LayoutTemplate {...args} />;

export const Overview = Template.bind({});
