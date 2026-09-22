import type { FlexOrGridSystemProps, SpacingType , AlignContentType, AlignItemsType, JustifyContentType, MediaQueryType } from '@/design-system/types';

import classNames from 'classnames';

import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper';

export const flexOrGridSystemClassName = <TProps extends FlexOrGridSystemProps>(props: TProps): string =>
  classNames(
    ...classNamesWithModifiers<MediaQueryType, AlignItemsType>({
      propValue: props.alignItems,
      className: 'items',
    }),
    ...classNamesWithModifiers<MediaQueryType, AlignContentType>({
      propValue: props.alignContent,
      className: 'content',
    }),
    ...classNamesWithModifiers<MediaQueryType, JustifyContentType>({
      propValue: props.justifyContent,
      className: 'justify',
    }),
    ...classNamesWithModifiers<MediaQueryType, SpacingType>({
      propValue: props.gap,
      className: 'gap',
    }),
    ...classNamesWithModifiers<MediaQueryType, SpacingType>({
      propValue: props.gapX,
      className: 'gap-x',
    }),
    ...classNamesWithModifiers<MediaQueryType, SpacingType>({
      propValue: props.gapY,
      className: 'gap-y',
    })
  );
