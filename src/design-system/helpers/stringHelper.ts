export const kebabCase = (string_: string): string =>
  string_
    .replaceAll(/([a-z])([A-Z])/g, '$1-$2')
    .replaceAll(/[\s_]+/g, '-')
    .toLowerCase();

export const pascalCase = (string_: string): string =>
  (string_.match(/[\dA-Za-z]+/g) || []).map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('');

export const capitalize = (string_: string): string => `${string_.charAt(0).toUpperCase()}${string_.slice(1)}`;
