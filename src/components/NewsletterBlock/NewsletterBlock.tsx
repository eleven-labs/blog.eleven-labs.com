import './NewsletterBlock.scss';

import {
  Box,
  Button,
  ButtonProps,
  Flex,
  Heading,
  PolymorphicPropsWithRef,
  polyRef,
  Text,
} from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { getPathFile } from '@/helpers/assetHelper';

export interface NewsletterBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  subscribeButton: PolymorphicPropsWithRef<'a', { label: React.ReactNode }>;
  className?: string;
}

export const NewsletterBlock = polyRef<'div', NewsletterBlockProps>(
  ({
    title,
    description,
    subscribeButton: { label: subscribeButtonLabel, ...subscribeButtonProps },
    className,
    ...props
  }) => (
    <Flex
      {...props}
      p="l"
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      aa="toto"
      textAlign={{ xs: 'center', md: 'left' }}
      className={classNames('newsletter-block', className)}
    >
      <img src={getPathFile('/imgs/newsletter.png')} alt="" className="newsletter-block__img" />
      <Box>
        <Text size="s" mt={{ xs: 's', md: '0' }}>
          {title}
        </Text>
        <Heading as="p" size="l">
          {description}
        </Heading>
        <Button {...(subscribeButtonProps as ButtonProps)} mt={{ xs: 'm', md: 'l' }} data-newsletter-link>
          {subscribeButtonLabel}
        </Button>
      </Box>
    </Flex>
  )
);
