import React from 'react';

import { BackLink } from '@/components';
import { useBackLinkContainer } from '@/containers/BackLinkContainer/useBackLinkContainer';
export const BackLinkContainer: React.FC = () => {
  const backLinkProps = useBackLinkContainer();
  return <BackLink {...backLinkProps} />;
};
