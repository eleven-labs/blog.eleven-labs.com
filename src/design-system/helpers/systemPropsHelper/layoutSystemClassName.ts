import type { DisplayType, LayoutSystemProps , HeightType, MediaQueryType, WidthType } from '@/design-system/types';

import classNames from 'classnames';

import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper';

export const layoutSystemClassName = <TProps extends LayoutSystemProps>(props: TProps): string =>
  classNames(
    classNamesWithModifiers<MediaQueryType, DisplayType>({
      propValue: props.display,
      className: 'display',
    }),
    classNamesWithModifiers<MediaQueryType, WidthType>({
      propValue: props.width,
      className: 'width',
    }),
    classNamesWithModifiers<MediaQueryType, HeightType>({
      propValue: props.height,
      className: 'height',
    }),
    {
      [`hidden-above@${props.hiddenAbove}`]: Boolean(props.hiddenAbove),
      [`hidden-below@${props.hiddenBelow}`]: Boolean(props.hiddenBelow),
    }
  );
