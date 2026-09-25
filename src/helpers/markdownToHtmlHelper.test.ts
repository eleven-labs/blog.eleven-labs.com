import { isExternalLink } from './markdownToHtmlHelper';

describe('isExternalLink', () => {
  it('should return true for external links', () => {
    const externalLinks = [
      'http://example.com',
      'https://example.com',
      'http://subdomain.example.com',
      'https://subdomain.example.com',
      'http://subdomain.example.co.uk',
      'https://subdomain.example.co.uk',
    ];
    externalLinks.forEach((link) => {
      expect(isExternalLink(link)).toBe(true);
    });
  });

  it('should return false for internal links', () => {
    const internalLinks = [
      'http://eleven-labs.com',
      'https://eleven-labs.com',
      'http://www.eleven-labs.com',
      'https://www.eleven-labs.com',
      '/path/to/page',
      '/path/to/page.html',
      '/path/to/page?query=string',
      '/path/to/page#anchor',
    ];
    internalLinks.forEach((link) => {
      expect(isExternalLink(link)).toBe(false);
    });
  });

  it('should return false for relative links', () => {
    const relativeLinks = ['path/to/page', 'path/to/page.html', 'path/to/page?query=string', 'path/to/page#anchor'];
    relativeLinks.forEach((link) => {
      expect(isExternalLink(link)).toBe(false);
    });
  });

  it('should return true for non-http(s) protocols', () => {
    const nonHttpLinks = ['mailto:test@example.com', 'tel:+1234567890'];
    nonHttpLinks.forEach((link) => {
      expect(isExternalLink(link)).toBe(true);
    });
  });
});
