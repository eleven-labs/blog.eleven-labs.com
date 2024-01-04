import './ContactBlock.scss';

import { Button, Flex, FlexProps, Heading, Text } from '@eleven-labs/design-system';
import React from 'react';

export type ContactBlockProps = {
  title: string;
  subtitle: string;
  description: string;
  link: { label: React.ReactNode } & React.ComponentPropsWithoutRef<'a'>;
} & FlexProps;

export const ContactBlock: React.FC<ContactBlockProps> = ({
  title,
  subtitle,
  description,
  link: { label: linkLabel, ...link },
  ...props
}) => (
  <Flex {...props} justifyContent="center" alignItems="center" py="l" className="contact-block">
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="m"
      className="contact-block__container"
    >
      <Heading as="p" size="l" color="navy" textAlign="center">
        {title}{' '}
        <Text as="span" fontWeight="bold">
          {subtitle}
        </Text>
      </Heading>
      <Text size="s" dangerouslySetInnerHTML={{ __html: description }} />
      <Button as="a" {...link}>
        {linkLabel}
      </Button>
    </Flex>
  </Flex>
);
