import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Reminder, reminderVariantList } from './Reminder';

export default {
  title: 'Components/Reminder',
  component: Reminder,
  args: {
    variant: 'note',
    title: 'Title',
    children: 'Lorem ipsum',
  },
} as Meta<typeof Reminder>;

const Template: StoryFn<typeof Reminder> = (args) => <Reminder {...args} />;

export const Overview = Template.bind({});

export const All: StoryFn<typeof Text> = () => (
  <>
    {reminderVariantList.map((variant) => (
      <Reminder key={variant} variant={variant} title={variant} mb="m">
        Lorem ipsum
      </Reminder>
    ))}
  </>
);
