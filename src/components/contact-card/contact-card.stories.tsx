import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from '@/design-system/ui/text';

import { ContactCard } from './contact-card';

const meta = {
  title: 'Shared/ContactCard',
  component: ContactCard,
  args: {
    title: (
      <>
        Vous souhaitez en savoir plus sur le sujet ?<br />
        <Text render={<span />} className="font-bold">
          Organisons un échange !
        </Text>
      </>
    ),
    description: "Notre équipe d'experts répond à toutes vos questions.",
    link: {
      label: 'Nous contacter',
      href: '#',
    },
  },
} satisfies Meta<typeof ContactCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
