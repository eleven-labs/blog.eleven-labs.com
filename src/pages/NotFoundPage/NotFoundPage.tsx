import React from 'react';

import { NotFoundBlock } from '@/components';
import { Flex } from '@/design-system';

export type NotFoundPageProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ title, description }) => (
  <Flex justifyContent="center" alignItems="center" flex="1">
    <NotFoundBlock m="xxl" title={title} description={description} />
  </Flex>
);
