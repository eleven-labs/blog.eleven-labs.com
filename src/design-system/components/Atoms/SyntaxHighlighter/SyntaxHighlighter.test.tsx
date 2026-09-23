import { render } from '@testing-library/react';
import React from 'react';
import refractor from 'refractor/core';

import { SyntaxHighlighter } from './SyntaxHighlighter';

/**
 * One snippet per language spelling found in the blog content, so that a grammar or an alias
 * cannot be dropped without a test turning red.
 */
const codeByLanguage: Record<string, string> = {
  bash: 'git clone https://github.com/eleven-labs/design-system.git\ncd design-system\nnpm install',
  c: '#include <stdio.h>\nint main(void) { return 0; }',
  css: '.container { display: flex; }',
  csv: 'name,count\ndesign-system,1',
  diff: '+ added line\n- removed line',
  docker: 'FROM node:20-alpine\nRUN npm ci',
  dockerfile: 'FROM node:20-alpine',
  dotenv: 'API_URL=https://eleven-labs.com',
  env: 'API_URL=https://eleven-labs.com',
  gherkin: 'Feature: Search\n  Scenario: Find an article\n    Given I am on the homepage',
  go: 'package main\n\nfunc main() { println("hello") }',
  golang: 'package main',
  graphql: 'query products {\n  products {\n    id\n    name\n  }\n}',
  hcl: 'resource "aws_s3_bucket" "b" {\n  bucket = "my-bucket"\n}',
  helm: 'replicaCount: 1',
  html: '<div class="container">Hello</div>',
  http: 'GET /api/v1/articles',
  ini: '[server]\nport = 8080',
  java: 'public class Main { public static void main(String[] a) {} }',
  javascript: 'const name = "design-system";',
  js: 'const name = "design-system";',
  json: '{ "name": "design-system" }',
  jsx: 'const App = () => <div className="app">Hello</div>;',
  lua: 'local name = "design-system"\nprint(name)',
  markdown: '# Title\n\nSome **bold** text.',
  md: '# Title',
  mdx: '# Title',
  mermaid: 'graph TD;\n  A-->B;',
  'objective-c': '@interface Foo : NSObject\n@end',
  objc: '@interface Foo : NSObject\n@end',
  objectivec: '@interface Foo : NSObject\n@end',
  php: '<?php $name = "design-system"; echo $name; ?>',
  podfile: 'pod "Alamofire", "~> 5.0"',
  powershell: 'Get-ChildItem -Path C:\\ -Recurse',
  proto: 'message Article { string title = 1; }',
  protobuf: 'message Article { string title = 1; }',
  py: 'import os\nprint(os.name)',
  python: 'import os\n\ndef main():\n    print(os.name)',
  rb: 'class Article\n  attr_reader :title\nend',
  ruby: 'class Article\n  attr_reader :title\nend',
  scss: '$color: #d73a49;\n.title { color: $color; }',
  sh: 'echo "hello" && ls -la',
  shell: 'export FOO=bar',
  sql: 'SELECT id, title FROM articles WHERE published = true;',
  swift: 'struct Article { let title: String }',
  terraform: 'resource "aws_s3_bucket" "b" {\n  bucket = "my-bucket"\n}',
  toml: '[package]\nname = "design-system"',
  ts: 'const name: string = "design-system";',
  tsx: 'const App = (): JSX.Element => <div className="app">Hello</div>;',
  twig: '{% for item in items %}{{ item.name }}{% endfor %}',
  typescript: 'interface Props { name: string }',
  uri: 'https://eleven-labs.com/articles?page=2',
  url: 'https://eleven-labs.com/articles?page=2',
  xhtml: '<p class="intro">Hello</p>',
  xml: '<link rel="stylesheet" href="style.css" />',
  yaml: 'name: design-system\nsteps:\n  - install',
  yml: 'name: design-system',
};

describe('SyntaxHighlighter', () => {
  it.each(Object.entries(codeByLanguage))('highlights the "%s" language', (language, code) => {
    const { container } = render(<SyntaxHighlighter language={language}>{code}</SyntaxHighlighter>);

    expect(container.querySelectorAll('span[style*="color"]').length).toBeGreaterThan(0);
  });

  it('does not register the languages it was not asked to', () => {
    const { container } = render(<SyntaxHighlighter language="rust">{'fn main() { let a = 1; }'}</SyntaxHighlighter>);

    expect(container.querySelectorAll('span[style*="color"]')).toHaveLength(0);
  });

  it('leaves the prism automatic browser highlighting disarmed', () => {
    // Armed, prism rewrites every `code[class*="language-"]` of the host page on DOMContentLoaded,
    // replacing the server rendered snippets with `[object Object],[object Object],…`.
    expect((Object.getPrototypeOf(refractor) as { manual: boolean }).manual).toBe(true);
  });

  it('highlights an http request line written without its version', () => {
    const { container } = render(<SyntaxHighlighter language="http">GET /api/v1/articles</SyntaxHighlighter>);

    expect(container.querySelector('.method')).toHaveTextContent('GET');
    expect(container.querySelector('.request-target')).toHaveTextContent('/api/v1/articles');
  });
});
