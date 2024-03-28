import {
  Box,
  ComponentPropsWithoutRef,
  Flex,
  Link,
  Reminder,
  ReminderVariantType,
  SyntaxHighlighter,
} from '@eleven-labs/design-system';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import rehypeRaw from 'rehype-raw';
import rehypeReact from 'rehype-react';
import rehypeRewrite from 'rehype-rewrite';
import rehypeSlug from 'rehype-slug';
import remarkParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { unified } from 'unified';

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

const cleanMarkdown = (content: string): string => content.replace(/\{BASE_URL}\//g, `${process.env.BASE_URL || '/'}`);

export const markdownToHtml = (content: string): string => {
  const reactComponent = unified()
    .use(remarkParse)
    .use(remarkFigurePlugin)
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
        a: ({ node, children, ...props }): React.JSX.Element => {
          const isExternalLink = (props.href as string)?.match(
            /^(?!(http(s)?:\/\/)?([^.]+)\.?eleven-labs\.com\/|^\/).*$/
          );
          if (isExternalLink) {
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
          const match = /language-(\w+)/.exec(className || '');
          if (className && className.match('mermaid')) {
            const code: string = (children as string[]).join(' ');
            return (
              <Flex as="pre" justifyContent="center" alignItems="center" className="mermaid">
                {code}
              </Flex>
            );
          }
          return match ? (
            <SyntaxHighlighter children={String(children).replace(/\n$/, '')} language={match[1]} {...props} />
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
      },
    })
    .processSync(cleanMarkdown(content)).result;

  return String(ReactDOMServer.renderToStaticMarkup(reactComponent));
};
