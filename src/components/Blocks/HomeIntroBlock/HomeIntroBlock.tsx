import './HomeIntroBlock.scss';

import { Box, Button, Flex, Heading, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface HomeIntroBlockProps {
  intro: string;
  title: string;
  description: string;
  elevenLabsLink: { label: string } & React.ComponentPropsWithoutRef<'a'>;
}

export const HomeIntroBlock: React.FC<HomeIntroBlockProps> = ({
  intro,
  title,
  description,
  elevenLabsLink: { label: elevelLabsLinkLabel, ...elevenLabsLink },
}) => (
  <Box py="xl" className="home-intro-block">
    <Flex alignItems="baseline" flexDirection="column" gap="l" ml="xxl-2" className="home-intro-block__container">
      <Text size="m" fontWeight="bold" color="amaranth" textTransform="uppercase">
        {intro}
      </Text>
      <Heading color="navy" textTransform="uppercase" dangerouslySetInnerHTML={{ __html: title }} />
      <Text className="home-intro-block__description" dangerouslySetInnerHTML={{ __html: description }} />
      <Button as="a" {...elevenLabsLink}>
        {elevelLabsLinkLabel}
      </Button>
    </Flex>
  </Box>
);
