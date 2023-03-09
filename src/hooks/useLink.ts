import { AsProps } from '@eleven-labs/design-system';
import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';

export interface UseLink {
  getLink: (props: LinkProps) => AsProps<'a'> & LinkProps;
}

export const useLink = (): UseLink => {
  const location = useLocation();
  const getLink = React.useCallback<UseLink['getLink']>(
    (props: LinkProps) => ({
      as: Link,
      ...props,
      state: {
        ...(props?.state || {}),
        from: location.pathname + location.search,
      },
    }),
    [location.pathname, location.search]
  );

  return {
    getLink,
  };
};
