import { fonts, FontWeightType, subsets } from '@/config/website/fonts';
import { getPathFile } from '@/helpers/assetHelper';

// Function to get numerical font weight based on the FontWeightType
const getFontWeightNumber = (fontWeight: FontWeightType): number => {
  // eslint-disable-next-line default-case
  switch (fontWeight) {
    case 'thin':
      return 100;
    case 'extra-light':
      return 200;
    case 'light':
      return 300;
    case 'regular':
      return 400;
    case 'medium':
      return 500;
    case 'semi-bold':
      return 600;
    case 'bold':
      return 700;
    case 'extra-bold':
      return 800;
    case 'black':
      return 900;
  }
  throw new Error(`This fontWeight "${fontWeight}" does not exist`);
};

const templateFontFace = (options: {
  fontFamilyName: string;
  fontPath: string;
  fontWeight: FontWeightType;
  unicodeRange: string;
  isItalic?: boolean;
}): string =>
  `@font-face {
  font-family: '${options.fontFamilyName}';
  font-style: ${options.isItalic ? 'italic' : 'normal'};
  font-weight: ${getFontWeightNumber(options.fontWeight)};
  font-display: swap;
  src: url(${getPathFile(options.fontPath)}) format('woff2');
  unicode-range: ${options.unicodeRange};
}`.replace(/\n|\s+(?!format)/g, '');

export const fontFaces = Object.entries(subsets)
  .reduce<string[]>((currentFontFaces, [subsetName, unicodeRange]) => {
    for (const font of fonts) {
      for (const style of font.styles) {
        currentFontFaces.push(
          templateFontFace({
            fontFamilyName: font.fontFamilyName,
            fontPath: `/fonts/${style.fontFileName}-${subsetName}.woff2`,
            fontWeight: style.fontWeight,
            isItalic: style.isItalic,
            unicodeRange,
          })
        );
      }
    }
    return currentFontFaces;
  }, [])
  .join('');
