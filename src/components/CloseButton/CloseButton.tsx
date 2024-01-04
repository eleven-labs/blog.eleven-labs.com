import './CloseButton.scss';

import { Box, Flex, FlexProps } from '@eleven-labs/design-system';
import React from 'react';

export interface CloseButtonProps extends FlexProps, React.ComponentPropsWithoutRef<'button'> {}

export const CloseButton: React.FC<CloseButtonProps> = (props) => (
  <Flex as="button" {...props} flexDirection="column" gap="xxs" className="close-button">
    <Box className="close-button__line close-button__line--horizontal" />
    <Box className="close-button__line close-button__line--vertical" />
  </Flex>
);
