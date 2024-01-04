import './CategoryEndingBlock.scss';

import { Box, BoxProps, Button, Text } from '@eleven-labs/design-system';
import React from 'react';
export interface CategoryEndingBlockProps extends BoxProps {
  title: string;
  description: string;
  expertiseLink: { label: string } & React.ComponentPropsWithoutRef<'a'>;
}

export const CategoryEndingBlock: React.FC<CategoryEndingBlockProps> = ({
  title,
  description,
  expertiseLink: { label: expertiseLinkLabel, ...expertiseLink },
  ...props
}) => (
  <Box {...props} className="category-ending-block">
    <Text size="m" fontWeight="bold" dangerouslySetInnerHTML={{ __html: title }} />
    <Text mt="m" className="category-ending-block__description" dangerouslySetInnerHTML={{ __html: description }} />
    <Button as="a" mt="l" {...expertiseLink}>
      {expertiseLinkLabel}
    </Button>
  </Box>
);
