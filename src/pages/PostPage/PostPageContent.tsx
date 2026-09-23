import type { PostFooterProps } from './PostFooter';
import type { PostHeaderProps } from './PostHeader';
import type { RelatedPostListProps } from './RelatedPostList';

import type { ContactCardProps, SummaryCardProps } from '@/components';
import type { PictureProps } from '@/design-system';

import React from 'react';

import { ContactCard, SummaryBar } from '@/components';
import { Divider, Picture } from '@/design-system';

import { PostFooter } from './PostFooter';
import { PostHeader } from './PostHeader';
import { RelatedPostList } from './RelatedPostList';

export const postPageVariant = ['article', 'tutorial'] as const;
export type PostPageVariantType = (typeof postPageVariant)[number];

export interface PostPageContentProps {
  variant: PostPageVariantType;
  summary: SummaryCardProps;
  cover?: PictureProps;
  header: Omit<PostHeaderProps, 'contentType'>;
  children: React.ReactNode;
  footer: PostFooterProps;
  contactCard: ContactCardProps;
  relatedPostList: RelatedPostListProps;
  className?: string;
}

export const PostPageContent: React.FC<PostPageContentProps> = ({
  variant = 'article',
  summary,
  cover,
  header,
  children,
  footer,
  relatedPostList,
  contactCard,
}) => (
  <>
    <div>
      <PostHeader {...header} />
      <Divider className="mt-m" />
      {cover && (
        <Picture
          {...cover}
          className="mt-l"
          img={{ ...cover.img, className: 'block h-auto w-full rounded-s object-cover aspect-video' }}
        />
      )}
      <SummaryBar
        className="mt-l md:hidden"
        variant={variant === 'tutorial' ? 'secondary' : 'primary'}
        {...summary}
      />
      <div className="post-content mt-l md:mt-m">{children}</div>
      <PostFooter className="mt-l" {...footer} />
    </div>
    <Divider />
    <ContactCard {...contactCard} />
    {relatedPostList.posts.length > 0 && <RelatedPostList {...relatedPostList} />}
  </>
);
