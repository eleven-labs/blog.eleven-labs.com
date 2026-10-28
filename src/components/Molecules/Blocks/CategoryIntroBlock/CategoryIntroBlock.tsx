import type { BreadcrumbProps } from '@/design-system';

import React from 'react';

import { Breadcrumb, Heading, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface CategoryIntroBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  breadcrumb: BreadcrumbProps;
  className?: string;
}

export const CategoryIntroBlock: React.FC<CategoryIntroBlockProps> = ({
  title,
  description,
  breadcrumb,
  className,
}) => (
  <div
    className={cn(
      'bg-[url(/imgs/category-intro-block-mobile.jpg)] bg-cover bg-bottom text-on-brand md:bg-[url(/imgs/category-intro-block-desktop.jpg)]',
      className
    )}
  >
    <div className="flex items-center justify-center bg-brand px-8 opacity-90 md:px-0">
      <div className="container-content pt-6 pb-16">
        <Breadcrumb {...breadcrumb} />
        <Heading render={<h1 />} size="xl">
          {title}
        </Heading>
        <Text className="mt-8">{description}</Text>
      </div>
    </div>
  </div>
);
