import { Box, Text } from '@eleven-labs/design-system';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { LayoutTemplate } from '@/templates/LayoutTemplate';

export default {
  title: 'Templates/LayoutTemplate',
  component: LayoutTemplate,
  args: {
    header: {
      homeLink: {
        href: '#',
      },
    },
    footer: {
      introBlock: {
        title: 'Découvrez Eleven Labs',
        description: 'Notre site pour mieux nous connaître',
      },
      elevenLabsSiteLink: {
        // eslint-disable-next-line prettier/prettier
        label: `J'y vais`
      },
      contact: {
        title: 'Contact',
        list: [
          {
            title: 'Eleven Labs - Paris',
            description: (
              <>
                15 avenue de la grande armée
                <br />
                75116{' '}
                <Text as="span" textTransform="uppercase">
                  Paris
                </Text>
              </>
            ),
          },
          {
            title: 'Eleven Labs - Nantes',
            description: (
              <>
                24 mail des chantiers
                <br />
                844200{' '}
                <Text as="span" textTransform="uppercase">
                  Nantes
                </Text>
              </>
            ),
          },
          {
            title: 'business@eleven-labs.com',
            description: '0182831175',
          },
        ],
      },
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
      <Box textAlign="center" p="l" flex="1">
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
