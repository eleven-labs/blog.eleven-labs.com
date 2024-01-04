import { Box, Text } from '@eleven-labs/design-system';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { contact } from '@/config/website';
import { Header, HeaderProps, LayoutTemplate } from '@/templates/LayoutTemplate';

import * as HeaderStories from './Header/Header.stories';

export default {
  title: 'Templates/LayoutTemplate',
  component: LayoutTemplate,
  args: {
    header: React.createElement<HeaderProps>(Header, HeaderStories.default.args as HeaderProps),
    footer: {
      introBlock: {
        title: 'Découvrez l’agence Eleven Labs !',
        description: `L'ESN qui fait décoller vos projets web, mobile & data.`,
      },
      elevenLabsSiteLink: {
        href: '#',
      },
      contactLink: {
        label: 'Contact',
        href: '#',
      },
      addressList: contact.addressList.map(({ name, address }) => ({
        title: name,
        description: (
          <>
            {address.map((line, index) => (
              <Text key={index}>{line}</Text>
            ))}
          </>
        ),
      })),
      socialLinks: [
        {
          iconName: 'rss',
        },
        {
          iconName: 'facebook',
        },
        {
          iconName: 'twitter',
        },
        {
          iconName: 'linkedin',
        },
        {
          iconName: 'welcometothejungle',
        },
      ],
      languageLinks: [
        {
          isActive: true,
          label: 'Français',
        },
        {
          label: 'English',
        },
      ],
    },
    children: (
      <Box textAlign="center" p="l" flex="1" style={{ minHeight: '250px' }}>
        Content
      </Box>
    ),
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
} as Meta<typeof LayoutTemplate>;

const Template: StoryFn<typeof LayoutTemplate> = (args) => <LayoutTemplate {...args} />;

export const Overview = Template.bind({});
