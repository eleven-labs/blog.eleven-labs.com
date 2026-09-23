import type { SystemProps } from '@/design-system/types';

import classNames from 'classnames';

import { colorSystemClassName } from '@/design-system/helpers/systemPropsHelper/colorSystemClassName';
import { flexItemSystemClassName } from '@/design-system/helpers/systemPropsHelper/flexItemSystemClassName';
import { flexOrGridItemSystemClassName } from '@/design-system/helpers/systemPropsHelper/flexOrGridItemSystemClassName';
import { layoutSystemClassName } from '@/design-system/helpers/systemPropsHelper/layoutSystemClassName';
import { spacingSystemClassName } from '@/design-system/helpers/systemPropsHelper/spacingSystemClassName';
import { typographySystemClassName } from '@/design-system/helpers/systemPropsHelper/typographySystemClassName';

export const systemClassName = <TProps extends SystemProps = SystemProps>(props: TProps): string =>
  classNames(
    colorSystemClassName(props),
    layoutSystemClassName(props),
    spacingSystemClassName(props),
    flexOrGridItemSystemClassName(props),
    flexItemSystemClassName(props),
    typographySystemClassName(props)
  );
