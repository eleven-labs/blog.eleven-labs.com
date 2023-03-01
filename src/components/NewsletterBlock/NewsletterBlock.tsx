import './NewsletterBlock.scss';

import { AsProps, Box, Button, ButtonProps, Flex, FlexProps, Heading, Text } from '@eleven-labs/design-system';
import React from 'react';

import { getPathFile } from '@/helpers/assetHelper';

export type NewsletterBlockOptions = {
  title: React.ReactNode;
  description: React.ReactNode;
  subscribeButton: { label: React.ReactNode } & AsProps<'a'>;
};

export type NewsletterBlockProps = Omit<FlexProps, 'title'> & NewsletterBlockOptions;

export const NewsletterBlock: React.FC<NewsletterBlockProps> = ({
  title,
  description,
  subscribeButton: { label: subscribeButtonLabel, ...subscribeButtonProps },
  ...props
}) => (
  <Flex
    {...props}
    p="l"
    flexDirection={{ xs: 'column', md: 'row' }}
    justifyContent="center"
    alignItems="center"
    textAlign={{ xs: 'center', md: 'left' }}
    className="newsletter-block"
  >
    <img src={getPathFile('/imgs/newsletter.png')} alt="" className="newsletter-block__img" />
    <Box>
      <Text size="s" mt={{ xs: 's', md: '0' }}>
        {title}
      </Text>
      <Heading size="l">{description}</Heading>
      <Button {...(subscribeButtonProps as ButtonProps)} mt={{ xs: 'm', md: 'l' }}>
        {subscribeButtonLabel}
      </Button>
    </Box>
  </Flex>
);
