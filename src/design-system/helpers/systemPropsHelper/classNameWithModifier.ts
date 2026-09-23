import { kebabCase } from '@/design-system/helpers/stringHelper';

export const classNameWithModifier = <TPropValue extends string | number | boolean>(options: {
  className: string;
  defaultModifier: string;
  propValue?: TPropValue;
}): string | undefined => {
  if (options.propValue === undefined) {
    return undefined;
  }

  if (typeof options.propValue !== 'boolean') {
    const propValue = kebabCase(
      typeof options.propValue === 'number' ? options.propValue.toString() : options.propValue
    );

    return `${options.className}-${propValue}@${options.defaultModifier}`;
  }

  return `${options.className}@${options.defaultModifier}`;
};
