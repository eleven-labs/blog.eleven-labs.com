import { vi } from 'vitest';

import { getHtmlTemplatePropsByManifest } from './ssrHelper';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn().mockImplementation((path: string) => {
    if (path === '/path/to/dir/manifest.json') {
      return JSON.stringify({
        'src/entry-client.tsx': {
          css: ['styles.css'],
          file: 'main.js',
        },
      });
    }
    if (path === '/path/to/dir/styles.css') {
      return 'body { background: red; }';
    }
  }),
}));

describe('getHtmlTemplatePropsByManifest', () => {
  it('should return the correct template props', () => {
    const dirname = '/path/to/dir';
    const baseUrl = '/branch-name/';

    const expectedProps = {
      links: [{ rel: 'stylesheet', href: '/branch-name/styles.css' }],
      styles: [{ text: 'body { background: red; }' }],
      scripts: [{ type: 'module', src: '/branch-name/main.js' }],
    };
    const result = getHtmlTemplatePropsByManifest({ dirname, baseUrl });
    expect(result).toEqual(expectedProps);
  });
});
