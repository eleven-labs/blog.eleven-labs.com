import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import NewsletterBlockStories from '@/components/NewsletterBlock/NewsletterBlock.stories';
import { PostPage } from '@/pages/PostPage/PostPage';

export default {
  title: 'Pages/Post',
  component: PostPage,
  args: {
    backLink: {
      label: 'Retour',
      href: '/',
    },
    header: {
      title: 'Refonte du blog',
      date: '08 fév. 2021',
      readingTime: '24mn',
      authors: [
        {
          name: 'J. Doe',
          link: {
            href: '/fr/authors/jdoe',
          },
        },
        {
          name: 'J. Dupont',
          link: {
            href: '/fr/authors/jdupont',
          },
        },
      ],
    },
    content: `
              <h1>Heading level 1</h1>
              <h2>Heading level 2</h2>
              <h3>Heading level 3</h3>
              <h4>Heading level 4</h4>
              <h5>Heading level 5</h5>
              <h6>Heading level 6</h6>
              <br />
              <p>I really like using Markdown.</p>
              <p>This is the first line.<br>And this is the second line.</p>
              <p>I just love <strong>bold text</strong>.</p>
              <p>Italicized text is the <em>cat's meow</em>.</p>
              <blockquote>
                <p>Dorothy followed her through many of the beautiful rooms in her castle.</p>
              </blockquote>
              <ul>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
                <li>Fourth item</li>
              </ul>
              <ol>
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
                <li>Fourth item</li>
              </ol>
              <img src="https://eleven-labs.com/static/images/planets/astro-donut.png" alt="astro donut" />
              <a href="https://blog.eleven-labs.com/">Blog Eleven Labs</a>
              <pre>
                <code class="language-typescript">const hello = (name: string = 'world') => \`hello \${name} !\`;</code>
              </pre>
              <div class="admonition note">
                <p class="admonition-title">Title</p>
                Lorem ipsum
              </div>
        `,
    footer: {
      title: 'écrit par',
      authors: [
        {
          name: 'John Doe',
          avatarImageUrl: 'https://api.dicebear.com/5.x/avataaars/svg?seed=Felix',
          description: 'Astronaute John Doe @ ElevenLabs_\uD83D\uDE80',
          link: {
            href: '/fr/authors/jdoe',
          },
        },
        {
          name: 'Jeane Dupont',
          avatarImageUrl: 'https://api.dicebear.com/5.x/avataaars/svg?seed=Lola',
          description: 'Astronaute Jeane Dupont @ ElevenLabs_\uD83D\uDE80',
          link: {
            href: '/fr/authors/jdupont',
          },
        },
      ],
    },
    newsletterBlock: NewsletterBlockStories.args,
    relatedPostList: {
      relatedPostListTitle: 'Articles sur le même thème',
      posts: Array.from({ length: 3 }).map((_, index) => ({
        slug: `titre-article-${index}`,
        title: `Titre de l'article ${index}`,
        date: '09 fév. 2021',
        readingTime: '24mn',
        authors: ['J. Doe'],
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
