import type { FlexProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Button, Flex, Heading, Text } from '@/design-system';

import './ContactCard.scss';

export type ContactCardProps = {
  title: React.ReactNode;
  description: React.ReactNode;
  link: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
} & FlexProps;

export const ContactCard: React.FC<ContactCardProps> = ({
  title,
  description,
  link: { label: linkLabel, ...link },
  ...props
}) => (
  <Flex {...props} justifyContent="center" alignItems="center" py="l" className="contact-card">
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="m"
      textAlign="center"
      className="contact-card__container"
      px="m"
    >
      <Heading size="l" color="primary">
        {title}
      </Heading>
      <Text size="s">{description}</Text>
      <Button as="a" {...link}>
        {linkLabel}
      </Button>
    </Flex>
  </Flex>
);
