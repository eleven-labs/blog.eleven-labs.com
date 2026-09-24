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

  it('should render a figure with its caption', () => {
    expect(mdxToHtml('<Figure src="/imgs/schema.png" alt="Schema" caption="Source" />')).toContain(
      '<figure><img loading="lazy" decoding="async" src="/imgs/schema.png" alt="Schema"/><figcaption>Source</figcaption></figure>'
    );
  });

  it('should render a figure the same way as an image followed by a markdown caption', () => {
    const normalize = (html: string): string => html.replace(/^<div>|<\/div>$/g, '').replace(/<p><\/p>/g, '');

    expect(
      normalize(mdxToHtml('<Figure src="/imgs/schema.png?maxWidth=400" alt="Schema">*Source : [site](/fr/)*</Figure>'))
    ).toEqual(normalize(markdownToHtml('![Schema](/imgs/schema.png?maxWidth=400)\nFigure: *Source : [site](/fr/)*')));
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
