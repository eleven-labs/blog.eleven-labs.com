import type { ComponentPropsWithoutRef, MarginSystemProps } from '@/design-system/types';

import React from 'react';

import { Box } from '@/design-system';

import './Divider.scss';

export interface DividerProps extends ComponentPropsWithoutRef<'hr'>, MarginSystemProps {}

export const Divider: React.FC<DividerProps> = (props) => <Box {...props} as="hr" className="divider" />;
