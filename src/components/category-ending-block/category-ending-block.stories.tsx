import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from '@/design-system/ui/link';

import { CategoryEndingBlock } from './category-ending-block';

const meta = {
  title: 'Shared/CategoryEndingBlock',
  component: CategoryEndingBlock,
  args: {
    title: 'Quels types d’applications peuvent être développées en JavaScript ?',
    description: (
      <>
        Aujourd’hui, il est quasiment possible de tout faire avec le langage JavaScript : applications web et mobile,
        progressive web apps, logiciels, applications métier, site web fullstack JavaScript, API backend, jeux vidéo,
        applications TV et bien d’autres.
        <br />
        En bref, JavaScript est devenu le langage central du web et celui le plus utilisé sur GitHub depuis plusieurs
        années. Choisir JavaScript pour son projet de <Link href="#">développement web</Link> est donc, dans la majorité
        des cas, une bonne idée !<br />
        <br />
        Chez Eleven Labs, nous pouvons vous accompagner dans tous vos besoins en développement d’applications web ou
        mobile en JavaScript.
      </>
    ),
    expertiseLink: {
      label: 'Découvrir notre expertise en JavaScript',
      href: '#',
    },
  },
} satisfies Meta<typeof CategoryEndingBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutExpertiseLink: Story = { args: { expertiseLink: undefined } };
