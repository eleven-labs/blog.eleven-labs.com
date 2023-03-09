import { AsProps, Box, Heading, Link, Text } from '@eleven-labs/design-system';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeRewrite, { RehypeRewriteOptions } from 'rehype-rewrite';

import { Blockquote, Reminder, ReminderVariantType, SyntaxHighlighter } from '@/components';
import { Script } from '@/components/Script/Script';
import { getPathFile } from '@/helpers/assetHelper';
import { intersection } from '@/helpers/objectHelper';

export type PostContentOptions = {
  content: string;
};
export type PostContentProps = PostContentOptions;

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

export const PostContent: React.FC<PostContentProps> = ({ content, ...props }) => {
  return (
    <Box as="section" textSize="s">
      <ReactMarkdown
        rehypePlugins={[
          rehypeRaw,
          [
            rehypeRewrite,
            {
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
                      reminderVariant,
                      reminderTitle,
                    };
                  }
                }
              },
            },
          ] as [typeof rehypeRewrite, RehypeRewriteOptions],
        ]}
        children={content.replace(/{:([^}]+)}/g, '')}
        components={{
          div: ({ node, children, ...props }): JSX.Element => {
            const reminderProps = props as { reminderVariant?: ReminderVariantType; reminderTitle?: string };
            if (reminderProps?.reminderVariant && reminderProps?.reminderTitle) {
              return (
                <Reminder my="m" variant={reminderProps.reminderVariant} title={reminderProps.reminderTitle}>
                  {children}
                </Reminder>
              );
            }

            return <Box {...(props as AsProps)}>{children}</Box>;
          },
          h2: ({ children }): JSX.Element => (
            <Heading as="h2" size="l" mt={{ xs: 'l', md: 'xl' }} mb={{ xs: 'xxs', md: 'l' }}>
              {children}
            </Heading>
          ),
          h3: ({ children }): JSX.Element => (
            <Heading as="h3" size="m" mt={{ xs: 'xs', md: 'l' }} mb={{ xs: 'xxs', md: 's' }}>
              {children}
            </Heading>
          ),
          h4: ({ children }): JSX.Element => (
            <Heading as="h4" size="s" mt={{ xs: 'xs', md: 'l' }} mb={{ xs: 'xxs', md: 's' }}>
              {children}
            </Heading>
          ),
          p: ({ node, ...props }): JSX.Element => <Text as="p" mb="xxs" {...(props as AsProps)} />,
          li: ({ node, ordered, ...props }): JSX.Element => <Text as="li" mb="xxs" {...(props as AsProps)} />,
          strong: ({ children }): JSX.Element => (
            <Text as="span" fontWeight="bold">
              {children}
            </Text>
          ),
          em: ({ children }): JSX.Element => (
            <Text as="span" italic={true}>
              {children}
            </Text>
          ),
          i: ({ children }): JSX.Element => (
            <Text as="span" italic={true}>
              {children}
            </Text>
          ),
          a: ({ node, ...props }): JSX.Element => <Link {...props} style={{ overflowWrap: 'anywhere' }} />,
          blockquote: ({ node, ...props }): JSX.Element => <Blockquote {...props} />,
          pre: ({ node, ...props }): JSX.Element => <Box as="pre" textSize="xs" {...(props as AsProps)} />,
          code: ({ node, inline, className, children, ...props }): JSX.Element => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter children={String(children).replace(/\n$/, '')} language={match[1]} {...props} />
            ) : (
              <Box as="code" px="xxs-2" bg="ultra-light-grey" color="ultra-dark-grey" textSize="xs">
                {children}
              </Box>
            );
          },
          img: ({ node, ...props }): JSX.Element => {
            const src = !(props.src as string).match(/^http(s)?:\/\//) ? getPathFile(props.src as string) : props.src;
            return React.createElement('img', {
              src,
              ...props,
              style: {
                display: 'block',
                maxWidth: '100%',
                margin: 'var(--spacing-xs) auto',
              },
            });
          },
          script: ({ node, ...props }): JSX.Element => <Script {...props} />,
        }}
      />
    </Box>
  );
};
