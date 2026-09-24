import { markdownToHtml, mdxToHtml } from './markdownToHtmlHelper';

describe('mdxToHtml', () => {
  it('should render a reminder of the design system', () => {
    const html = mdxToHtml(
      ['<Reminder variant="warning" title="Attention">', '', 'Some **markdown**', '', '</Reminder>'].join('\n')
    );

    expect(html).toContain('class="reminder--warning');
    expect(html).toContain('<p class="reminder-title');
    expect(html).toContain('<p>Some <strong>markdown</strong></p>');
  });

  it('should render a figure', () => {
    expect(mdxToHtml('<Figure src="/imgs/schema.png" alt="Schema" caption="Source" />')).toContain(
      '<figure><img src="/imgs/schema.png" alt="Schema" loading="lazy" decoding="async"/><figcaption>Source</figcaption></figure>'
    );
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
      '',
      '> A **quote**',
      '> on two lines',
      '',
      '```mermaid',
      'graph TD',
      '  A[Client] --> B[API]',
      '```',
    ].join('\n');

    // Only the line breaks between the blocks differ, they have no effect on the rendering
    const normalize = (html: string): string => html.replace(/^<div>|<\/div>$/g, '').replace(/>\s+</g, '><');

    expect(normalize(mdxToHtml(content))).toEqual(normalize(markdownToHtml(content)));
  });

  it.each(['Unknown', 'Blockquote', 'SyntaxHighlighter', 'Mermaid'])(
    'should throw on the component %s that is not allowed',
    (component) => {
      expect(() => mdxToHtml(`<${component} />`)).toThrow(new RegExp(component));
    }
  );
});
