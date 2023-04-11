import { AsProps, Link } from '@eleven-labs/design-system';
import React from 'react';

export type BackLinkOptions = {
  label: React.ReactNode;
};
export type BackLinkProps = AsProps<'a'> & BackLinkOptions;

export const BackLink: React.FC<BackLinkProps> = ({ label, ...props }) => (
  <Link {...props} icon="arrow-back" size="m">
    {label}
  </Link>
);
