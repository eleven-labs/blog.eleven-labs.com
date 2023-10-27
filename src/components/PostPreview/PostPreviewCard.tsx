import './PostPreview.scss';

import { Box } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';
import { PropsWithChildren } from 'react';

import { PostPreviewProps } from './PostPreview';

const PostPreviewCard = ({
  isHighlighted,
  image,
  hasMask,
  isRelated,
  // boxProps,
  children,
}: Partial<PostPreviewProps> & PropsWithChildren): React.ReactNode => {
  if (isHighlighted) {
    return (
      <Box className={classNames({ 'post-preview--highlighted': isHighlighted })}>
        {isHighlighted && (
          <>
            <div className="sparkle" />
            <div>{isHighlighted && <img src={image?.source} alt={image?.alt} />}</div>
          </>
        )}
        <Box
          as="article"
          className={classNames(
            'post-preview',
            { 'post-preview--mask': hasMask },
            { 'post-preview--related': isRelated }
          )}
          // {...boxProps}
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
      // {...boxProps}
    >
      {children}
    </Box>
  );
};

export default PostPreviewCard;
