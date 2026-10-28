import type { BreadcrumbData } from '@/hooks/useBreadcrumb';

import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/design-system/ui/breadcrumb';
import { Heading } from '@/design-system/ui/heading';
import { Text } from '@/design-system/ui/text';

export interface CategoryIntroBlockProps {
  title: React.ReactNode;
  description: React.ReactNode;
  breadcrumb: BreadcrumbData;
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
        <Breadcrumb>
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
        <Heading render={<h1 />} size="xl">
          {title}
        </Heading>
        <Text className="mt-8">{description}</Text>
      </div>
    </div>
  </div>
);
