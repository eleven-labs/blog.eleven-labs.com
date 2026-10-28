import React from 'react';

import { NotFoundBlock } from '@/components';

export type NotFoundPageProps = {
  title: React.ReactNode;
  description: React.ReactNode;
};

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ title, description }) => (
  <div className="flex flex-1 items-center justify-center">
    <NotFoundBlock className="m-16" title={title} description={description} />
  </div>
);
