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

describe('mdxToHtml with HTML', () => {
  const normalize = (html: string): string => html.replace(/^<div>|<\/div>$/g, '').replace(/>\s+</g, '><');

  it.each([
    ['a link', 'A <a href="https://example.com">link</a> in a sentence.'],
    ['a table', '<table><tbody><tr><td>a</td></tr></tbody></table>'],
    ['attributes written as in HTML', '<span class="note" style="color: red">Red</span> text'],
    ['an iframe', '<iframe width="560" src="https://example.com/embed" frameborder="0" allowfullscreen></iframe>'],
    ['an inline element on its own line', 'Text\n\n<cite><a href="https://example.com">Source</a></cite>'],
  ])('should render %s the same way as the markdown', (_, content) => {
    expect(normalize(mdxToHtml(content))).toEqual(normalize(markdownToHtml(content)));
  });

  // The markdown renders an empty link followed by an autolinked one
  it('should render a link whose text is an url as a single link', () => {
    const html = mdxToHtml('A <a href="https://example.com">https://example.com</a> link');

    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('>https://example.com</a>');
  });
});
