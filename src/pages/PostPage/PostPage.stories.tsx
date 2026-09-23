import type { PostPageProps } from './PostPage';
import type { Meta, StoryObj } from '@storybook/react';

import React from 'react';

import ContactCardStories from '@/components/Molecules/Cards/ContactCard/ContactCard.stories';
import * as SummaryCardStories from '@/components/Molecules/Cards/SummaryCard/SummaryCard.stories';
import BreadcrumbStories from '@/design-system/components/Atoms/Breadcrumb/Breadcrumb.stories';
import PostFooterStories from '@/pages/PostPage/PostFooter/PostFooter.stories';
import PostHeaderStories from '@/pages/PostPage/PostHeader/PostHeader.stories';
import RelatedPostListStories from '@/pages/PostPage/RelatedPostList/RelatedPostList.stories';
import { LayoutTemplateDecorator } from '@/storybook/decorators';

import { PostPage } from './PostPage';

const meta: Meta<typeof PostPage> = {
  component: PostPage,
  args: {
    variant: 'article',
    breadcrumb: BreadcrumbStories.args as PostPageProps['breadcrumb'],
    cover: {
      img: {
        src: 'https://i.ibb.co/gPtFC17/pexels-matheus-bertelli-1830252.jpg',
        alt: 'cover',
      },
    },
    header: PostHeaderStories.args as PostPageProps['header'],
    children: (
      <>
        <h2>Heading 1</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt erat sit amet justo maximus, gravida
          ultricies lorem vestibulum. Nullam scelerisque erat non est blandit, a tincidunt enim laoreet.
        </p>
        <p>
          Vivamus gravida feugiat lorem, quis pharetra tellus dignissim vel. Fusce dapibus sodales efficitur. Curabitur
          nec semper dolor. Integer dignissim leo magna, sit amet mollis arcu auctor id. Fusce sapien dolor, porta a
          dictum eget, posuere et arcu. Nam mattis facilisis est id dignissim
        </p>
        <h3>Sub-heading 1.1</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt erat sit amet justo maximus, gravida
          ultricies lorem vestibulum. Nullam scelerisque erat non est blandit, a tincidunt enim laoreet.
        </p>
        <h4>Sub-heading 1.1.1</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt erat sit amet justo maximus, gravida
          ultricies lorem vestibulum. Nullam scelerisque erat non est blandit, a tincidunt enim laoreet.
        </p>
        <h5>Sub-heading 1.1.1.1</h5>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt erat sit amet justo maximus, gravida
          ultricies lorem vestibulum. Nullam scelerisque erat non est blandit, a tincidunt enim laoreet.
        </p>
        <p>
          I just love <strong>bold text</strong>.
        </p>
        <p>
          Italicized text is the <em>cat's meow</em>.
        </p>
        <p>
          <code>Use `code` in your Markdown file.</code>
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt erat sit amet justo maximus, gravida
          ultricies lorem vestibulum. Nullam scelerisque erat non est blandit, a tincidunt enim laoreet.
        </p>
        <blockquote>Dorothy followed her through many of the beautiful rooms in her castle.</blockquote>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt erat sit amet justo maximus, gravida
          ultricies lorem vestibulum. Nullam scelerisque erat non est blandit, a tincidunt enim laoreet.
        </p>
        <ol>
          <li>First item</li>
          <li>Second item</li>
          <li>
            Third item
            <ol>
              <li>Indented item</li>
              <li>Indented item</li>
            </ol>
          </li>
          <li>Fourth item</li>
        </ol>
        <ul>
          <li>First item</li>
          <li>Second item</li>
          <li>
            Third item
            <ul>
              <li>Indented item</li>
              <li>Indented item</li>
            </ul>
          </li>
          <li>Fourth item</li>
        </ul>
        <table>
          <thead>
            <tr>
              <th>Syntax</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Header</td>
              <td>Title</td>
            </tr>
            <tr>
              <td>Paragraph</td>
              <td>Text</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
    footer: PostFooterStories.args as PostPageProps['footer'],
    contactCard: ContactCardStories.args as PostPageProps['contactCard'],
    relatedPostList: RelatedPostListStories.args as PostPageProps['relatedPostList'],
    summary: {
      title: SummaryCardStories.default.args?.title,
      sections: SummaryCardStories.default.args?.sections,
    } as PostPageProps['summary'],
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
type Story = StoryObj<typeof PostPage>;

export const Overview: Story = {};

export const WithVariantTutorial: Story = {};
WithVariantTutorial.args = {
  variant: 'tutorial',
  summary: {
    title: SummaryCardStories.WithVariantSecondary.args?.title,
    sections: SummaryCardStories.WithVariantSecondary.args?.sections,
    sectionActive: SummaryCardStories.WithVariantSecondary.args?.sectionActive,
  } as PostPageProps['summary'],
  previousLink: {
    label: 'Précédent',
  },
  nextLink: {
    label: 'Suivant',
  },
};
