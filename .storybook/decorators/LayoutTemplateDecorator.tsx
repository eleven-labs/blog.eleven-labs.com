import React  from 'react';
import { DecoratorFunction } from '@storybook/types';
import { ReactRenderer } from '@storybook/react';

import { LayoutTemplate, LayoutTemplateProps } from '@/templates/LayoutTemplate';
import LayoutTemplateStories from '@/templates/LayoutTemplate/LayoutTemplate.stories';

export const LayoutTemplateDecorator: DecoratorFunction<ReactRenderer> = (Story): JSX.Element => (
    <LayoutTemplate {...LayoutTemplateStories.args as LayoutTemplateProps}>
        <Story />
    </LayoutTemplate>
);
