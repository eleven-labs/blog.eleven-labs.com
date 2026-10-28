import type { Decorator } from '@storybook/react-vite';
import type { LayoutTemplateProps } from '@/templates/LayoutTemplate';

import { LayoutTemplate } from '@/templates/LayoutTemplate';
import LayoutTemplateStories from '@/templates/LayoutTemplate/LayoutTemplate.stories';

export const LayoutTemplateDecorator: Decorator = (Story) => (
  <LayoutTemplate {...(LayoutTemplateStories.args as LayoutTemplateProps)}>
    <Story />
  </LayoutTemplate>
);
