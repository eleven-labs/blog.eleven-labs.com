import type { TypeWithModifierType } from '@/design-system/types';

import { classNameWithModifier } from '@/design-system/helpers/systemPropsHelper';

export const classNamesWithModifiers = <
  TModifierType extends string,
  TPropValue extends string | number | boolean,
>(options: {
  className: string;
  defaultModifier?: string;
  propValue?: TPropValue | TypeWithModifierType<TModifierType, TPropValue>;
}): string[] => {
  if ((options.propValue && ['string', 'number'].includes(typeof options.propValue)) || !options.propValue) {
    const currentClassName = classNameWithModifier<TPropValue>({
      className: options.className,
      defaultModifier: options.defaultModifier || 'xs',
      propValue: options.propValue as TPropValue,
    });

    return currentClassName ? [currentClassName] : [];
  }

  return Object.entries(options.propValue as TypeWithModifierType<TModifierType, TPropValue>).reduce<string[]>(
    (currentClassNames, [modifierName, propValueByModifier]) => {
      const currentClassName = classNameWithModifier<TPropValue>({
        className: options.className,
        defaultModifier: modifierName,
        propValue: propValueByModifier as TPropValue,
      });
      if (currentClassName) {
        currentClassNames.push(currentClassName);
      }

      return currentClassNames;
    },
    []
  );
};
