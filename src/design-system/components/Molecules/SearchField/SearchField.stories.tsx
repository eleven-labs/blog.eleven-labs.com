import type { Meta, StoryFn } from '@storybook/react';

import { action } from '@storybook/addon-actions';
import * as React from 'react';

import { SearchField } from '@/design-system';

const meta: Meta<typeof SearchField> = {
  component: SearchField,
  args: {
    input: {
      placeholder: 'Nom d’article, auteur ...',
    },
    buttonClose: {
      onClick: action('onClose'),
    },
    buttonSearch: {
      onClick: action('onSearch'),
    },
  },
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'ultra-light-grey',
    },
  },
};

export default meta;

const Template: StoryFn<typeof SearchField> = (args) => <SearchField {...args} />;

export const Overview = Template.bind({});

export const SearchFieldWithValue = Template.bind({});
SearchFieldWithValue.args = {
  input: {
    value: 'Design System',
  },
};
