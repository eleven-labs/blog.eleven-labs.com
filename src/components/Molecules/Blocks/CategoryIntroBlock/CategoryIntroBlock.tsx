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
      'bg-[url(/imgs/category-intro-block-mobile.jpg)] bg-cover bg-bottom text-white md:bg-[url(/imgs/category-intro-block-desktop.jpg)]',
      className
    )}
  >
    <div className="flex items-center justify-center bg-primary px-l opacity-90 md:px-0">
      <div className="container-content pt-m pb-xxl">
        <Breadcrumb {...breadcrumb} />
        <Heading as="h1" size="xl">
          {title}
        </Heading>
        <Text className="mt-l">{description}</Text>
      </div>
    </div>
  </div>
);
