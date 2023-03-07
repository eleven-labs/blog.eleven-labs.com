import './CookieConsent.scss';

import { As, AsProps, Box, BoxProps, Button, Flex, Heading, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface CookieConsentOptions {
  title: React.ReactNode;
  description: React.ReactNode;
  declineButton: AsProps<'button'> & { label: React.ReactNode };
  acceptButton: AsProps<'button'> & { label: React.ReactNode };
}

export type CookieConsentProps<T extends As = 'div'> = CookieConsentOptions & BoxProps<T>;

export const CookieConsent: React.FC<CookieConsentProps> = ({
  title,
  description,
  declineButton: { label: declineButtonLabel, ...declineButtonProps },
  acceptButton: { label: acceptButtonLabel, ...acceptButtonProps },
}) => {
  return (
    <Box className="cookie-consent">
      <Heading size="s">{title}</Heading>
      <Text mt="xs" size="s">
        {description}
      </Text>
      <Flex mt="m" gap="m">
        <Button variant="secondary" {...declineButtonProps}>
          {declineButtonLabel}
        </Button>
        <Button {...acceptButtonProps}>{acceptButtonLabel}</Button>
      </Flex>
    </Box>
  );
};
