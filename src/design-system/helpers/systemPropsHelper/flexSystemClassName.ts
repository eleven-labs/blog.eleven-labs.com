import type { FlexDirectionType, FlexSystemProps, FlexWrapType , MediaQueryType } from '@/design-system/types';

import classNames from 'classnames';

import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper';

export const flexSystemClassName = <TProps extends FlexSystemProps>(props: TProps): string =>
  classNames(
    classNamesWithModifiers<MediaQueryType, FlexDirectionType>({
      propValue: props.flexDirection,
      className: 'flex',
    }),
    classNamesWithModifiers<MediaQueryType, FlexWrapType>({
      propValue: props.flexWrap,
      className: 'flex',
    })
  );
