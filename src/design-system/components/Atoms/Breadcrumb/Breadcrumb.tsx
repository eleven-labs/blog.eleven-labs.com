import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React, { Fragment } from 'react';

import { Link, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface BreadcrumbProps {
  items: ({ label: string } & ComponentPropsWithoutRef<'a'>)[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => (
  <ol className={cn('my-[1em] flex list-none gap-xxs-3 p-0 font-semibold', className)}>
    {items.map(({ label, ...itemLink }, index) => (
      <Fragment key={index}>
        <li>
          {itemLink.href ? (
            <Link {...itemLink}>
              <Text render={<span />}>{label}</Text>
            </Link>
          ) : (
            <Text render={<span />} className="font-normal">
              {label}
            </Text>
          )}
        </li>
        {index < items.length - 1 && <Text render={<span />}>{'>'}</Text>}
      </Fragment>
    ))}
  </ol>
);
