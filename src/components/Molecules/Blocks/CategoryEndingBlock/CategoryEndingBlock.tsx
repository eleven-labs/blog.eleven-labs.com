import type { BoxProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { Box, Button, Text } from '@/design-system';

export interface CategoryEndingBlockProps extends BoxProps {
  title: React.ReactNode;
  description: React.ReactNode;
  expertiseLink?: { label: string } & ComponentPropsWithoutRef<'a'>;
}

export const CategoryEndingBlock: React.FC<CategoryEndingBlockProps> = ({
  title,
  description,
  expertiseLink: { label: expertiseLinkLabel, ...expertiseLink } = {},
  ...props
}) => (
  <Box {...props}>
    <Text size="m" fontWeight="bold">
      {title}
    </Text>
    <Text mt="m">{description}</Text>
    {expertiseLinkLabel && (
      <Button as="a" mt="l" {...expertiseLink}>
        {expertiseLinkLabel}
      </Button>
    )}
  </Box>
);
