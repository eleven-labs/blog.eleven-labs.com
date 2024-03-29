import { Box, Button, Text } from '@eleven-labs/design-system';
import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import * as AutocompleteFieldStories from '@/components/AutocompleteField/AutocompleteField.stories';
import { Header, HeaderProps, LayoutTemplate } from '@/templates/LayoutTemplate';

export default {
  title: 'Templates/LayoutTemplate',
  component: LayoutTemplate,
  args: {
    header: React.createElement<HeaderProps>(Header, {
      homeLink: {
        href: '#',
      },
      autocomplete: AutocompleteFieldStories.default.args as HeaderProps['autocomplete'],
      onToggleSearch: action('toggleSearch'),
    }),
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
            description: (
              <Button as="a" href="https://eleven-labs.com/contact/">
                Contact
              </Button>
            ),
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
  header: React.createElement<HeaderProps>(Header, {
    homeLink: {
      href: '#',
    },
    autocompleteIsDisplayed: true,
    autocomplete: {
      ...AutocompleteFieldStories.default.args,
      ...AutocompleteFieldStories.AutocompleteFieldWithResult.args,
    } as HeaderProps['autocomplete'],
  }),
};

export const LayoutTemplateWithAutocompleteAndResultNotFound = Template.bind({});
LayoutTemplateWithAutocompleteAndResultNotFound.args = {
  header: React.createElement<HeaderProps>(Header, {
    homeLink: {
      href: '#',
    },
    autocompleteIsDisplayed: true,
    autocomplete: {
      ...AutocompleteFieldStories.default.args,
      ...AutocompleteFieldStories.AutocompleteFieldWithResult.args,
    } as HeaderProps['autocomplete'],
  }),
};
