import { Text } from '@eleven-labs/design-system';
import React from 'react';

import {
  CategoryEndingBlock,
  CategoryEndingBlockProps,
  CategoryIntroBlock,
  CategoryIntroBlockProps,
  Container,
  Divider,
} from '@/components';

export type CategoryPageProps = {
  categoryIntroBlock: CategoryIntroBlockProps;
  categoryEndingBlock: CategoryEndingBlockProps;
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categoryIntroBlock,
  title,
  postPreviewList,
  categoryEndingBlock,
}) => (
  <>
    <CategoryIntroBlock {...categoryIntroBlock} />
    <Container variant="global" mt={{ xs: 'l', md: 'xl' }}>
      <Container variant="content">
        <Text size="m" my="m" fontWeight="medium">
          {title}
        </Text>
        {postPreviewList}
        <Divider my="xl" />
        <CategoryEndingBlock mb="xl" {...categoryEndingBlock} />
      </Container>
    </Container>
  </>
);
