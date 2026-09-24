import { mdxToHtml } from './markdownToHtmlHelper';

const LINK_CLASS = 'class="font-semibold text-info underline hover:no-underline"';

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

  it('should render a figure with a markdown caption and a sized image', () => {
    expect(
      mdxToHtml('<Figure src="/imgs/schema.png?maxWidth=400" alt="Schema">*Source : [site](/fr/)*</Figure>')
    ).toEqual(
      '<figure><img loading="lazy" decoding="async" src="/imgs/schema.png?maxWidth=400" alt="Schema" style="max-width:400px"/>' +
        `<figcaption><em>Source : <a href="/fr/" style="overflow-wrap:anywhere" ${LINK_CLASS}>site</a></em></figcaption></figure>`
    );
  });

  it('should render the headings, links and inline code', () => {
    expect(mdxToHtml('## A heading\n\nA [link](https://example.com) and `code`.')).toEqual(
      '<h2 id="a-heading">A heading</h2>\n' +
        `<p>A <a href="https://example.com" rel="nofollow noreferrer" target="_blank" style="overflow-wrap:anywhere" ${LINK_CLASS}>link</a>` +
        ' and <code class="bg-ultra-light-grey px-xxs-2 text-xs text-ultra-dark-grey">code</code>.</p>'
    );
  });

  it('should render a table that scrolls, labels its cells and aligns its columns', () => {
    expect(mdxToHtml('| Name | Value |\n| ---- | ----: |\n| a    | 1     |')).toEqual(
      '<div class="post-content-table"><table><thead><tr><th>Name</th><th style="text-align:right">Value</th></tr></thead>' +
        '<tbody><tr><td data-label="Name">a</td><td data-label="Value" style="text-align:right">1</td></tr></tbody></table></div>'
    );
  });

  it('should render the quotes, code and mermaid diagrams written in markdown', () => {
    expect(mdxToHtml('> A **quote**')).toEqual('<blockquote>\n<p>A <strong>quote</strong></p>\n</blockquote>');
    expect(mdxToHtml('```js\nconst a = 1;\n```')).toContain('<code class="language-js"');
    expect(mdxToHtml('```mermaid\ngraph TD\n  A --> B\n```')).toContain(
      '<pre class="mermaid flex items-center justify-center">graph TD\n  A --&gt; B\n</pre>'
    );
  });

  it('should render a tweet as the card that the Twitter script replaces with the embed', () => {
    const html = mdxToHtml(
      [
        '<Tweet url="https://twitter.com/afup/status/1" author="AFUP (@afup)" date="7 octobre 2022">',
        '',
        'A **tweet** with a [link](https://t.co/a)',
        '',
        '</Tweet>',
      ].join('\n')
    );

    expect(html).toContain('<div class="flex flex-col" style="min-height:240px"><blockquote class="twitter-tweet">');
    expect(html).toContain('<span class="font-bold">AFUP</span><span class="text-grey"> @afup</span>');
    expect(html).toContain('<p>A <strong>tweet</strong> with a <a href="https://t.co/a"');
    // The Twitter script finds the tweet with the last link of the card
    expect(html).toMatch(/<a href="https:\/\/twitter.com\/afup\/status\/1">7 octobre 2022<\/a><\/p><\/blockquote>/);
  });

  it('should reserve the height of the picture of a tweet', () => {
    const html = mdxToHtml(
      [
        '<Tweet url="https://twitter.com/afup/status/1" author="AFUP (@afup)" date="7 octobre 2022">',
        '',
        'A picture [pic.twitter.com/a](https://t.co/a)',
        '',
        '</Tweet>',
      ].join('\n')
    );

    expect(html).toContain('style="min-height:calc(225px + 55cqw)"');
  });

  it.each(['Unknown', 'Blockquote', 'SyntaxHighlighter', 'Mermaid'])(
    'should throw on the component %s that is not allowed',
    (component) => {
      expect(() => mdxToHtml(`<${component} />`)).toThrow(new RegExp(component));
    }
  );
});

describe('mdxToHtml with HTML', () => {
  it('should render an HTML link the same way as a markdown one', () => {
    expect(mdxToHtml('A <a href="https://example.com">link</a> in a sentence.')).toEqual(
      `<p>A <a href="https://example.com" rel="nofollow noreferrer" target="_blank" style="overflow-wrap:anywhere" ${LINK_CLASS}>link</a> in a sentence.</p>`
    );
  });

  it('should render an HTML table the same way as a markdown one', () => {
    expect(mdxToHtml('<table><tbody><tr><td>a</td></tr></tbody></table>')).toEqual(
      '<div class="post-content-table"><table><tbody><tr><td>a</td></tr></tbody></table></div>'
    );
  });

  it('should accept the attributes written as in HTML', () => {
    expect(mdxToHtml('<span class="note" style="color: red">Red</span> text')).toEqual(
      '<p><span class="note" style="color:red">Red</span> text</p>'
    );
    expect(
      mdxToHtml('<iframe width="560" src="https://example.com/embed" frameborder="0" allowfullscreen></iframe>')
    ).toEqual('<iframe width="560" src="https://example.com/embed" frameBorder="0" allowfullscreen=""></iframe>');
  });

  it('should render an inline element on its own line as a paragraph', () => {
    expect(mdxToHtml('Text\n\n<cite>Source</cite>')).toEqual('<p>Text</p>\n<p><cite>Source</cite></p>');
  });
});
