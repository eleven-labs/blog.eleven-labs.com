import './TutorialSteps.scss';

import { AsProps, Flex, Text } from '@eleven-labs/design-system';
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
    <Text size="xs" className="tutorial-steps__bold">
      {label}
    </Text>
  );

export const TutorialSteps: React.FC<TutorialStepsProps> = ({ stepActive, steps, className, ...props }) => (
  <Flex
    {...props}
    p="s"
    className={classNames('tutorial-steps', className)}
    display="inline-flex"
    flexDirection="column"
  >
    <TutoTag
      justifyContent={{ xs: 'start', md: 'center' }}
      mx="s"
      className="tutorial-steps__tag"
      label="Progression"
    />
    <ol className="tutorial-steps">
      {steps.map(({ name, label, ...stepLink }) => {
        return (
          <li className={stepActive === name ? 'active' : ''} key={name}>
            <TutorialStepContent name={name} label={label} stepActive={stepActive} stepLink={stepLink} key={name} />
          </li>
        );
      })}
    </ol>
  </Flex>
);
