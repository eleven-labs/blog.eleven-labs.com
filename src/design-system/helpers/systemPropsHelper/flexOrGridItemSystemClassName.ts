import type { FlexOrGridItemSystemProps , AlignSelfType, MediaQueryType } from '@/design-system/types';

import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper';

export const flexOrGridItemSystemClassName = <TProps extends FlexOrGridItemSystemProps>(props: TProps): string =>
  classNamesWithModifiers<MediaQueryType, AlignSelfType>({
    propValue: props.alignSelf,
    className: 'self',
  }).join(' ');
