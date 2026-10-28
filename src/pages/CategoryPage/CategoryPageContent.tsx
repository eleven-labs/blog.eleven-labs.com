import type { CategoryEndingBlockProps } from '@/components/category-ending-block';

import React from 'react';

import { CategoryEndingBlock } from '@/components/category-ending-block';
import { Heading } from '@/design-system/ui/heading';
import { Separator } from '@/design-system/ui/separator';

export type CategoryPageContentProps = {
  categoryEndingBlock?: CategoryEndingBlockProps;
  title: React.ReactNode;
  postCardList: React.ReactNode;
};

export const CategoryPageContent: React.FC<CategoryPageContentProps> = ({
  title,
  postCardList,
  categoryEndingBlock,
}) => (
  <div>
    <Heading size="m" className="mb-8 text-brand">
      {title}
    </Heading>
    {postCardList}
    {categoryEndingBlock && (
      <>
        <Separator className="mt-6" />
        <CategoryEndingBlock className="mt-8" {...categoryEndingBlock} />
      </>
    )}
  </div>
);
