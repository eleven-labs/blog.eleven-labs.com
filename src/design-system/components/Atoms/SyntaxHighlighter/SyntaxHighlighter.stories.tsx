import type { Meta, StoryFn } from '@storybook/react';

import React from 'react';

import { SyntaxHighlighter } from './SyntaxHighlighter';

export default {
  component: SyntaxHighlighter,
  args: {
    language: 'typescript',
    children: 'import React from React;',
  },
  argTypes: {
    language: {
      control: 'select',
      options: [
        'bash',
        'c',
        'css',
        'csv',
        'diff',
        'docker',
        'gherkin',
        'go',
        'graphql',
        'hcl',
        'html',
        'http',
        'ini',
        'java',
        'javascript',
        'json',
        'jsx',
        'lua',
        'markdown',
        'mermaid',
        'objectivec',
        'php',
        'powershell',
        'protobuf',
        'python',
        'ruby',
        'scss',
        'sh',
        'shell',
        'sql',
        'swift',
        'toml',
        'tsx',
        'twig',
        'typescript',
        'uri',
        'xml',
        'yaml',
      ],
    },
  },
} as Meta<typeof SyntaxHighlighter>;

const Template: StoryFn<typeof SyntaxHighlighter> = (args) => <SyntaxHighlighter {...args} />;

export const Overview = Template.bind({});

export const Bash = Template.bind({});
Bash.args = {
  language: 'bash',
  children: `git clone https://github.com/eleven-labs/design-system.git
cd design-system
npm install
npm run start:storybook`,
};

export const Python = Template.bind({});
Python.args = {
  language: 'python',
  children: `import os


def main() -> None:
    print(os.name)`,
};

export const Http = Template.bind({});
Http.args = {
  language: 'http',
  children: `GET /api/v1/articles
POST /api/v1/articles HTTP/1.1
Content-Type: application/json

{ "title": "Hello" }`,
};

export const GraphQL = Template.bind({});
GraphQL.args = {
  language: 'graphql',
  children: `query products {
  products {
    id
    name
    reviews {
      rating
    }
  }
}`,
};
