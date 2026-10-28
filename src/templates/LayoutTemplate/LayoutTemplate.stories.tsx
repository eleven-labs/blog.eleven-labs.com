import type { Meta, StoryFn } from '@storybook/react-vite';

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
    children: <div className="flex flex-1 items-center justify-center p-8">Content</div>,
  },
  parameters: {
    // Accessibilité signalée sans bloquer jusqu'au lot de migration de ce bloc
    a11y: { test: 'todo' },
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
};

export default meta;

const Template: StoryFn<typeof LayoutTemplate> = (args) => <LayoutTemplate {...args} />;

export const Overview = Template.bind({});
