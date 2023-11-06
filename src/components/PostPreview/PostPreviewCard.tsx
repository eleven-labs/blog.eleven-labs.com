import './PostPreview.scss';

import { Box, BoxProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

import { PostPreviewProps } from '@/components';

interface PostPreviewCardProps extends Pick<PostPreviewProps, 'isHighlighted' | 'hasMask' | 'isRelated'>, BoxProps {
  children: React.ReactNode;
}

export const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  isHighlighted,
  hasMask,
  isRelated,
  children,
  ...props
}) => (
  <Box
    as="article"
    className={classNames(
      'post-preview',
      { 'post-preview--mask': hasMask },
      { 'post-preview--related': isRelated },
      { 'post-preview--highlighted': isHighlighted }
    )}
    {...props}
  >
    {isHighlighted && <div className="post-preview__sparkle" />}
    {isHighlighted ? <Box>{children}</Box> : children}
  </Box>
);
