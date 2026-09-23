import type { PostPageContentProps } from './PostPageContent';

import type { BreadcrumbProps, PictureProps } from '@/design-system';

import React from 'react';

import { SummaryCard } from '@/components';
import { Breadcrumb } from '@/design-system';
import { LayoutContentWithSidebar } from '@/templates/LayoutContentWithSidebar';

import { PostPageContent } from './PostPageContent';

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
  <div className="mx-auto">
    <Breadcrumb className="mx-xs md:mx-0" {...breadcrumb} />
    <LayoutContentWithSidebar
      content={
        <PostPageContent {...postPageContent} variant={variant} summary={summary} cover={cover}>
          {children}
        </PostPageContent>
      }
      sidebar={
        <SummaryCard
          className="max-md:hidden"
          variant={variant === 'tutorial' ? 'secondary' : 'primary'}
          {...summary}
        />
      }
    />
  </div>
);
