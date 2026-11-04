import type { PostPageContentProps } from './PostPageContent';

import type { PictureProps } from '@/design-system/ui/picture';
import type { BreadcrumbData } from '@/hooks/useBreadcrumb';

import React from 'react';

import { SummaryCard } from '@/components/summary-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/design-system/ui/breadcrumb';
import { LayoutContentWithSidebar } from '@/templates/LayoutContentWithSidebar';

import { PostPageContent } from './PostPageContent';

export interface PostPageProps extends PostPageContentProps {
  breadcrumb: BreadcrumbData;
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
    <Breadcrumb className="mx-3 md:mx-0">
      <BreadcrumbList>
        {breadcrumb.items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
    <LayoutContentWithSidebar
      content={
        <PostPageContent {...postPageContent} variant={variant} summary={summary} cover={cover}>
          {children}
        </PostPageContent>
      }
      sidebar={
        // Le sommaire reste à l'écran pendant la lecture ; trop long, il défile sur lui-même
        <SummaryCard
          className="max-md:hidden md:sticky md:top-6 md:max-h-sticky md:overflow-y-auto"
          variant={variant === 'tutorial' ? 'secondary' : 'primary'}
          {...summary}
        />
      }
    />
  </div>
);
