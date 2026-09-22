import type { FlexProps } from '@/design-system';

import classNames from 'classnames';
import React from 'react';

import { Icon, Box, Flex, Heading, Text } from '@/design-system';

import './NewsletterCard.scss';
import './webmecanik.scss';

export const newsletterCardVariant = ['horizontal', 'vertical'] as const;
export type NewsletterCardVariantType = (typeof newsletterCardVariant)[number];

export interface NewsletterCardProps extends Omit<FlexProps, 'title'> {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
  variant?: NewsletterCardVariantType;
}

export const NewsletterCard: React.FC<NewsletterCardProps> = ({
  title,
  description,
  children,
  variant = 'vertical',
  ...props
}) => (
  <Flex
    {...props}
    p="l"
    bg="primary"
    color="white"
    className={classNames('newsletter-card', `newsletter-card--${variant}`, props.className)}
  >
    <Box className="newsletter-card__intro">
      <Heading size="m" color="accent">
        {title}
      </Heading>
      <Icon name="underline" color="accent" width="56px" />
      <Text mt="m">{description}</Text>
    </Box>
    <Box className="newsletter-card__form">{children}</Box>
  </Flex>
);
