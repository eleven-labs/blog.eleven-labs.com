import './PostPreview.scss';

import { Box } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

interface PostPreviewCardProps {
  hasMask?: boolean;
  isRelated?: boolean;
  isLoading?: boolean;
  isHighlighted?: boolean;
  children: React.ReactNode;
}

export const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  isHighlighted,
  hasMask,
  isRelated,
  children,
  ...props
}) => {
  const Container: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    isHighlighted ? (
      <Box className={classNames({ 'post-preview--highlighted': isHighlighted })}>
        <div className="sparkle" />
        {children}
      </Box>
    ) : (
      <>{children}</>
    );
  return (
    <Container>
      <Box
        as="article"
        className={classNames(
          'post-preview',
          { 'post-preview--mask': hasMask },
          { 'post-preview--related': isRelated }
        )}
        {...props}
      >
        {children}
      </Box>
    </Container>
  );
};
