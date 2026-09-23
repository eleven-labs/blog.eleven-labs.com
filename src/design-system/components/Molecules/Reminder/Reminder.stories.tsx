import type { Meta, StoryFn } from '@storybook/react';

import React from 'react';

import { Reminder, reminderVariantList } from './Reminder';

const meta: Meta<typeof Reminder> = {
  component: Reminder,
  args: {
    variant: 'note',
    title: 'Title',
    children: 'Lorem ipsum',
  },
};

export default meta;

const Template: StoryFn<typeof Reminder> = (args) => <Reminder {...args} />;

export const Overview = Template.bind({});

export const All: StoryFn<typeof Reminder> = () => (
  <>
    {reminderVariantList.map((variant) => (
      <Reminder key={variant} variant={variant} title={variant} className="mb-m">
        Lorem ipsum
      </Reminder>
    ))}
  </>
);
