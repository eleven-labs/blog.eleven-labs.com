import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { AutocompleteField } from '@/components';

export default {
  title: 'Components/AutocompleteField',
  component: AutocompleteField,
  args: {
    placeholder: 'Rechercher par nom d’article ou d’auteur',
    searchLink: {
      label: 'Voir tous les résultats',
      onClick: action('search'),
    },
  },
  parameters: {
    backgrounds: {
      default: 'ultra-light-grey',
    },
  },
} as Meta<typeof AutocompleteField>;

const Template: StoryFn<typeof AutocompleteField> = (args) => <AutocompleteField {...args} />;

export const Overview = Template.bind({});

export const AutocompleteFieldWithResult = Template.bind({});
AutocompleteFieldWithResult.args = {
  defaultValue: 'React',
  items: [
    {
      title: 'React SSR',
      description: 'Lorem ipsum dolor sit react, consectetur adipiscing elit. In nec blandit neque',
    },
    {
      title: 'React SSG',
      description: 'Mauris semper venenatis dolor vel posuere. Fusce imperdiet react purus euismod fermentum',
    },
    {
      title: 'React + Astro',
      description: 'Ut velit elit, finibus eu turpis quis, luctus sodales elit',
    },
    {
      title: 'React + NextJS',
      description: 'Quisque ac consectetur massa. Praesent pellentesque, orci sit amet cursus venenatis',
    },
    {
      title: 'React + Apollo Client',
      description: 'Phasellus ac sodales mi. Ut egestas dui react enim vehicula pulvinar',
    },
    {
      title: 'React vs Vue',
      description:
        'Suspendisse potenti. Etiam egestas lacus velit, et tempor metus mollis react. Donec ut vulputate leo',
    },
  ],
};

export const AutocompleteFieldWithNoResult = Template.bind({});
AutocompleteFieldWithNoResult.args = {
  defaultValue: 'React',
  items: [],
  searchNotFound: {
    title: 'Aucun résultat en vue...',
    description: 'Vérifiez les termes de votre recherche avant de réessayer',
  },
};
