import { generateUrl, getPathFile } from './assetHelper';

describe('getPathFile', () => {
  vi.mock('@/constants', () => ({
    BASE_URL: '/',
  }));
  it('returns the correct path file', () => {
    const path = '/example/path/picture.png';
    const result = getPathFile(path);
    expect(result).toBe('/example/path/picture.png');
  });
});

describe('generateUrl', () => {
  vi.mock('@/constants', async () => {
    const actual = await vi.importActual<typeof import('@/constants')>('@/constants');
    return {
      ...actual,
      HOST_URL: 'https://blog.eleven-labs.com',
    };
  });
  it('returns the correct url', () => {
    const path = '/example/path/picture.png';
    const result = generateUrl(path);
    expect(result).toBe(`https://blog.eleven-labs.com/example/path/picture.png`);
  });
});
