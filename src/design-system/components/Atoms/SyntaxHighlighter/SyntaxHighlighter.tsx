import type { SyntaxHighlighterProps as SyntaxHighlighterBaseProps } from 'react-syntax-highlighter';

import type { MarginSystemProps } from '@/design-system/types';

import React from 'react';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import csv from 'react-syntax-highlighter/dist/esm/languages/prism/csv';
import diff from 'react-syntax-highlighter/dist/esm/languages/prism/diff';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import gherkin from 'react-syntax-highlighter/dist/esm/languages/prism/gherkin';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import ini from 'react-syntax-highlighter/dist/esm/languages/prism/ini';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import lua from 'react-syntax-highlighter/dist/esm/languages/prism/lua';
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown';
import mermaid from 'react-syntax-highlighter/dist/esm/languages/prism/mermaid';
import objectivec from 'react-syntax-highlighter/dist/esm/languages/prism/objectivec';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import protobuf from 'react-syntax-highlighter/dist/esm/languages/prism/protobuf';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import swift from 'react-syntax-highlighter/dist/esm/languages/prism/swift';
import toml from 'react-syntax-highlighter/dist/esm/languages/prism/toml';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import twig from 'react-syntax-highlighter/dist/esm/languages/prism/twig';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import uri from 'react-syntax-highlighter/dist/esm/languages/prism/uri';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import SyntaxHighlighterBase from 'react-syntax-highlighter/dist/esm/prism-light';

import { githubGistTheme } from './githubGistTheme';
import { httpLanguage } from './httpLanguage';

import './disablePrismAutoHighlight';

export type SyntaxHighlighterProps = MarginSystemProps & Pick<SyntaxHighlighterBaseProps, 'language' | 'children'>;

/**
 * `PrismLight` is imported from its own entry point rather than from the package index, which pulls
 * in every prism and highlight.js grammar: that would bloat the bundle and register the languages
 * before we get a chance to extend them.
 *
 * `css`, `javascript` and `markup` (with its `html` and `xml` aliases) come with the prism core.
 * Each grammar also declares its own aliases, hence `shell`, `js`, `ts`, `yml`, `md`, `py`, `rb`,
 * `objc` and `dockerfile` being supported without being listed here.
 */
const languages = {
  bash,
  c,
  csv,
  diff,
  docker,
  gherkin,
  go,
  graphql,
  hcl,
  http: httpLanguage,
  ini,
  java,
  json,
  jsx,
  lua,
  markdown,
  mermaid,
  objectivec,
  php,
  powershell,
  protobuf,
  python,
  ruby,
  scss,
  sql,
  swift,
  toml,
  tsx,
  twig,
  typescript,
  uri,
  yaml,
};

// Spellings used in our content that prism does not declare itself.
const aliases = {
  bash: ['sh', 'env', 'dotenv'],
  go: ['golang'],
  hcl: ['terraform'],
  markdown: ['mdx'],
  markup: ['xhtml'],
  objectivec: ['objective-c'],
  protobuf: ['proto'],
  ruby: ['podfile'],
  yaml: ['helm'],
};

for (const [name, language] of Object.entries(languages)) {
  SyntaxHighlighterBase.registerLanguage(name, language);
}

for (const [name, names] of Object.entries(aliases)) {
  // `alias` exists on PrismLight at runtime but is missing from @types/react-syntax-highlighter.
  (SyntaxHighlighterBase as unknown as { alias(name: string, aliases: string[]): void }).alias(name, names);
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ language, children, ...props }) => (
  <SyntaxHighlighterBase
    {...props}
    language={language}
    style={githubGistTheme}
    customStyle={{
      padding: 'var(--spacing-s)',
      borderRadius: '4px',
    }}
    PreTag="div"
  >
    {children}
  </SyntaxHighlighterBase>
);
