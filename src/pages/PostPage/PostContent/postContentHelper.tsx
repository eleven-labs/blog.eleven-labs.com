import { Heading, HeadingProps, Link, Text } from '@eleven-labs/design-system';
import * as HTMLReactParser from 'html-react-parser';
import parse, { HTMLReactParserOptions } from 'html-react-parser';
import MarkdownIt from 'markdown-it';
import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import githubGist from 'react-syntax-highlighter/dist/cjs/styles/hljs/github-gist';

import { Reminder, VariantReminderType } from '@/components';
import { getPathFile } from '@/helpers/assetHelper';

export const md = MarkdownIt({ html: true });

export const parseMarkdown = (content: string): ReturnType<typeof parse> =>
  parse(md.render(content), htmlReactParserOptions);

const getVariantReminderByAdmonitionValue = (variantValue: string): undefined | VariantReminderType => {
  switch (variantValue) {
    case 'note':
      return 'note';
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
  }
};

const getContent = (domNode: HTMLReactParser.DOMNode): string => {
  if (domNode instanceof HTMLReactParser.Element && domNode?.childNodes) {
    return domNode.childNodes.map((domNode) => getContent(domNode)).join();
  }

  return (domNode as HTMLReactParser.Text)?.data || '';
};

export const getReminderByDomNode = (
  domNode: HTMLReactParser.Element,
  htmlReactParserOptions: HTMLReactParserOptions
): React.ReactElement => {
  const variantValue = domNode?.attribs?.class?.replace('admonition', '').trim();
  const variant = getVariantReminderByAdmonitionValue(variantValue);

  const props = domNode.childNodes.reduce<{
    title: string;
    content: string;
  }>(
    (result, childNode) => {
      if (childNode instanceof HTMLReactParser.Element && childNode.attribs?.class?.match('admonition')) {
        result.title = getContent(childNode);
      } else {
        result.content += getContent(childNode);
      }

      return result;
    },
    { title: '', content: '' }
  );

  let content: string | JSX.Element = props.content;
  if (props.content.match(/\[([^\[\]]*)\]\((.*?)\)/gm)) {
    content = <>{parse(md.render(content), htmlReactParserOptions)}</>;
  }

  return (
    <Reminder my="m" variant={variant as VariantReminderType} title={props.title}>
      {content}
    </Reminder>
  );
};

export const getSyntaxHighlighterByDomNode = (
  domNode: HTMLReactParser.Element,
  htmlReactParserOptions: HTMLReactParserOptions
): React.ReactElement => {
  const domNodeCode = domNode.childNodes.find(
    (childNode) => childNode instanceof HTMLReactParser.Element && childNode.tagName === 'code'
  ) as HTMLReactParser.Element;
  const language = domNodeCode?.attribs?.class?.replace('language-', '');
  return (
    <SyntaxHighlighter
      language={language}
      style={githubGist}
      customStyle={{
        backgroundColor: 'var(--color-grey-ultra-light)',
        padding: 'var(--spacing-s)',
        borderRadius: '4px',
      }}
    >
      {HTMLReactParser.domToReact(domNodeCode.children, htmlReactParserOptions) as unknown as string[]}
    </SyntaxHighlighter>
  );
};

export const htmlReactParserOptions: HTMLReactParser.HTMLReactParserOptions = {
  replace: (domNode) => {
    if (domNode instanceof HTMLReactParser.Element) {
      if (domNode.attribs?.class?.match('admonition')) {
        return getReminderByDomNode(domNode, htmlReactParserOptions);
      }

      if (domNode.tagName === 'pre') {
        return getSyntaxHighlighterByDomNode(domNode, htmlReactParserOptions);
      }

      const children = HTMLReactParser.domToReact(domNode.children, htmlReactParserOptions);
      const props = HTMLReactParser.attributesToProps(domNode.attribs);

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(domNode.tagName)) {
        let headingProps: HeadingProps = {};
        switch (domNode.tagName) {
          case 'h2':
            headingProps = {
              size: 'l',
              mt: { xs: 'l', md: 'xl' },
              mb: { xs: 'xxs', md: 'l' },
            };
            break;
          case 'h3':
            headingProps = {
              size: 'm',
              mt: { xs: 'xs', md: 'l' },
              mb: { xs: 'xxs', md: 's' },
            };
            break;
          case 'h4':
            headingProps = {
              size: 's',
              mt: { xs: 'xs', md: 'l' },
              mb: { xs: 'xxs', md: 's' },
            };
            break;
        }
        return (
          <Heading {...headingProps} as={domNode.tagName as React.ElementType}>
            {children}
          </Heading>
        );
      }

      if (['p', 'li'].includes(domNode.tagName)) {
        return (
          <Text as={domNode.tagName as React.ElementType} size="s" mb="xxs">
            {children}
          </Text>
        );
      }

      if (domNode.tagName === 'strong') {
        return (
          <Text as="span" size="s" fontWeight="bold">
            {children}
          </Text>
        );
      }

      if (['em', 'i'].includes(domNode.tagName)) {
        return (
          <Text as="span" size="s" italic={true}>
            {children}
          </Text>
        );
      }

      if (domNode.tagName === 'a') {
        return <Link {...props}>{children}</Link>;
      }

      if (domNode.tagName === 'img') {
        const src = !props.src.match(/^http(s)?:\/\//) ? getPathFile(props.src) : props.src;
        return React.createElement('img', {
          ...props,
          src,
          style: {
            display: 'block',
            maxWidth: '100%',
            margin: 'var(--spacing-xs) auto',
          },
        });
      }

      if (domNode.tagName === 'script') {
        return React.createElement('script', props);
      }
    }
  },
};
