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

export type TutorialStepContentProps = {
  stepActive?: string;
  name: string;
  label: string;
  stepLink: {
    href?: string;
  };
};

const TutorialStepContent: React.FC<TutorialStepContentProps> = ({ stepActive, name, label, stepLink }) =>
  stepActive !== name ? (
    <a href={stepLink?.href}>
      <Text key={name} size="xs">
        {label}
      </Text>
    </a>
  ) : (
    <Text key={name} size="xs" className="tutorial-steps__bold">
      {label}
    </Text>
  );

export const TutorialSteps: React.FC<TutorialStepsProps> = ({ stepActive, steps, className, ...props }) => (
  <Flex
    {...props}
    display="inline-flex"
    flexDirection="column"
    // flexDirection={{ xs: 'row', md: 'column' }}
    p="s"
    className={classNames('tutorial-steps', className)}
  >
    <TutoTag
      justifyContent={{ xs: 'start', md: 'center' }}
      mx="s"
      className="tutorial-steps__tag"
      label="Progression"
    />
    <div style={{ display: 'flex' }}>
      <ol className="stepper">
        {steps.map(({ name, label, ...stepLink }) => {
          return (
            <li className={stepActive === name ? 'active' : ''}>
              <TutorialStepContent name={name} label={label} stepActive={stepActive} stepLink={stepLink} key={name} />
            </li>
          );
        })}
      </ol>
    </div>
    {/* <div style={{ display: 'flex' }}> */}
    {steps.map(({ name, label, ...stepLink }, index) => (
      <Box
        className={classNames('tutorial-steps__step', {
          'tutorial-steps__step--active': stepActive === name,
        })}
      >
        <Flex
          {...(stepActive !== name ? { as: 'a', ...(stepLink as FlexProps) } : {})}
          flexDirection={{ xs: 'column', md: 'row' }}
          alignItems="center"
          gap={{ xs: 'xxs-2', md: '0' }}
        >
          <Flex alignItems="center" justifyContent="center" className="tutorial-steps__number">
            {index + 1}
          </Flex>
          <Text key={name} size="xs" ml="xs" className="tutorial-steps__text">
            {label}
          </Text>
        </Flex>
        {index < steps.length - 1 && <Box className="tutorial-steps__connector"></Box>}
      </Box>
    ))}
    {/* </div> */}
  </Flex>
);
