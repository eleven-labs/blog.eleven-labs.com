import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React, { Fragment } from 'react';

import { Icon } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';
import { DOTS, usePagination } from '@/design-system/hooks/usePagination';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  getLink: (page: number) => ComponentPropsWithoutRef<'a'>;
  siblingCount?: number;
  className?: string;
}

/* La première case ferme la bordure à gauche et retourne sa flèche : c'est le lien « précédent ». */
const itemClassName =
  'flex size-[48px] items-center justify-center border-y border-r border-secondary-dark text-primary-dark first:border-l first:[&_svg]:rotate-180';

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  getLink,
  siblingCount = 0,
  className,
}) => {
  const pagination = usePagination({ currentPage, totalPages, siblingCount });

  const renderItem = (options: {
    page: number;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
  }): React.JSX.Element => {
    const itemProps = {
      className: cn(itemClassName, options.active && 'text-info', options.disabled && 'text-grey'),
    };

    return options.disabled ? (
      <span {...itemProps}>{options.children}</span>
    ) : (
      <a {...getLink(options.page)} {...itemProps}>
        {options.children}
      </a>
    );
  };

  return (
    <div className={cn('flex', className)}>
      {renderItem({ page: currentPage, disabled: currentPage === 1, children: <Icon name="arrow" /> })}
      {pagination.map((page: number, index: number) => (
        <Fragment key={index}>
          {page === DOTS ? (
            <div className={itemClassName}>...</div>
          ) : (
            renderItem({ page, active: currentPage === page, children: page })
          )}
        </Fragment>
      ))}
      {renderItem({
        page: currentPage + 1,
        disabled: currentPage === totalPages,
        children: <Icon name="arrow" />,
      })}
    </div>
  );
};
