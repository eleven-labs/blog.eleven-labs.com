import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import { BackLink, BackLinkProps } from '@/components';
import BackLinkStories from '@/components/BackLink/BackLink.stories';
import NewsletterBlockStories from '@/components/NewsletterBlock/NewsletterBlock.stories';
import { PostPage } from '@/pages/PostPage/PostPage';
import { ContentTypeEnum } from '@/constants';

export default {
  title: 'Pages/Post',
  component: PostPage,
  args: {
    contentType: ContentTypeEnum.ARTICLE,
    backLink: React.createElement<BackLinkProps>(BackLink, BackLinkStories.args as BackLinkProps),
    header: {
      title: 'Refonte du blog',
      date: '08 fév. 2021',
      readingTime: 24,
      authors: [
        {
          username: 'jdoe',
          name: 'J. Doe',
          link: {
            href: '/fr/authors/jdoe',
          },
        },
        {
          username: 'jdupont',
          name: 'J. Dupont',
          link: {
            href: '/fr/authors/jdupont',
          },
        },
      ],
    },
    children: 'content',
    footer: {
      title: 'écrit par',
      authors: [
        {
          name: 'John Doe',
          content: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
          link: {
            href: '/fr/authors/jdoe',
          },
        },
        {
          name: 'Jeane Dupont',
          content: 'Astronaute Jeane Dupont @ ElevenLabs_\uD83D\uDE80',
          link: {
            href: '/fr/authors/jdupont',
          },
        },
      ],
      emptyAvatarImageUrl: '/imgs/astronaut.png',
    },
    newsletterBlock: NewsletterBlockStories.args,
    relatedPostList: {
      relatedPostListTitle: 'Articles sur le même thème',
      posts: Array.from({ length: 3 }).map((_, index) => ({
        slug: `titre-article-${index}`,
        title: `Titre de l'article ${index}`,
        date: '09 fév. 2021',
        readingTime: 24,
        authors: [{ username: 'jdoe', name: 'J. Doe' }],
        excerpt:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed hendrerit vel tellus in molestie. Curabitur malesuada sodales consectetur. Aliquam convallis nec lacus in euismod. Vestibulum id eros vitae tellus sodales ultricies eget eu ipsum.',
      })),
    },
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof PostPage>;

const Template: StoryFn<typeof PostPage> = (args) => <PostPage {...args} />;

export const Overview = Template.bind({});

export const PostPageWithTutorialContentType = Template.bind({});
PostPageWithTutorialContentType.args = {
  contentType: ContentTypeEnum.TUTORIAL,
};
