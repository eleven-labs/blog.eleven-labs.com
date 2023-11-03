import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';

export const LinkContainer = React.forwardRef<LinkProps>((props, ref) => {
  const location = useLocation();
  return <Link {...props} state={{ ...(props?.state || {}), from: location.pathname + location.search }} ref={ref} />;
});
