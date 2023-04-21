import React from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';

export const LinkContainer: React.FC<LinkProps> = (props) => {
  const location = useLocation();
  return <Link {...props} state={{ ...(props?.state || {}), from: location.pathname + location.search }} />;
};
