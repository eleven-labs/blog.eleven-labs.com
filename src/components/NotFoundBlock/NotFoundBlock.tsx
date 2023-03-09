import './NotFoundBlock.scss';

import { Flex, FlexProps, Heading, Text } from '@eleven-labs/design-system';
import React from 'react';

import { getPathFile } from '@/helpers/assetHelper';

export type NotFoundBlockOptions = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export type NotFoundBlockProps = Omit<FlexProps, 'title'> & NotFoundBlockOptions;

export const NotFoundBlock: React.FC<NotFoundBlockProps> = ({ title, description, ...props }) => (
  <Flex {...props} flexDirection="column" alignItems="center" mt="m" className="not-found-block">
    <img src={getPathFile('/imgs/not-found.png')} alt="not-found" />
    <Heading size="l" mt="s">
      {title}
    </Heading>
    <Text size="s" mt="xxs">
      {description}
    </Text>
  </Flex>
);
