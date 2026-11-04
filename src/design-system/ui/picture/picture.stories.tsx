import type { Meta, StoryObj } from '@storybook/react-vite';

import { Picture } from './picture';

// Illustration SVG embarquée : l'histoire ne dépend d'aucun réseau.
const illustration = (color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="${color}"/></svg>`
  )}`;

const meta = {
  title: 'UI/Display/Picture',
  component: Picture,
  args: {
    img: {
      src: illustration('#0a4084'),
      alt: 'Illustration de l’article : migration d’un design system vers Base UI',
      width: 640,
      height: 360,
    },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Picture>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Une source plus étroite pour les petits écrans, l’image par défaut sinon. */
export const WithSources: Story = {
  args: {
    sources: [{ media: '(max-width: 570px)', srcSet: illustration('#dd3156') }],
  },
};

export const HighPriority: Story = {
  args: {
    img: {
      src: illustration('#0a4084'),
      alt: 'Image de couverture de l’article, chargée en priorité',
      width: 640,
      height: 360,
      fetchPriority: 'high',
    },
  },
};
