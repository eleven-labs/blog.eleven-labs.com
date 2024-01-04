import { Text } from '@eleven-labs/design-system';
import React from 'react';

import { Container, Divider, HomeIntroBlock, HomeIntroBlockProps } from '@/components';

export type HomePageProps = {
  homeIntroBlock: HomeIntroBlockProps;
  title: React.ReactNode;
  postPreviewList: React.ReactNode;
};

export const HomePage: React.FC<HomePageProps> = ({ homeIntroBlock, title, postPreviewList }) => (
  <>
    <HomeIntroBlock {...homeIntroBlock} />
    <Container variant="global" mt={{ xs: 'l', md: 'xl' }}>
      <Container variant="content">
        <Text size="m" my="m" fontWeight="medium">
          {title}
        </Text>
        {postPreviewList}
        <Divider my="xl" />
      </Container>
    </Container>
  </>
);
