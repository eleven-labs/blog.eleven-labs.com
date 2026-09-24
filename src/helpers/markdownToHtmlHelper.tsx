import type { ComponentPropsWithoutRef } from '@/design-system';

import { evaluateSync } from '@mdx-js/mdx';
import { h } from 'hastscript';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import ReactDOMServer from 'react-dom/server';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

import { Link, SyntaxHighlighter } from '@/design-system';
import { ContentImage, mdxComponents } from '@/helpers/mdxComponents';
import {
  remarkSectionHeadingsPlugin,
  type RemarkSectionHeadingsOptions,
} from '@/helpers/remarkPlugins/remarkSectionHeadingsPlugin';

export const isExternalLink = (url: string): boolean => {
  if (!url || !/^(http(s)?:\/\/|mailto:|tel:)/.test(url)) {
    return false;
  }

  if (url.startsWith('/')) {
    return false;
  }

  return /^(?!(http(s)?:\/\/)?([^.]+)\.?eleven-labs\.com|^\/).*$/.test(url);
};

/**
 * Code fence children are not always a plain string: a nested element makes `String(children)`
 * collapse to `[object Object]`, silently replacing the snippet. Walk the tree and keep the text.
 */
const getTextContent = (children: React.ReactNode): string =>
  React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }

      return React.isValidElement<{ children?: React.ReactNode }>(child)
        ? getTextContent(child.props.children)
        : '';
    })
    .join('');

// Minimal shape of the hast nodes walked below: @types/hast is not a direct
// dependency, and only these few fields are needed.
type HastNode = { type: string };
type HastElement = {
  type: 'element';
  tagName: string;
  properties?: Record<string, unknown>;
  children: HastNode[];
};

const isElement = (node: HastNode, tagName?: string): node is HastElement =>
  node.type === 'element' && (tagName === undefined || (node as HastElement).tagName === tagName);

const getNodeText = (node: HastNode): string => {
  if (node.type === 'text') {
    return (node as HastNode & { value: string }).value;
  }
  return isElement(node) ? node.children.map(getNodeText).join('') : '';
};

const findChildElement = (node: HastElement, tagName: string): HastElement | undefined =>
  node.children.find((child): child is HastElement => isElement(child, tagName));

const getChildElements = (node: HastElement, tagName: string): HastElement[] =>
  node.children.filter((child): child is HastElement => isElement(child, tagName));

type MdxJsxElement = {
  type: 'mdxJsxFlowElement' | 'mdxJsxTextElement';
  name: string | null;
  attributes: { type: string; name?: string; value?: unknown }[];
  children: HastNode[];
  position?: { start: { line: number; offset: number }; end: { line: number; offset: number } };
};

// The HTML elements that start an HTML block in CommonMark, instead of being part of a paragraph
const HTML_BLOCK_ELEMENTS = new Set(
  (
    'address article aside base basefont blockquote body caption center col colgroup dd details dialog dir div dl dt ' +
    'fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html iframe legend li link ' +
    'main menu menuitem nav noframes ol optgroup option p param pre script search section style summary table tbody ' +
    'td textarea tfoot th thead title tr track ul'
  ).split(' ')
);

/**
 * MDX only applies the components to the elements written in markdown, not to the HTML written as JSX. The
 * lowercase JSX elements with literal attributes become plain elements, so that they render the same way as the
 * elements written in markdown: links, tables, images…
 */
const rehypeJsxElements = () => (tree: Parameters<typeof visit>[0], file: { value: unknown }) => {
  const source = String(file.value);
  visit(tree, (node: HastNode, index, parent) => {
    if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') {
      return;
    }
    const { name, attributes, children, position } = node as unknown as MdxJsxElement;
    const hasLiteralAttributes = attributes.every(
      (attribute) =>
        attribute.type === 'mdxJsxAttribute' && (attribute.value === null || typeof attribute.value === 'string')
    );
    if (!name || !/^[a-z]/.test(name) || !hasLiteralAttributes || !parent || typeof index !== 'number') {
      return;
    }

    const properties = Object.fromEntries(
      attributes.map((attribute) => [attribute.name as string, attribute.value === null ? true : attribute.value])
    );
    // A link can't contain another one: the urls of its text are autolinked by MDX, where the HTML keeps them as text
    if (name === 'a') {
      visit({ type: 'root', children } as never, 'element', (child: HastElement, childIndex, childParent) => {
        if (child.tagName === 'a' && childParent && typeof childIndex === 'number') {
          (childParent as unknown as HastElement).children.splice(childIndex, 1, ...child.children);
          return childIndex;
        }
      });
    }
    const element = h(name, properties as Record<string, string>);
    // The same children, so that the JSX elements they contain are converted as well
    element.children = children as typeof element.children;

    // As in markdown, an inline element that starts a block on its own line is a paragraph, unless it is a lone
    // self-closing tag or the item of a tight list
    const lineStart = source.lastIndexOf('\n', (position?.start.offset ?? 0) - 1) + 1;
    const previousLine = lineStart ? source.slice(source.lastIndexOf('\n', lineStart - 2) + 1, lineStart - 1) : '';
    const isInTightList =
      isElement(parent as HastNode, 'li') && !(parent as unknown as HastElement).children.some((child) => isElement(child, 'p'));
    const isInlineLine =
      node.type === 'mdxJsxFlowElement' &&
      !HTML_BLOCK_ELEMENTS.has(name) &&
      position?.start.line === position?.end.line &&
      /^[\s>]*$/.test(previousLine) &&
      !isInTightList &&
      !source.slice(position?.start.offset, position?.end.offset).trimEnd().endsWith('/>');
    (parent as unknown as HastElement).children[index] = (
      isInlineLine ? h('p', [element as never]) : element
    ) as unknown as HastNode;
  });
};

