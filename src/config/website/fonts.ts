// Define the type for font weight
export type FontWeightType =
  | 'thin'
  | 'extra-light'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semi-bold'
  | 'bold'
  | 'extra-bold'
  | 'black';

export const fonts: {
  fontFamilyName: string;
  fontFamily: string;
  fontDirectoryName: string;
  styles: {
    fontFileName: string;
    fontWeight: FontWeightType;
    isItalic?: boolean;
    isPreload?: boolean;
  }[];
}[] = [
  {
    fontFamilyName: 'Montserrat',
    fontFamily: 'Montserrat, helvetica neue, helvetica, arial, sans-serif',
    fontDirectoryName: 'montserrat',
    styles: [
      {
        fontFileName: 'montserrat-regular',
        fontWeight: 'regular',
      },
      {
        fontFileName: 'montserrat-medium',
        fontWeight: 'medium',
      },
      {
        fontFileName: 'montserrat-semi-bold',
        fontWeight: 'semi-bold',
      },
    ],
  },
  {
    fontFamilyName: 'Agdasima',
    fontFamily: 'Agdasima',
    fontDirectoryName: 'agdasima',
    styles: [
      {
        fontFileName: 'agdasima-regular',
        fontWeight: 'regular',
      },
      {
        fontFileName: 'agdasima-bold',
        fontWeight: 'bold',
      },
    ],
  },
];

// Define subsets for different languages
// Keep this order, because the one in first position will be used for the preload
export const subsets: Record<string, string> = {
  latin:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  'latin-ext':
    'U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
};
