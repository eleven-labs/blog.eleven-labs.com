import type { ColorSystemProps } from '@/design-system/types';

import classNames from 'classnames';

export const colorSystemClassName = <TProps extends ColorSystemProps>(props: TProps): string =>
  classNames({
    [`bg-${props.bg}`]: props.bg,
    [`color-${props.color}`]: props.color,
  });
