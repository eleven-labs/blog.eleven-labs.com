import type { PostPageContentProps } from './PostPageContent';

import type { BreadcrumbProps, PictureProps } from '@/design-system';

import React from 'react';

import { SummaryCard } from '@/components';
import { Box, Breadcrumb } from '@/design-system';
import { LayoutContentWithSidebar } from '@/templates/LayoutContentWithSidebar';

import { PostPageContent } from './PostPageContent';

import './PostPage.scss';

export interface PostPageProps extends PostPageContentProps {
  breadcrumb: BreadcrumbProps;
  cover: PictureProps;
}

export const PostPage: React.FC<PostPageProps> = ({
  variant = 'article',
  breadcrumb,
  cover,
  summary,
  children,
  ...postPageContent
}) => (
  <Box mx="auto" className="post-page">
    <Breadcrumb mx={{ xs: 'xs', md: '0' }} {...breadcrumb} />
    <LayoutContentWithSidebar
      content={
        <PostPageContent {...postPageContent} variant={variant} summary={summary} cover={cover}>
          {children}
        </PostPageContent>
      }
      sidebar={<SummaryCard hiddenBelow="md" variant={variant === 'tutorial' ? 'secondary' : 'primary'} {...summary} />}
    />
  </Box>
);
