export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const camelCase = (input: string): string => {
  const words = input.split(/[_\s\-/]+/);
  const camelCaseWords = words.map((word, index) =>
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return camelCaseWords.join('');
};
