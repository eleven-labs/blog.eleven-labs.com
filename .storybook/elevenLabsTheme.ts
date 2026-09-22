import { create } from '@storybook/theming';

import logoUrl from '../public/documentations/imgs/logo.svg';

export default create({
  base: 'light',
  brandTitle: 'Eleven Labs - Design System',
  brandUrl: 'https://eleven-labs.com/',
  colorPrimary: '#3767B6',
  colorSecondary: '#224579',
  barSelectedColor: '#224579',
  brandImage: logoUrl,
});
