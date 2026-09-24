/**
 * Converts the markdown contents to MDX (#1261).
 *
 * `--check` converts in memory and compares the HTML of each content before and after, `--write` also renames the
 * files and writes their converted content. Only the syntaxes that MDX doesn't support are rewritten, the rest of
 * the content is kept as is.
 *
 * The HTML differs where the markdown rendered the content wrongly: markdown shown raw after an HTML line, figure
 * captions cut, `<placeholder>` taken for elements… Each of these differences has been reviewed, a content that
 * doesn't compile is not written.
 */
import type { Node, Parent } from 'unist';

import { globSync } from 'glob';
import { execFileSync } from 'node:child_process';
import { writeFileSync , readFileSync } from 'node:fs';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';

import { getReminderVariantByAdmonitionVariant, markdownToHtml, mdxToHtml } from '@/helpers/markdownToHtmlHelper';

type PositionedNode = Node & {
  position: { start: { offset: number; column: number }; end: { offset: number } };
  value?: string;
  url?: string;
  alt?: string;
  children?: PositionedNode[];
};

interface Edit {
  start: number;
  end: number;
  text: string;
}

const VOID_ELEMENTS = 'area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr';

// The content of these elements is raw text, MDX would parse it as markdown: it becomes a string, escaped the same way
export const htmlToJsx = (html: string): string => {
  const rawElements = /<(iframe|script|style)(\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi;
  let jsx = '';
  let lastIndex = 0;
  for (const match of html.matchAll(rawElements)) {
    const [element, name, attributes = '', content] = match;
    jsx +=
      htmlFragmentToJsx(html.slice(lastIndex, match.index)) +
      (content.trim()
        ? `${htmlFragmentToJsx(`<${name}${attributes}>`)}{${JSON.stringify(content)}}</${name}>`
        : htmlFragmentToJsx(element));
    lastIndex = (match.index ?? 0) + element.length;
  }

  return jsx + htmlFragmentToJsx(html.slice(lastIndex));
};

const HTML_ELEMENTS = new Set(
  (
    'a abbr address area article aside audio b bdi bdo big blockquote br button canvas caption center cite code col ' +
    'colgroup data dd del details dfn dialog div dl dt em embed figcaption figure font footer form h1 h2 h3 h4 h5 h6 ' +
    'header hr i iframe img input ins kbd label legend li link main mark meta nav noscript object ol option p param ' +
    'picture pre q s samp script section select small source span strike strong style sub summary sup table tbody td ' +
    'textarea tfoot th thead time tr track tt u ul var video wbr'
  ).split(' ')
);

// A line made of an element, then of the closing tag of a block opened before: MDX can't close this block within the
// paragraph of the element, the closing tag goes on its own line
const BLOCK_CLOSING_TAG = /^([ \t]*<([a-zA-Z]+)[\s>].*<\/\2>)[ \t]*(<\/(?:blockquote|center|details|div|figure|ol|section|table|ul)>)[ \t]*$/gm;

// The same for the opening tag of a block followed by an element, when the block is closed on a next line
const BLOCK_OPENING_TAG = /^([ \t]*<(blockquote|center|details|div|figure|ol|section|table|ul)(?:\s[^>]*)?>)[ \t]*(<.*)$/gm;

// MDX has no indented code, so an indented fence of the code closes it: the fence gets longer than any of them
const fenceFor = (code: string, fence = '```'): string => {
  const longest = Math.max(
    0,
    ...code.split('\n').map((line) => line.match(new RegExp(`^\\s*(\\${fence[0]}{3,})\\s*$`))?.[1].length ?? 0)
  );
  return longest >= fence.length ? fence[0].repeat(longest + 1) : fence;
};

const jsxAttribute = (name: string, value: string): string =>
  value.includes('"') ? `${name}={${JSON.stringify(value)}}` : `${name}="${value}"`;

const applyEdits = (source: string, edits: Edit[]): string =>
  [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce((text, edit) => text.slice(0, edit.start) + edit.text + text.slice(edit.end), source);

// The HTML becomes JSX: void elements closed, unquoted attributes quoted, comments and braces of the text escaped
const htmlFragmentToJsx = (html: string): string =>
  html
    .replace(/<!--([\s\S]*?)-->/g, (_, comment: string) => `{/*${comment.replace(/\*\//g, '* /')}*/}`)
    // The browsers read `</br>` as a line break, and ignore the closing tag of the other void elements
    .replace(/<\/br\s*>/gi, '<br />')
    .replace(/<\/(?:hr|img|source)\s*>/gi, '')
    .replace(/(<[a-zA-Z][^<>]*?)\s(\w[\w-]*)=([^\s"'<>]+)(?=[\s/>])/g, '$1 $2="$3"')
    .replace(new RegExp(`<(${VOID_ELEMENTS})(\\s[^<>]*?)?\\s*/?>`, 'gi'), (_, tag: string, attributes = '') =>
      `<${tag.toLowerCase()}${attributes.replace(/\s+$/, '')} />`
    )
    .replace(/(^|>)([^<]*)/g, (_, before: string, text: string) =>
      before + text.replace(/\{(?!\/\*)/g, '&#123;').replace(/(?<!\*\/)\}/g, '&#125;')
    );

/**
 * `<div class="admonition tip" markdown="1"><p class="admonition-title">Title</p> … </div>` becomes a Reminder,
 * rendered the same way.
 */
export const convertAdmonitions = (source: string): string => {
  const opening = /<div\s+class="admonition\s+([\w-]+)"\s+markdown="1"\s*>\s*<p\s+class="admonition-[\w-]+"\s*>([\s\S]*?)<\/p>/g;
  let result = '';
  let lastIndex = 0;
  for (let match = opening.exec(source); match; match = opening.exec(source)) {
    // The closing tag is the one that balances the opening div
    const tags = /<div[\s>]|<\/div\s*>/g;
    tags.lastIndex = match.index + match[0].length;
    let depth = 1;
    let closing: RegExpExecArray | null = null;
    while (depth > 0 && (closing = tags.exec(source))) {
      depth += closing[0].startsWith('</') ? -1 : 1;
    }
    if (!closing) {
      throw new Error(`Unclosed admonition: ${match[0]}`);
    }
    const title = match[2].replace(/\s+/g, ' ').trim();
    const body = source.slice(match.index + match[0].length, closing.index).replace(/^[ \t]*\n/, '').trimEnd();
    result +=
      source.slice(lastIndex, match.index) +
      `<Reminder ${jsxAttribute('variant', getReminderVariantByAdmonitionVariant(match[1]))} ${jsxAttribute(
        'title',
        title
      )}>\n\n${body}\n\n</Reminder>`;
    lastIndex = closing.index + closing[0].length;
    opening.lastIndex = lastIndex;
  }

  return result + source.slice(lastIndex);
};

export const convertMarkdownToMdx = (markdown: string): string => {
  // An emphasis around a block: the markdown renders the block emphasized, MDX the emphasis around the block
  const source = convertAdmonitions(markdown).replace(/([*_])<center>([\s\S]*?)<\/center>\1/g, '<center>$1$2$1</center>');
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source) as unknown as PositionedNode;
  const edits: Edit[] = [];
  const sourceOf = (node: PositionedNode): string => source.slice(node.position.start.offset, node.position.end.offset);
  const edit = (node: PositionedNode, text: string): void => {
    edits.push({ start: node.position.start.offset, end: node.position.end.offset, text });
  };

  visit(tree, (node: PositionedNode, _index, parent: Parent | null) => {
    if (!node.position) {
      return;
    }

    // An image followed by a `Figure:` line becomes a Figure, its caption being the rest of the paragraph
    const [image, caption] = node.children ?? [];
    if (node.type === 'paragraph' && image?.type === 'image' && caption?.value?.trim().startsWith('Figure:')) {
      const captionStart = source.indexOf('Figure:', caption.position.start.offset) + 'Figure:'.length;
      const captionSource = source.slice(captionStart, node.position.end.offset).trim();
      edit(
        node,
        `<Figure ${jsxAttribute('src', image.url ?? '')} ${jsxAttribute('alt', image.alt ?? '')}>${convertMarkdownToMdx(
          captionSource
        ).trim()}</Figure>`
      );
      return SKIP;
    }

    const nodeSource = sourceOf(node);
    switch (node.type) {
      case 'html': {
        if (/^<\/?(Reminder|Figure)\b/.test(nodeSource)) {
          return SKIP;
        }
        const tag = nodeSource.match(/^<(\/?)([a-zA-Z][\w-]*)[\s/>]/);
        if (parent?.type === 'paragraph' && tag) {
          // A placeholder such as `<ip>` in a sentence is text, not an element
          if (!tag[1] && !HTML_ELEMENTS.has(tag[2].toLowerCase())) {
            edit(node, `\\${nodeSource}`);
            return SKIP;
          }
          // A closing tag without its opening one is ignored by the markdown
          const siblings = (parent.children as PositionedNode[]).slice(0, parent.children.indexOf(node));
          const openings = siblings.filter((sibling) => sibling.type === 'html' && new RegExp(`^<${tag[2]}[\\s>]`, 'i').test(sibling.value ?? ''));
          const closings = siblings.filter((sibling) => sibling.type === 'html' && new RegExp(`^</${tag[2]}>`, 'i').test(sibling.value ?? ''));
          if (tag[1] && tag[2].toLowerCase() !== 'br' && openings.length <= closings.length) {
            edit(node, '');
            return SKIP;
          }
          // Line breaks alone on the next line of a paragraph: MDX would take them out of it, they join the line before
          const line = source.slice(node.position.start.offset).split('\n')[0];
          if (node.position.start.column === 1 && /^(\s*<\/?br\s*\/?>)+\s*$/i.test(line) && source[node.position.start.offset - 1] === '\n') {
            edits.push({ start: node.position.start.offset - 1, end: node.position.end.offset, text: htmlToJsx(nodeSource) });
            return SKIP;
          }
        }
        // An HTML block interrupts the paragraph it follows, MDX would make it a part of this paragraph
        const siblings = (parent?.children ?? []) as PositionedNode[];
        const previous = siblings[siblings.indexOf(node) - 1];
        const jsx =
          (parent?.type !== 'paragraph' && previous?.position.end.line === node.position.start.line - 1 ? '\n' : '') +
          htmlToJsx(nodeSource);
        edit(
          node,
          parent?.type === 'paragraph'
            ? jsx
            : jsx.replace(BLOCK_CLOSING_TAG, '$1\n$3').replace(BLOCK_OPENING_TAG, (line, opening: string, name: string, rest: string) =>
                line.includes(`</${name}>`) ? line : `${opening}\n${rest}`
              )
        );
        return SKIP;
      }
      case 'link':
        // MDX has no autolink: `<https://…>`
        if (nodeSource.startsWith('<')) {
          const text = nodeSource.slice(1, -1);
          edit(node, `[${text}](${node.url})`);
          return SKIP;
        }
        return;
      case 'code': {
        const fence = nodeSource.match(/^(`{3,}|~{3,})/)?.[1];
        // MDX has no indented code
        if (!fence) {
          const indent = ' '.repeat(node.position.start.column - 1);
          const codeFence = fenceFor(node.value ?? '');
          const lines = [codeFence, ...(node.value ?? '').split('\n'), codeFence];
          edit(node, lines.map((line, index) => (index === 0 || !line ? line : indent + line)).join('\n'));
        } else if (fenceFor(node.value ?? '', fence) !== fence) {
          const codeFence = fenceFor(node.value ?? '', fence);
          const lines = nodeSource.split('\n');
          lines[0] = lines[0].replace(fence, codeFence);
          if (lines.length > 1 && /^\s*(`{3,}|~{3,})\s*$/.test(lines[lines.length - 1])) {
            lines[lines.length - 1] = lines[lines.length - 1].replace(/[`~]{3,}/, codeFence);
          }
          edit(node, lines.join('\n'));
        }
        return SKIP;
      }
      case 'text':
        if (/[{}<]/.test(nodeSource) && parent?.type !== 'link') {
          // `{BASE_URL}` is replaced before the compilation
          edit(node, nodeSource.replace(/(?<!\\)(?!\{BASE_URL\})([{<])|(?<!\{BASE_URL)(?<!\\)(\})/g, '\\$1$2'));
        }
        return;
    }
  });

  return applyEdits(source, edits);
};

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

// Invisible differences: the whitespace between the blocks or before a line break, and the empty paragraphs the
// markdown leaves around a block
const normalizeHtml = (html: string): string =>
  html
    .replace(/<p>(<em><\/em>)?<\/p>/g, '')
    .replace(/\s+(<br\/>)/g, '$1')
    .replace(/>\s+</g, '><')
    .trim();

if (process.argv[1]?.endsWith('migrateContentsToMdx.ts')) {
  const filePaths = globSync(['_articles/**/*.md', '_tutorials/**/*.md', '_authors/**/*.md']).sort();
  const mode = process.argv[2];
  const only = process.argv[3];
  let differences = 0;
  let errors = 0;

  for (const filePath of filePaths.filter((path) => !only || path.includes(only))) {
    const markdown = readFileSync(filePath, 'utf-8');
    const frontmatter = markdown.match(FRONTMATTER)?.[0] ?? '';
    const content = markdown.slice(frontmatter.length);
    const mdx = convertMarkdownToMdx(content);

    try {
      // The markdown wraps its blocks in a div, MDX doesn't
      const before = normalizeHtml(markdownToHtml(content).replace(/^<div>([\s\S]*)<\/div>$/, '$1'));
      const after = normalizeHtml(mdxToHtml(mdx));
      if (before !== after) {
        differences++;
        let index = 0;
        while (index < before.length && before[index] === after[index]) {
          index++;
        }
        console.log(
          `DIFF ${filePath}\n  md : ${JSON.stringify(before.slice(index - 60, index + 100))}\n  mdx: ${JSON.stringify(
            after.slice(index - 60, index + 100)
          )}`
        );
      }
    } catch (error) {
      errors++;
      const { reason, line, column, message } = error as Error & { reason?: string; line?: number; column?: number };
      const errorLine = line ? mdx.split('\n')[line - 1] : '';
      console.log(`ERROR ${filePath}:${line}:${column} ${reason ?? message}\n  ${errorLine?.slice(0, 200)}`);
      continue;
    }

    if (mode === '--write') {
      const mdxFilePath = filePath.replace(/\.md$/, '.mdx');
      execFileSync('git', ['mv', filePath, mdxFilePath]);
      writeFileSync(mdxFilePath, frontmatter + mdx);
    }
  }

  console.log(`${filePaths.length} contents: ${differences} render differently, ${errors} don't compile`);
}
