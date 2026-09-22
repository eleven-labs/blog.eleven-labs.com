import type { MediaQueryType, SpacingSystemProps, SpacingType } from '@/design-system/types';

import classNames from 'classnames';

import { spacingSystemProps } from '@/design-system/constants';
import { classNamesWithModifiers } from '@/design-system/helpers/systemPropsHelper';

export const spacingSystemClassName = <TProps extends SpacingSystemProps>(props: TProps): string =>
  classNames(
    Object.entries(props)
      .filter(([propName]) => Object.keys(spacingSystemProps).includes(propName))
      .reduce<string[]>((currentClassNames, [propName, propValue]) => {
        currentClassNames.push(
          ...classNamesWithModifiers<MediaQueryType, SpacingType>({
            className: propName,
            propValue,
          })
        );

        return currentClassNames;
      }, [])
  );
