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

/**
 * Turn an html fragment into a plain text summary usable as a meta description.
 * @param html - The html fragment to summarize.
 * @param maxLength - The maximum number of characters, the text is cut on a word boundary.
 * @returns The plain text summary, or an empty string when the fragment holds no text.
 */
export const getTextSummaryFromHtml = (html: string, maxLength: number): string => {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length <= maxLength) {
    return text;
  }

  const truncatedText = text.slice(0, maxLength);
  const lastSpaceIndex = truncatedText.lastIndexOf(' ');
  return `${truncatedText.slice(0, lastSpaceIndex > 0 ? lastSpaceIndex : maxLength).trimEnd()}…`;
};
