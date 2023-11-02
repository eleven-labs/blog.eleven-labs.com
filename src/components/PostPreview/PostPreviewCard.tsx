import './PostPreview.scss';

import { Box } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

interface PostPreviewCardProps {
  hasMask?: boolean;
  isRelated?: boolean;
  isLoading?: boolean;
  image?: { source: string; alt: string };
  isHighlighted?: boolean;
  children: React.ReactNode;
}

export const PostPreviewCard: React.FC<PostPreviewCardProps> = ({
  isHighlighted,
  image,
  hasMask,
  isRelated,
  children,
  ...props
}) => {
  if (isHighlighted) {
    return (
      <Box className={classNames({ 'post-preview--highlighted': isHighlighted })}>
        {isHighlighted && (
          <>
            <div className="sparkle" />
            {image && <div>{isHighlighted && <img src={image?.source} alt={image?.alt} />}</div>}
          </>
        )}
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
      </Box>
    );
  }
  return (
    <Box
      as="article"
      className={classNames('post-preview', { 'post-preview--mask': hasMask }, { 'post-preview--related': isRelated })}
      {...props}
    >
      {children}
    </Box>
  );
};
