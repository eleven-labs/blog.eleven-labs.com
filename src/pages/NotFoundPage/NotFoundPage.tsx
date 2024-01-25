import React from 'react';

import { Container, NotFoundBlock } from '@/components';

export type NotFoundPageProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ title, description }) => (
  <>
    <Container variant="global">
      <NotFoundBlock title={title} description={description} />
    </Container>
  </>
);
