import './PostPreview.scss';

import { AsProps } from '@eleven-labs/design-system';
import { Heading, Link, Skeleton, Text } from '@eleven-labs/design-system';
import React from 'react';

interface PostPreviewContentProps {
  title?: React.ReactNode;
  excerpt?: React.ReactNode;
  link?: AsProps<'a'>;
  hasMask?: boolean;
  isRelated?: boolean;
  isLoading?: boolean;
}

export const PostPreviewContent: React.FC<PostPreviewContentProps> = ({
  isLoading,
  hasMask,
  title,
  link,
  isRelated,
  excerpt,
}) => {
  return (
    <>
      <Skeleton isLoading={isLoading}>
        <Heading as="h2" color="amaranth" size="s" mb={{ xs: 'xxs-3', md: 'xxs' }}>
          {hasMask ? (
            title
          ) : (
            <Link {...link} data-internal-link={isRelated ? 'relatedPost' : 'post'}>
              {title}
            </Link>
          )}
        </Heading>
      </Skeleton>
      <Skeleton isLoading={isLoading} style={{ height: 75 }}>
        <Text size="s" className="post-preview__excerpt">
          {excerpt}
        </Text>
      </Skeleton>
    </>
  );
};
