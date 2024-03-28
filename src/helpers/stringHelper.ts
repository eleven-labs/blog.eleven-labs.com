export const capitalize = (str: string): string => `${str.charAt(0).toUpperCase()}${str.slice(1)}`;

/**
 * Slugify a string for use in URLs.
 * @param input - The input string to slugify.
 * @returns The slugified string.
 */
export const slugify = (input: string): string =>
  input
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w-]+/g, '') // Remove non-alphanumeric characters except dashes
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
