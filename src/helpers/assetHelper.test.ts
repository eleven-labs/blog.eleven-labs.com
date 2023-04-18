import { BASE_URL } from '@/constants';

import { getPathFile } from './assetHelper';

describe('getPathFile', () => {
  it('returns the correct path file', () => {
    const path = '/example/path/picture.png';
    const result = getPathFile(path);
    expect(result).toBe(`${BASE_URL}example/path/picture.png`);
  });
});
