import type { FlexProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import classNames from 'classnames';
import React from 'react';

import { Box, Button, Flex, Heading, Text } from '@/design-system';

import './HomeIntroBlock.scss';

export interface HomeIntroBlockProps extends FlexProps {
  intro: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  elevenLabsLink: { label: string } & ComponentPropsWithoutRef<'a'>;
}

export const HomeIntroBlock: React.FC<HomeIntroBlockProps> = ({
  intro,
  title,
  description,
  elevenLabsLink: { label: elevelLabsLinkLabel, ...elevenLabsLink },
  ...props
}) => (
  <Flex {...props} className={classNames('home-intro-block', props.className)}>
    <Flex
      alignItems="baseline"
      flexDirection="column"
      className="home-intro-block__container"
      flex="1"
      py={{ xs: '0', md: 'xl' }}
    >
      <Heading size="s" color="info" textTransform="uppercase">
        {intro}
      </Heading>
      <Heading as="h1" size="xl" mt="m" color="primary">
        {title}
      </Heading>
      <Text mt="l">{description}</Text>
      <Button {...elevenLabsLink} as="a" mt="l">
        {elevelLabsLinkLabel}
      </Button>
    </Flex>
    <Box flex="1" className="home-intro-block__background" hiddenBelow="md" />
  </Flex>
);
