import type { FlexItemSystemProps, FlexType , FlexBasisType, MediaQueryType } from '@/design-system/types';

import classNames from 'classnames';

import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper';

export const flexItemSystemClassName = <TProps extends FlexItemSystemProps>(props: TProps): string =>
  classNames(
    classNamesWithModifiers<MediaQueryType, FlexBasisType>({
      propValue: props.flexBasis,
      className: 'basis',
    }),
    classNamesWithModifiers<MediaQueryType, FlexType>({
      propValue: props.flex,
      className: 'flex',
    })
  );
