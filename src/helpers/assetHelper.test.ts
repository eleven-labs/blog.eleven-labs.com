import type * as ConstantsModule from '@/constants';

import { generateUrl, getPathFile } from './assetHelper';

vi.mock('@/constants', async () => {
  const actual = await vi.importActual<typeof ConstantsModule>('@/constants');
  return {
    ...actual,
    BASE_URL: '/',
    HOST_URL: 'https://blog.eleven-labs.com',
  };
});

describe('getPathFile', () => {
  it('returns the correct path file', () => {
    const path = '/example/path/picture.png';
    const result = getPathFile(path);
    expect(result).toBe('/example/path/picture.png');
  });
});

describe('generateUrl', () => {
  it('returns the correct url', () => {
    const path = '/example/path/picture.png';
    const result = generateUrl(path);
    expect(result).toBe(`https://blog.eleven-labs.com/example/path/picture.png`);
  });
});
