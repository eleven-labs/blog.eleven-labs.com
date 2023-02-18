import React from 'react';

import { useLayoutTemplateContainer } from '@/containers/LayoutTemplateContainer/useLayoutTemplateContainer';
import { LayoutTemplate } from '@/templates/LayoutTemplate';

export const LayoutTemplateContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const layoutTemplateProps = useLayoutTemplateContainer();
  return <LayoutTemplate {...layoutTemplateProps}>{children}</LayoutTemplate>;
};
