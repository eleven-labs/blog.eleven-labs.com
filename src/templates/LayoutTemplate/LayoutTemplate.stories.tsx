import type { Meta, StoryFn } from '@storybook/react-vite';

import type { FooterProps } from '@/components/footer';
import type { HeaderProps } from '@/components/header';

import React from 'react';

import FooterStories from '@/components/footer/footer.stories';
import { Header } from '@/components/header';
import HeaderStories from '@/components/header/header.stories';

import { LayoutTemplate } from './LayoutTemplate';

const meta: Meta<typeof LayoutTemplate> = {
  title: 'Layouts/LayoutTemplate',
  component: LayoutTemplate,
  args: {
    header: React.createElement<HeaderProps>(Header, HeaderStories.args as HeaderProps),
    footer: FooterStories.args as FooterProps,
    children: <div className="flex flex-1 items-center justify-center p-8">Content</div>,
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
