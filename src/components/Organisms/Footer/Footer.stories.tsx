import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import { Text } from '@/design-system';

import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  component: Footer,
  args: {
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
    addressList: [
      {
        name: 'Eleven Labs - Paris',
        address: ['102, rue du Faubourg Saint Honoré', '75008 Paris'],
      },
      {
        name: 'Eleven Labs - Nantes',
        address: [`40, rue la Tour d'Auvergne`, '44200 Nantes'],
      },
      {
        name: 'Eleven Labs - Montréal',
        address: ['1155, Metcalfe St Suite 1500', 'Montréal, QC H3B 2V6, Canada'],
      },
    ].map(({ name, address }) => ({
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
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Overview: Story = {};
