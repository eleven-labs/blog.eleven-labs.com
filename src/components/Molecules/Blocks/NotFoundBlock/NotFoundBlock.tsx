import type { FlexProps } from '@/design-system';

import React from 'react';

import { Flex, Heading, Text } from '@/design-system';

import './NotFoundBlock.scss';

export type NotFoundBlockOptions = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export type NotFoundBlockProps = Omit<FlexProps, 'title'> & NotFoundBlockOptions;

export const NotFoundBlock: React.FC<NotFoundBlockProps> = ({ title, description, ...props }) => (
  <Flex {...props} flexDirection="column" alignItems="center" className="not-found-block">
    <div className="not-found-block__background" />
    <Heading size="xl" mt="s">
      {title}
    </Heading>
    <Text size="s" mt="xxs">
      {description}
    </Text>
  </Flex>
);
