import type { ComponentPropsWithoutRef, MarginSystemProps } from '@/design-system/types';

import classNames from 'classnames';
import React from 'react';

import { Text } from '@/design-system';

import './Blockquote.scss';

export interface BlockquoteProps extends MarginSystemProps, Omit<ComponentPropsWithoutRef<'blockquote'>, 'align'> {}

export const Blockquote: React.FC<BlockquoteProps> = ({ children, className, ...props }) => (
  <Text as="blockquote" {...props} pl="m" size="m" italic className={classNames('blockquote', className)}>
    {children}
  </Text>
);
