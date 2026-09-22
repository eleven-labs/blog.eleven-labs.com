import type { LayoutTemplateData } from '@/types';

import React from 'react';

import { Header } from '@/components';

import { useHeaderContainer } from './useHeaderContainer';

export interface HeaderContainerProps {
  layoutTemplateData: LayoutTemplateData;
}

export const HeaderContainer: React.FC<HeaderContainerProps> = ({ layoutTemplateData }) => {
  const headerProps = useHeaderContainer({ layoutTemplateData });
  return <Header {...headerProps} />;
};
