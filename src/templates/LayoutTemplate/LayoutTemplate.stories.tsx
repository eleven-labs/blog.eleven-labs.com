import { Box, Text } from '@eleven-labs/design-system';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { AutocompleteFieldProps } from '@/components';
import * as AutocompleteFieldStories from '@/components/AutocompleteField/AutocompleteField.stories';
import { LayoutTemplate } from '@/templates/LayoutTemplate';

export default {
  title: 'Templates/LayoutTemplate',
  component: LayoutTemplate,
  args: {
    header: {
      homeLink: {
        href: '#',
      },
      autocomplete: AutocompleteFieldStories.default.args,
      onToggleSearch: action('toggleSearch'),
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

export const LayoutTemplateWithAutocompleteIsOpen = Template.bind({});
LayoutTemplateWithAutocompleteIsOpen.args = {
  header: {
    homeLink: {
      href: '#',
    },
    autocompleteIsDisplayed: true,
    autocomplete: AutocompleteFieldStories.AutocompleteFieldWithResult.args as AutocompleteFieldProps,
  },
};

export const LayoutTemplateWithAutocompleteAndResultNotFound = Template.bind({});
LayoutTemplateWithAutocompleteAndResultNotFound.args = {
  header: {
    homeLink: {
      href: '#',
    },
    autocompleteIsDisplayed: true,
    autocomplete: AutocompleteFieldStories.AutocompleteFieldWithNoResult.args as AutocompleteFieldProps,
  },
};
