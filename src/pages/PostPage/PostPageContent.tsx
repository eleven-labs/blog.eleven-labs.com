import type { PostFooterProps } from './PostFooter';
import type { PostHeaderProps } from './PostHeader';
import type { RelatedPostListProps } from './RelatedPostList';

import type { ContactCardProps, SummaryCardProps } from '@/components';
import type { PictureProps } from '@/design-system';
import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

import { ContactCard, SummaryCard } from '@/components';
import { Box, Button, Divider, Flex, Picture } from '@/design-system';

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
  previousLink?: { label: string } & ComponentPropsWithoutRef<'a'>;
  nextLink?: { label: string } & ComponentPropsWithoutRef<'a'>;
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
  previousLink: { label: previousLinkLabel, ...previousLink } = {},
  nextLink: { label: nextLinkLabel, ...nextLink } = {},
}) => (
  <>
    <Box>
      <PostHeader {...header} />
      <Divider mt="m" />
      {cover && <Picture {...cover} mt="l" img={{ ...cover.img, className: 'post-page__cover' }} />}
      <SummaryCard mt="l" hiddenAbove="md" variant={variant === 'tutorial' ? 'secondary' : 'primary'} {...summary} />
      <Box mt={{ xs: 'l', md: 'm' }} className="post-page__content">
        {children}
      </Box>
      {variant === 'tutorial' && (
        <>
          <Flex gap="l">
            {previousLinkLabel && previousLink && (
              <Button as="a" mt="l" variant="secondary" {...previousLink}>
                {previousLinkLabel}
              </Button>
            )}
            {nextLinkLabel && nextLink && (
              <Button as="a" mt="l" {...nextLink}>
                {nextLinkLabel}
              </Button>
            )}
          </Flex>
        </>
      )}
      <PostFooter mt="l" {...footer} />
    </Box>
    <Divider />
    <ContactCard {...contactCard} />
    {relatedPostList.posts.length > 0 && <RelatedPostList {...relatedPostList} />}
  </>
);
