import type { HomePageProps } from './HomePage';
import type { Meta, StoryObj } from '@storybook/react';

import type { CategoryPageProps } from '@/pages/CategoryPage';

import HomeIntroBlockStories from '@/components/Molecules/Blocks/HomeIntroBlock/HomeIntroBlock.stories';
import NewsletterCardStories from '@/components/Molecules/Cards/NewsletterCard/NewsletterCard.stories';
import LastArticlesBlockStories from '@/components/Organisms/Blocks/LastArticlesBlock/LastArticlesBlock.stories';
import LastTutorialsBlockStories from '@/components/Organisms/Blocks/LastTutorialsBlock/LastTutorialsBlock.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { HomePage } from './HomePage';

const meta: Meta<typeof HomePage> = {
  component: HomePage,
  args: {
    homeIntroBlock: HomeIntroBlockStories.args as HomePageProps['homeIntroBlock'],
    lastArticlesBlock: LastArticlesBlockStories.args as HomePageProps['lastArticlesBlock'],
    lastTutorialsBlock: LastTutorialsBlockStories.args as HomePageProps['lastTutorialsBlock'],
    newsletterCard: NewsletterCardStories.args as CategoryPageProps['newsletterCard'],
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
};

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Overview: Story = {};
