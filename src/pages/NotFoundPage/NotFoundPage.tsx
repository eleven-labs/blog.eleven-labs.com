import React from 'react';

import { Container, NotFoundBlock } from '@/components';

export type NotFoundPageProps = {
  backLink: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ backLink, title, description }) => (
  <>
    <Container>
      {backLink}
      <NotFoundBlock title={title} description={description} />
    </Container>
  </>
);
