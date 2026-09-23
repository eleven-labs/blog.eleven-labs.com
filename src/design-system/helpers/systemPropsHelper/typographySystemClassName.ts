import type { LineClampType, MediaQueryType, TextAlignType, TypographySystemProps } from '@/design-system/types';

import classNames from 'classnames';

import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper/classNamesWithModifiers';

export const typographySystemClassName = <TProps extends TypographySystemProps>({
  textAlign,
  textSize,
  lineClamp,
  ...props
}: TProps): string =>
  classNames(
    ...classNamesWithModifiers<MediaQueryType, TextAlignType>({
      propValue: textAlign,
      className: 'text',
    }),
    {
      [`font-weight-${props.fontWeight}`]: props.fontWeight,
      [`text-${props.textTransform}`]: props.textTransform,
      [`text-underline`]: props.underline,
      [`text-italic`]: props.italic,
      [`text-${textSize}`]: textSize,
    },
    ...classNamesWithModifiers<MediaQueryType, LineClampType>({
      propValue: lineClamp,
      className: 'line-clamp',
    })
  );
