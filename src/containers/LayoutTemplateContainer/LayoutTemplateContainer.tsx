import { LayoutTemplate } from '@eleven-labs/design-system';
import React from 'react';

import { useLayoutTemplateContainer } from '@/containers/LayoutTemplateContainer/useLayoutTemplateContainer';

export const LayoutTemplateContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const layoutTemplateProps = useLayoutTemplateContainer();
  return <LayoutTemplate {...layoutTemplateProps}>{children}</LayoutTemplate>;
};
