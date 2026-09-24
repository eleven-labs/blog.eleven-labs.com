import { markdownToHtml, mdxToHtml } from './markdownToHtmlHelper';

describe('mdxToHtml', () => {
  it('should render the components of the design system', () => {
    const html = mdxToHtml(
      [
        '<Reminder variant="warning" title="Attention">',
        '',
        'Some **markdown**',
        '',
        '</Reminder>',
        '',
        '<Blockquote>A quote</Blockquote>',
      ].join('\n')
    );

    expect(html).toContain('class="reminder--warning');
    expect(html).toContain('<p class="reminder-title');
    expect(html).toContain('<p>Some <strong>markdown</strong></p>');
    expect(html).toMatch(/<blockquote class="[^"]+">A quote<\/blockquote>/);
  });

  it('should render a figure and a mermaid diagram', () => {
    const html = mdxToHtml(
      '<Figure src="/imgs/schema.png" alt="Schema" caption="Source" />\n\n<Mermaid chart="graph TD; A-->B" />'
    );

    expect(html).toContain(
      '<figure><img src="/imgs/schema.png" alt="Schema" loading="lazy" decoding="async"/><figcaption>Source</figcaption></figure>'
    );
    expect(html).toContain('<pre class="mermaid flex items-center justify-center">graph TD; A--&gt;B</pre>');
  });

  it('should render the markdown the same way as a markdown content', () => {
    const content = [
      '## A heading',
      '',
      'A [link](https://example.com) and `code`.',
      '',
      '| Name | Value |',
      '| ---- | ----: |',
      '| a    | 1     |',
      '',
      '```js',
      'const a = 1;',
      '```',
    ].join('\n');

    // Only the line breaks between the blocks differ, they have no effect on the rendering
    const normalize = (html: string): string => html.replace(/^<div>|<\/div>$/g, '').replace(/>\s+</g, '><');

    expect(normalize(mdxToHtml(content))).toEqual(normalize(markdownToHtml(content)));
  });

  it('should throw on a component that is not allowed', () => {
    expect(() => mdxToHtml('<Unknown />')).toThrow(/Unknown/);
  });
});
