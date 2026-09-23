import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React, { Fragment } from 'react';

import { Link, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface BreadcrumbProps {
  items: ({ label: string } & ComponentPropsWithoutRef<'a'>)[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => (
  <ol
    itemScope
    itemType="https://schema.org/BreadcrumbList"
    className={cn('my-[1em] flex list-none gap-xxs-3 p-0 font-semibold', className)}
  >
    {items.map(({ label, ...itemLink }, index) => (
      <Fragment key={index}>
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          {itemLink.href ? (
            <Link itemProp="item" {...itemLink}>
              <Text as="span" itemProp="name">
                {label}
              </Text>
            </Link>
          ) : (
            <Text as="span" itemProp="name" className="font-normal">
              {label}
            </Text>
          )}
          <meta itemProp="position" content={(index + 1).toString()} />
        </li>
        {index < items.length - 1 && <Text as="span">{'>'}</Text>}
      </Fragment>
    ))}
  </ol>
);
