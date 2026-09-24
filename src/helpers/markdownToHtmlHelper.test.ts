import { isExternalLink, markdownToHtml } from './markdownToHtmlHelper';

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

describe('markdownToHtml', () => {
  it('should render an admonition as a reminder', () => {
    const html = markdownToHtml(
      '<div class="admonition important" markdown="1"><p class="admonition-title">Title</p>\n\nSome **text**\n</div>\n'
    );

    expect(html).toContain('class="reminder--tip');
    expect(html).toMatch(/<p class="reminder-title[^"]*">Title<\/p>/);
    expect(html).toContain('<p>Some <strong>text</strong></p>');
    expect(html).not.toContain('admonition');
  });

  it('should render an admonition whose title has another class and whose text follows it', () => {
    const html = markdownToHtml(
      '<div class="admonition note" markdown="1"><p class="admonition-note">Note</p>\nSome text\n</div>\n'
    );

    expect(html).toContain('class="reminder--note');
    expect(html).toMatch(/<p class="reminder-title[^"]*">Note<\/p>/);
    expect(html).toContain('Some text');
  });

  it('should render the admonitions along with the tables', () => {
    const html = markdownToHtml(
      [
        '<div class="admonition tip" markdown="1"><p class="admonition-title">Tip</p>',
        '',
        'Text',
        '</div>',
        '',
        '| Name |',
        '| ---- |',
        '| a    |',
      ].join('\n')
    );

    expect(html).toContain('class="reminder--tip');
    expect(html).toContain('<td data-label="Name">a</td>');
  });
});
