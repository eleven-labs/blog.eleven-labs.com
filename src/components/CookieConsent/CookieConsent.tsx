import './CookieConsent.scss';

import {
  Box,
  Button,
  Flex,
  Heading,
  PolymorphicPropsWithRef,
  polyRef,
  Text,
} from '@eleven-labs/design-system';
import React from 'react';

export interface CookieConsentProps {
  title: React.ReactNode;
  description: React.ReactNode;
  declineButton: PolymorphicPropsWithRef<'button', { label: React.ReactNode }>;
  acceptButton: PolymorphicPropsWithRef<'button', { label: React.ReactNode }>;
}

export const CookieConsent = polyRef<'div', CookieConsentProps>(
  ({
    as = 'div',
    title,
    description,
    declineButton: { label: declineButtonLabel, ...declineButtonProps },
    acceptButton: { label: acceptButtonLabel, ...acceptButtonProps },
    ...props
  }) => (
    <Box {...props} as={as} className="cookie-consent">
      <Heading as="p" size="s">
        {title}
      </Heading>
      <Text mt="xs" size="s">
        {description}
      </Text>
      <Flex mt="m" gap="m" justifyContent="center">
        <Button variant="secondary" {...declineButtonProps}>
          {declineButtonLabel}
        </Button>
        <Button {...acceptButtonProps}>{acceptButtonLabel}</Button>
      </Flex>
    </Box>
  )
);
