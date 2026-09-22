import type { ElementType } from 'react';
import type React from 'react';

export type ComponentPropsWithoutRef<T extends ElementType> = Omit<React.ComponentPropsWithoutRef<T>, 'color'>;
