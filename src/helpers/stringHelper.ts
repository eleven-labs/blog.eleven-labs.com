export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

export const camelCase = (input: string): string => {
  const words = input.split(/[_\s\-/]+/);
  const camelCaseWords = words.map((word, index) =>
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return camelCaseWords.join('');
};

/**
 * Truncates the given text to the specified maximum length without cutting words,
 * and appends "..." at the end if the text is truncated.
 *
 * @param text - The original text to truncate.
 * @param maxLength - The maximum length of the truncated text.
 * @returns The truncated text.
 */
export const truncateText = (text: string, maxLength: number): string => {
  // Return the original text if it's already within the specified length
  if (text.length <= maxLength) {
    return text;
  }

  // Find the last position of a space before maxLength
  const lastSpace = text.lastIndexOf(' ', maxLength);

  // If a space is found, truncate at that position, otherwise truncate at maxLength
  const truncated = lastSpace !== -1 ? text.slice(0, lastSpace) : text.slice(0, maxLength);

  // Always append "..." to the truncated text
  return truncated + '...';
};
