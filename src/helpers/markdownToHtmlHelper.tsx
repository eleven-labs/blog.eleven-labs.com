import type { ComponentPropsWithoutRef, ReminderVariantType } from '@/design-system';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import rehypeRewrite from 'rehype-rewrite';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';

import { Box, Flex, Link, Reminder, SyntaxHighlighter } from '@/design-system';
import { intersection } from '@/helpers/objectHelper';
import { remarkFigurePlugin } from '@/helpers/remarkPlugins/remarkFigurePlugin';

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

const cleanMarkdown = (content: string): string => content.replace(/\{BASE_URL}\//g, `${process.env.BASE_URL || '/'}`);

export const markdownToHtml = (content: string): string => {
  const reactComponent = unified()
    .use(remarkParse)
    .use(remarkFigurePlugin)
    .use(remarkGfm)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeRaw)
    .use(rehypeRewrite, {
      selector: 'div',
      rewrite: (node): void => {
        if (node.type === 'element') {
          const classNames: string[] = (node?.properties?.className as string[]) || [];
          if (node.properties?.markdown && intersection(['admonition'], classNames).length > 0) {
            const reminderVariant = getReminderVariantByAdmonitionVariant(classNames[1]);
            const titleNode = node.children.shift();
            const reminderTitle =
              titleNode?.type === 'element'
                ? titleNode?.children?.map((child) => (child.type === 'text' ? child.value : '')).join()
                : '';
            node.properties = {
              'reminder-variant': reminderVariant,
              'reminder-title': reminderTitle,
            };
          }
        }
      },
    })
    .use(rehypeRewrite, {
      selector: 'table',
      rewrite: (node): void => {
        const table = node as unknown as HastElement;
        if (!isElement(table, 'table')) {
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
      },
    })
    .use(rehypeReact, {
      createElement: React.createElement,
      Fragment: React.Fragment,
      passNode: true,
      components: {
        div: ({ node, children, ...props }): React.JSX.Element => {
          const reminderProps = props as { ['reminder-variant']?: ReminderVariantType; ['reminder-title']?: string };
          if (reminderProps?.['reminder-variant'] && reminderProps?.['reminder-title']) {
            return (
              <Reminder mb="xs" variant={reminderProps['reminder-variant']} title={reminderProps['reminder-title']}>
                {children}
              </Reminder>
            );
          }

          return <Box {...(props as ComponentPropsWithoutRef<'div'>)}>{children}</Box>;
        },
        // Wrapped so the table scrolls on itself instead of widening the whole
        // document, the way code blocks already do.
        table: ({ node, children, ...props }): React.JSX.Element => (
          <Box className="post-page__table">
            <table {...(props as ComponentPropsWithoutRef<'table'>)}>{children}</table>
          </Box>
        ),
        a: ({ node, children, ...props }): React.JSX.Element => {
          if (isExternalLink(props.href as string)) {
            props['rel'] = 'nofollow noreferrer';
            props['target'] = '_blank';
          }

          return (
            <Link as="a" {...(props as ComponentPropsWithoutRef<'a'>)} style={{ overflowWrap: 'anywhere' }}>
              {children}
            </Link>
          );
        },
        code: ({ node, className, children, ...props }): React.JSX.Element => {
          // Hyphens included, so that `language-objective-c` is not truncated to `objective`.
          const match = /language-([\w-]+)/.exec(className || '');
          const code = getTextContent(children);
          if (className && className.match('mermaid')) {
            return (
              <Flex as="pre" justifyContent="center" alignItems="center" className="mermaid">
                {code}
              </Flex>
            );
          }
          return match ? (
            <SyntaxHighlighter children={code.replace(/\n$/, '')} language={match[1]} {...props} />
          ) : (
            <Box as="code" px="xxs-2" bg="ultra-light-grey" color="ultra-dark-grey" textSize="xs">
              {children}
            </Box>
          );
        },
        img: ({ node, ...props }): React.JSX.Element => {
          const urlParams = new URLSearchParams(props.src?.split('?')?.[1] ?? '');
          return React.createElement('img', {
            ...props,
            style: {
              maxWidth: urlParams.get('maxWidth') ? `${urlParams.get('maxWidth')}px` : undefined,
              maxHeight: urlParams.get('maxHeight') ? `${urlParams.get('maxHeight')}px` : undefined,
              width: urlParams.get('width') ? `${urlParams.get('width')}px` : undefined,
              height: urlParams.get('height') ? `${urlParams.get('height')}px` : undefined,
            },
          });
        },
        script: ({ node, ...props }): React.JSX.Element | null => {
          if (props.src === 'https://platform.twitter.com/widgets.js') {
            return null;
          }
          return React.createElement('script', props);
        },
      },
    })
    .processSync(cleanMarkdown(content)).result;

  return String(ReactDOMServer.renderToStaticMarkup(reactComponent));
};
