import { Meta, StoryFn } from '@storybook/react';
import { LayoutTemplateDecorator } from '@storybook-decorators';
import React from 'react';

import TutorialStepsStories from '@/components/TutorialSteps/TutorialSteps.stories';
import { ContentTypeEnum } from '@/constants';
import PostPageStories from '@/pages/PostPage/PostPage.stories';

import { TutorialPage } from './TutorialPage';

export default {
  title: 'Pages/Tutorial',
  component: TutorialPage,
  args: {
    ...PostPageStories.args,
    contentType: ContentTypeEnum.TUTORIAL,
    steps: TutorialStepsStories.args?.steps,
    stepActive: TutorialStepsStories.args?.stepActive,
    previousLink: {
      label: 'Précédent',
    },
    nextLink: {
      label: 'Suivant',
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
  },
  parameters: {
    layout: 'full',
    viewport: {
      defaultViewport: 'extraSmallScreen',
    },
  },
  decorators: [LayoutTemplateDecorator],
} as Meta<typeof TutorialPage>;

const Template: StoryFn<typeof TutorialPage> = (args) => <TutorialPage {...args} />;

export const Overview = Template.bind({});