// An inline style rather than the deprecated `align` attribute of the aligned columns, which the CSS would override
const rehypeCellAlignToStyle = () => (tree: Parameters<typeof visit>[0]) => {
  visit(tree, 'element', (node: HastElement) => {
    if ((node.tagName === 'th' || node.tagName === 'td') && node.properties?.align) {
      const { align, ...properties } = node.properties;
      node.properties = { ...properties, style: `text-align:${align}` };
    }
  });
};

const rehypeTableCellLabels = () => (tree: Parameters<typeof visit>[0]) => {
  visit(tree, 'element', (table: HastElement) => {
    if (table.tagName !== 'table') {
      return;
    }
    const head = findChildElement(table, 'thead');
    const body = findChildElement(table, 'tbody');
    const headRow = head && findChildElement(head, 'tr');
    if (!headRow || !body) {
      return;
    }

    // Carried by every cell so the stacked mobile layout can label it with
    // its column header, which is hidden at that width.
    const labels = getChildElements(headRow, 'th').map((cell) => getNodeText(cell).trim());
    for (const row of getChildElements(body, 'tr')) {
      getChildElements(row, 'td').forEach((cell, index) => {
        if (labels[index]) {
          cell.properties = { ...cell.properties, 'data-label': labels[index] };
        }
      });
    }
  });
};

// The rendering of the HTML elements of the contents
const htmlComponents = {
  // Wrapped so the table scrolls on itself instead of widening the whole
  // document, the way code blocks already do.
  table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>): React.JSX.Element => (
    <div className="post-content-table">
      <table {...props}>{children}</table>
    </div>
  ),
  a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>): React.JSX.Element => {
    if (isExternalLink(props.href as string)) {
      props['rel'] = 'nofollow noreferrer';
      props['target'] = '_blank';
    }

    return (
      <Link {...props} style={{ overflowWrap: 'anywhere' }}>
        {children}
      </Link>
    );
  },
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>): React.JSX.Element => {
    // Hyphens included, so that `language-objective-c` is not truncated to `objective`.
    const match = /language-([\w-]+)/.exec(className || '');
    const code = getTextContent(children);
    if (className && className.match('mermaid')) {
      return <pre className="mermaid flex items-center justify-center">{code}</pre>;
    }
    return match ? (
      <SyntaxHighlighter children={code.replace(/\n$/, '')} language={match[1]} {...props} />
    ) : (
      <code className="bg-ultra-light-grey px-xxs-2 text-xs text-ultra-dark-grey">{children}</code>
    );
  },
  img: (props: ComponentPropsWithoutRef<'img'>): React.JSX.Element => <ContentImage {...props} />,
  script: (props: ComponentPropsWithoutRef<'script'>): React.JSX.Element | null => {
    if (props.src === 'https://platform.twitter.com/widgets.js') {
      return null;
    }
    return React.createElement('script', props);
  },
};

const cleanMarkdown = (content: string): string => content.replace(/\{BASE_URL}\//g, `${process.env.BASE_URL || '/'}`);

export interface MdxToHtmlOptions {
  section?: RemarkSectionHeadingsOptions;
}

// MDX compiles the content into a React component, rendered as static HTML
export const mdxToHtml = (content: string, options: MdxToHtmlOptions = {}): string => {
  const { default: MdxContent } = evaluateSync(cleanMarkdown(content), {
    ...(runtime as unknown as Parameters<typeof evaluateSync>[1]),
    development: false,
    remarkPlugins: [
      ...(options.section ? [[remarkSectionHeadingsPlugin, options.section] as const] : []),
      remarkGfm,
    ] as NonNullable<Parameters<typeof evaluateSync>[1]['remarkPlugins']>,
    rehypePlugins: [
      rehypeSlug,
      rehypeJsxElements,
      rehypeTableCellLabels,
      rehypeCellAlignToStyle,
    ] as NonNullable<Parameters<typeof evaluateSync>[1]['rehypePlugins']>,
  });

  return ReactDOMServer.renderToStaticMarkup(
    <MdxContent
      components={{ ...htmlComponents, ...mdxComponents } as unknown as Record<string, React.ComponentType>}
    />
  );
};
