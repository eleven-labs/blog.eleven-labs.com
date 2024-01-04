import './CategoryIntroBlock.scss';

import { Box, BoxProps, Flex, Heading, Link, Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container } from '@/components';

export interface CategoryIntroBlockProps extends BoxProps {
  name: string;
  title: string;
  description: string;
  homeLink: { label: string } & React.ComponentPropsWithoutRef<'a'>;
}

export const CategoryIntroBlock: React.FC<CategoryIntroBlockProps> = ({
  name,
  title,
  description,
  homeLink: { label: homeLinkLabel, ...homeLink },
  ...props
}) => (
  <Box {...props} className="category-intro-block" color="white">
    <Box className="category-intro-block__container">
      <Container variant="common" pt="m" pb="xxl" px={{ xs: 'l', md: '0' }}>
        <Flex gap="xxs-3">
          <Link {...homeLink}>{homeLinkLabel}</Link>
          <Text>{'>'}</Text>
          <Text>{name}</Text>
        </Flex>
        <Heading mt="xl" size="xl" textTransform="uppercase" dangerouslySetInnerHTML={{ __html: title }} />
        <Text mt="l" dangerouslySetInnerHTML={{ __html: description }} />
      </Container>
    </Box>
  </Box>
);
