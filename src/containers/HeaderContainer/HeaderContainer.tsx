import React from 'react';

import { useHeaderContainer } from '@/containers/HeaderContainer/useHeaderContainer';
import { Header } from '@/templates/LayoutTemplate';

export const HeaderContainer: React.FC = () => {
  const headerProps = useHeaderContainer();
  return <Header {...headerProps} />;
};
