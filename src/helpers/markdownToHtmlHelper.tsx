import type { ComponentsWithNodeOptions } from 'rehype-react/lib/complex-types';

import type { ComponentPropsWithoutRef, ReminderVariantType } from '@/design-system';

import { evaluateSync } from '@mdx-js/mdx';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import ReactDOMServer from 'react-dom/server';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

import { Link, Reminder, SyntaxHighlighter } from '@/design-system';
import { ContentImage, mdxComponents } from '@/helpers/mdxComponents';
import { remarkFigurePlugin } from '@/helpers/remarkPlugins/remarkFigurePlugin';
import {
  remarkSectionHeadingsPlugin,
  type RemarkSectionHeadingsOptions,
} from '@/helpers/remarkPlugins/remarkSectionHeadingsPlugin';

const getReminderVariantByAdmonitionVariant = (admonitionVariant: string): ReminderVariantType => {
  switch (admonitionVariant) {
    case 'abstract':
    case 'summary':
    case 'tldr':
      return 'summary';
    case 'info':
    case 'todo':
      return 'info';
    case 'tip':
    case 'hint':
    case 'important':
      return 'tip';
    case 'success':
    case 'check':
    case 'done':
      return 'success';
    case 'question':
    case 'help':
    case 'faq':
      return 'question';
    case 'warning':
    case 'caution':
    case 'attention':
      return 'warning';
    case 'failure':
    case 'fail':
    case 'missing':
      return 'failure';
    case 'danger':
    case 'error':
      return 'danger';
    case 'bug':
      return 'bug';
    case 'example':
      return 'example';
    case 'quote':
    case 'cite':
      return 'quote';
    case 'note':
    default:
      return 'note';
  }
};

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

// MDX keeps the deprecated `align` attribute of the aligned columns, where the markdown renders an inline style
const rehypeCellAlignToStyle = () => (tree: Parameters<typeof visit>[0]) => {
  visit(tree, 'element', (node: HastElement) => {
    if ((node.tagName === 'th' || node.tagName === 'td') && node.properties?.align) {
      const { align, ...properties } = node.properties;
      node.properties = { ...properties, style: `text-align:${align}` };
    }
  });
};

/**
 * Each rewrite is its own plugin: unified keeps a single entry per plugin, so a second `.use()` of a same plugin
 * overrides the options of the first one instead of adding a pass.
 */
const rehypeAdmonitions = () => (tree: Parameters<typeof visit>[0]) => {
  visit(tree, 'element', (node: HastElement) => {
    const classNames = (node.properties?.className as string[] | undefined) ?? [];
    if (node.tagName !== 'div' || !node.properties?.markdown || !classNames.includes('admonition')) {
      return;
    }

    // The title is the first element, whatever its class: `admonition-title`, or `admonition-note` in older contents
    const titleIndex = node.children.findIndex((child) => isElement(child));
    const [titleNode] = titleIndex === -1 ? [] : node.children.splice(titleIndex, 1);
    node.properties = {
      'reminder-variant': getReminderVariantByAdmonitionVariant(classNames[1]),
      'reminder-title': titleNode ? getNodeText(titleNode).trim() : '',
    };
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

// Shared by markdown and MDX contents so that the same HTML elements render the same way
const htmlComponents: NonNullable<ComponentsWithNodeOptions['components']> = {
  div: ({ node, children, ...props }): React.JSX.Element => {
    const reminderProps = props as { ['reminder-variant']?: ReminderVariantType; ['reminder-title']?: string };
    if (reminderProps?.['reminder-variant'] && reminderProps?.['reminder-title']) {
      return (
        <Reminder className="mb-xs" variant={reminderProps['reminder-variant']} title={reminderProps['reminder-title']}>
          {children}
        </Reminder>
      );
    }

    return <div {...(props as ComponentPropsWithoutRef<'div'>)}>{children}</div>;
  },
  // Wrapped so the table scrolls on itself instead of widening the whole
  // document, the way code blocks already do.
  table: ({ node, children, ...props }): React.JSX.Element => (
    <div className="post-content-table">
      <table {...(props as ComponentPropsWithoutRef<'table'>)}>{children}</table>
    </div>
  ),
  a: ({ node, children, ...props }): React.JSX.Element => {
    if (isExternalLink(props.href as string)) {
      props['rel'] = 'nofollow noreferrer';
      props['target'] = '_blank';
    }

    return (
      <Link {...(props as ComponentPropsWithoutRef<'a'>)} style={{ overflowWrap: 'anywhere' }}>
        {children}
      </Link>
    );
  },
  code: ({ node, className, children, ...props }): React.JSX.Element => {
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
  img: ({ node, ...props }): React.JSX.Element => <ContentImage {...props} />,
  script: ({ node, ...props }): React.JSX.Element | null => {
    if (props.src === 'https://platform.twitter.com/widgets.js') {
      return null;
    }
    return React.createElement('script', props);
  },
};

const cleanMarkdown = (content: string): string => content.replace(/\{BASE_URL}\//g, `${process.env.BASE_URL || '/'}`);

export type ContentFormat = 'md' | 'mdx';

export interface MarkdownToHtmlOptions {
  format?: ContentFormat;
  section?: RemarkSectionHeadingsOptions;
}

export const getContentFormat = (filePath: string): ContentFormat => (filePath.endsWith('.mdx') ? 'mdx' : 'md');

/**
 * MDX compiles the content into a React component: the raw HTML is JSX, so the admonitions and `rehype-raw`
 * have no place here, the authors use the components exposed by `mdxComponents` instead.
 */
export const mdxToHtml = (content: string, options: Omit<MarkdownToHtmlOptions, 'format'> = {}): string => {
  const { default: MdxContent } = evaluateSync(cleanMarkdown(content), {
    ...(runtime as unknown as Parameters<typeof evaluateSync>[1]),
    development: false,
    remarkPlugins: [
      ...(options.section ? [[remarkSectionHeadingsPlugin, options.section] as const] : []),
      remarkFigurePlugin,
      remarkGfm,
    ] as NonNullable<Parameters<typeof evaluateSync>[1]['remarkPlugins']>,
    rehypePlugins: [
      rehypeSlug,
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

export const markdownToHtml = (content: string, options: MarkdownToHtmlOptions = {}): string => {
  if (options.format === 'mdx') {
    return mdxToHtml(content, options);
  }

  const reactComponent = unified()
    .use(remarkParse)
    .use(options.section ? [[remarkSectionHeadingsPlugin, options.section]] : [])
    .use(remarkFigurePlugin)
    .use(remarkGfm)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeRaw)
    .use(rehypeAdmonitions)
    .use(rehypeTableCellLabels)
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      passNode: true,
      components: htmlComponents,
    })
    .processSync(cleanMarkdown(content)).result;

  return String(ReactDOMServer.renderToStaticMarkup(reactComponent));
};
