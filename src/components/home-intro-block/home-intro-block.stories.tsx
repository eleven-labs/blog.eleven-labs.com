import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from '@/design-system/ui/link';

import { HomeIntroBlock } from './home-intro-block';

const meta = {
  title: 'Shared/HomeIntroBlock',
  component: HomeIntroBlock,
  args: {
    intro: 'Explorons de nouveaux savoirs',
    title: (
      <>
        Le blog des astronautes
        <br />
        d’Eleven Labs sur les
        <br />
        nouvelles technologies
      </>
    ),
    description: (
      <>
        Dans ce blog, retrouvez les retours d’expérience, conseils et convictions de nos collaborateurs autour des
        dernières tendances technologiques en <Link href="#">développement web et mobile</Link>,{' '}
        <Link href="#">agilité</Link>, <Link href="#">JavaScript</Link> et <Link href="#">PHP Symfony</Link>. Découvrez
        également nos tutoriels pour apprendre pas à pas à créer différentes features !
      </>
    ),
    elevenLabsLink: {
      label: 'En savoir plus sur Eleven Labs',
      href: '#',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HomeIntroBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
