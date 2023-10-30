import './TutorialSteps.scss';

import { AsProps, Box, Flex, FlexProps, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { TutoTag } from '@/components';

export type TutorialStepsOptions = {
  stepActive?: string;
  steps: ({ name: string; label: string } & AsProps<'a'>)[];
};
export type TutorialStepsProps = AsProps<'div'> & TutorialStepsOptions;

export const TutorialSteps: React.FC<TutorialStepsProps> = ({ stepActive, steps, className, ...props }) => (
  <Flex
    {...props}
    display="inline-flex"
    flexDirection="column"
    p="s"
    className={classNames('tutorial-steps', className)}
  >
    <TutoTag justifyContent="center" mx="s" className="tutorial-steps__tag" label="Progression" />
    {steps.map(({ name, label, ...stepLink }, index) => (
      <Box
        className={classNames('tutorial-steps__step', {
          'tutorial-steps__step--active': stepActive === name,
        })}
      >
        <Flex
          {...(stepActive !== name ? (stepLink as FlexProps) : {})}
          flexDirection="row"
          alignItems="center"
          gap={{ xs: 'xxs-2', md: '0' }}
        >
          <Box>
            <Flex alignItems="center" justifyContent="center" className="tutorial-steps__number">
              {index + 1}
            </Flex>
          </Box>
          <Text key={name} size="xs" ml="xs" className="tutorial-steps__text">
            {label}
          </Text>
        </Flex>
      </Box>
    ))}
  </Flex>
);
