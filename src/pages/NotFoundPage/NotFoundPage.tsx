import React from 'react';

import { Container, NotFoundBlock } from '@/components';

export type NotFoundPageProps = {
  backLink: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ backLink, title, description }) => (
  <>
    <Container variant="global">
      <Container variant="content">{backLink}</Container>
      <NotFoundBlock title={title} description={description} />
    </Container>
  </>
);
