import { Link, polyRef } from '@eleven-labs/design-system';
import React from 'react';

export interface BackLinkProps {
  label: React.ReactNode;
}

export const BackLink = polyRef<'a', BackLinkProps>(({ as = 'a', label, ...props }, ref) => (
  <Link {...props} as={as} ref={ref} icon="arrow-back" size="m" data-internal-link="back">
    {label}
  </Link>
));
