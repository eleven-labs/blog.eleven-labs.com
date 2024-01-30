import { Header } from '@eleven-labs/design-system';
import React from 'react';

import { LayoutTemplateData } from '@/types';

import { useHeaderContainer } from './useHeaderContainer';

export interface HeaderContainerProps {
  layoutTemplateData: LayoutTemplateData;
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ layoutTemplateData }) => {
  const headerProps = useHeaderContainer({ layoutTemplateData });
  return <Header {...headerProps} />;
};
