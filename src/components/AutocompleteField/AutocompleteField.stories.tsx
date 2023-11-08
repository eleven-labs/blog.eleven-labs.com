import { action } from '@storybook/addon-actions';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { AutocompleteField } from '@/components';
import { ContentTypeEnum } from '@/constants';

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
      contentType: ContentTypeEnum.ARTICLE,
      slug: 'react-ssr',
      title: 'React SSR',
      description: 'Lorem ipsum dolor sit react, consectetur adipiscing elit. In nec blandit neque',
      date: '24 fév. 2021',
      readingTime: 24,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
    },
    {
      contentType: ContentTypeEnum.ARTICLE,
      slug: 'react-ssg',
      title: 'React SSG',
      description: 'Mauris semper venenatis dolor vel posuere. Fusce imperdiet react purus euismod fermentum',
      date: '22 fév. 2021',
      readingTime: 22,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
    },
    {
      contentType: ContentTypeEnum.TUTORIAL,
      slug: 'react-astro',
      title: 'React + Astro',
      description: 'Ut velit elit, finibus eu turpis quis, luctus sodales elit',
      date: '18 fév. 2021',
      readingTime: 18,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
    },
    {
      contentType: ContentTypeEnum.ARTICLE,
      slug: 'react-nextjs',
      title: 'React + NextJS',
      description: 'Quisque ac consectetur massa. Praesent pellentesque, orci sit amet cursus venenatis',
      date: '16 fév. 2021',
      readingTime: 9,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
    },
    {
      contentType: ContentTypeEnum.ARTICLE,
      slug: 'react-apollo-client',
      title: 'React + Apollo Client',
      description: 'Phasellus ac sodales mi. Ut egestas dui react enim vehicula pulvinar',
      date: '12 fév. 2021',
      readingTime: 10,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
    },
    {
      contentType: ContentTypeEnum.ARTICLE,
      slug: 'react-vs-vue',
      title: 'React vs Vue',
      description:
        'Suspendisse potenti. Etiam egestas lacus velit, et tempor metus mollis react. Donec ut vulputate leo',
      date: '09 fév. 2021',
      readingTime: 6,
      authors: [{ username: 'jdoe', name: 'J. Doe' }],
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
