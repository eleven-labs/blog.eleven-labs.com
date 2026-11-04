import type { Meta, StoryObj } from '@storybook/react-vite';

import { SyntaxHighlighter } from './syntax-highlighter';

const meta = {
  title: 'UI/Display/SyntaxHighlighter',
  component: SyntaxHighlighter,
  args: {
    language: 'typescript',
    children: "import { Button } from '@/design-system/ui/button';",
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
} satisfies Meta<typeof SyntaxHighlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bash: Story = {
  args: {
    language: 'bash',
    children: `git clone https://github.com/eleven-labs/blog.eleven-labs.com.git
cd blog.eleven-labs.com
pnpm install
pnpm start:storybook`,
  },
};

export const Python: Story = {
  args: {
    language: 'python',
    children: `import os


def main() -> None:
    print(os.name)`,
  },
};

export const Http: Story = {
  args: {
    language: 'http',
    children: `GET /api/v1/articles
POST /api/v1/articles HTTP/1.1
Content-Type: application/json

{ "title": "Bonjour" }`,
  },
};

export const GraphQL: Story = {
  args: {
    language: 'graphql',
    children: `query articles {
  articles {
    id
    title
    author {
      name
    }
  }
}`,
  },
};
