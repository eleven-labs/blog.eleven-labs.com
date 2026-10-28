import type { HomePageProps } from './HomePage';
import type { Meta, StoryObj } from '@storybook/react-vite';

import type { CategoryPageProps } from '@/pages/CategoryPage';

import HomeIntroBlockStories from '@/components/home-intro-block/home-intro-block.stories';
import LastArticlesBlockStories from '@/components/last-articles-block/last-articles-block.stories';
import LastTutorialsBlockStories from '@/components/last-tutorials-block/last-tutorials-block.stories';
import NewsletterCardStories from '@/components/newsletter-card/newsletter-card.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { HomePage } from './HomePage';

const meta: Meta<typeof HomePage> = {
  title: 'Pages/Home',
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
