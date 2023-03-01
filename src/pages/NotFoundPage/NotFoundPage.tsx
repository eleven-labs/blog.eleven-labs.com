import { AsProps, Link } from '@eleven-labs/design-system';
import React from 'react';

import { Container, NotFoundBlock } from '@/components';

export type NotFoundPageProps = {
  backLink: AsProps<'a'> & { label: React.ReactNode };
  title: React.ReactNode;
  description: React.ReactNode;
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  backLink: { label, ...backLinkProps },
  title,
  description,
}) => (
  <>
    <Container as="main">
      <Link {...backLinkProps} icon="arrow-back" size="m">
        {label}
      </Link>
      <NotFoundBlock title={title} description={description} />
    </Container>
  </>
);
