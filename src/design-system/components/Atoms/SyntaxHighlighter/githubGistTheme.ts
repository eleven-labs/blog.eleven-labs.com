import type { CSSProperties } from 'react';

const COMMENT = '#969896';
const KEYWORD = '#d73a49';
const LITERAL = '#0086b3';
const NUMBER = '#005cc5';
const STRING = '#032f62';
const TEXT = '#333333';
const TITLE = '#6f42c1';
const TAG = '#63a35c';
const VARIABLE = '#df5000';

/**
 * Port of the `github-gist` highlight.js theme to the Prism token names, so that switching the
 * highlighting engine does not change the rendering.
 */
export const githubGistTheme: Record<string, CSSProperties> = {
  'pre[class*="language-"]': {
    display: 'block',
    background: 'white',
    padding: '0.5em',
    color: TEXT,
    overflowX: 'auto',
  },
  namespace: { opacity: 0.7 },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  comment: { color: COMMENT },
  prolog: { color: COMMENT },
  doctype: { color: COMMENT },
  cdata: { color: COMMENT },
  punctuation: { color: TEXT },
  delimiter: { color: TEXT },
  'attr-equals': { color: TEXT },
  operator: { color: TEXT },
  keyword: { color: KEYWORD },
  atrule: { color: KEYWORD },
  important: { color: KEYWORD },
  boolean: { color: LITERAL },
  null: { color: LITERAL },
  // `null` and the yaml keys also carry a `keyword`/`atrule` class, which would take precedence.
  'null.keyword': { color: LITERAL },
  constant: { color: LITERAL },
  symbol: { color: LITERAL },
  builtin: { color: LITERAL },
  entity: { color: LITERAL },
  url: { color: LITERAL },
  number: { color: NUMBER },
  string: { color: STRING },
  'double-quoted-string': { color: STRING },
  char: { color: STRING },
  scalar: { color: STRING },
  'attr-value': { color: STRING },
  regex: { color: STRING },
  'regex-source': { color: STRING },
  'regex-delimiter': { color: STRING },
  'attr-name': { color: TITLE },
  property: { color: TITLE },
  'property-query': { color: TITLE },
  key: { color: TITLE },
  'key.atrule': { color: TITLE },
  object: { color: TITLE },
  selector: { color: TITLE },
  function: { color: TITLE },
  'function-definition': { color: TITLE },
  'function-variable': { color: TITLE },
  'class-name': { color: TITLE },
  'class-name-definition': { color: TITLE },
  'return-type': { color: TITLE },
  'definition-query': { color: TITLE },
  'definition-mutation': { color: TITLE },
  tag: { color: TAG },
  'tag-name': { color: TAG },
  variable: { color: VARIABLE },
  'assign-left': { color: VARIABLE },
  parameter: { color: VARIABLE },
  inserted: { color: '#55a532', backgroundColor: '#eaffea' },
  deleted: { color: '#bd2c00', backgroundColor: '#ffecec' },
};
