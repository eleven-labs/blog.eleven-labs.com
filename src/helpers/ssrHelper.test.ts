import fs from 'node:fs';

import { getHtmlTemplatePropsByManifest } from './ssrHelper';

describe('getHtmlTemplatePropsByManifest', () => {
  it('should return the correct template props', () => {
    const dirname = '/path/to/dir';
    const baseUrl = '/branch-name/';

    // Mock fs module functions
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(
      JSON.stringify({
        'src/entry-client.tsx': {
          css: ['styles.css'],
          file: 'main.js',
        },
      })
    );
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('body { background: red; }');

    const expectedProps = {
      links: [{ rel: 'stylesheet', href: '/branch-name/styles.css' }],
      styles: [{ text: 'body { background: red; }' }],
      scripts: [{ type: 'module', src: '/branch-name/main.js' }],
    };
    const result = getHtmlTemplatePropsByManifest({ dirname, baseUrl });
    expect(result).toEqual(expectedProps);
  });
});
