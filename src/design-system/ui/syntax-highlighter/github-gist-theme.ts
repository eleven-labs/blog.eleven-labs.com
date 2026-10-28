import type { CSSProperties } from 'react';

/** Couleurs des tokens (--color-code-*), pour que le thème suive styles/tokens.css. */
const COMMENT = 'var(--color-code-comment)';
const KEYWORD = 'var(--color-code-keyword)';
const LITERAL = 'var(--color-code-literal)';
const NUMBER = 'var(--color-code-number)';
const STRING = 'var(--color-code-string)';
const TEXT = 'var(--color-ink-soft)';
const TITLE = 'var(--color-code-title)';
const TAG = 'var(--color-code-tag)';
const VARIABLE = 'var(--color-code-variable)';

/**
 * Port of the `github-gist` highlight.js theme to the Prism token names, so that switching the
 * highlighting engine does not change the rendering.
 */
export const githubGistTheme: Record<string, CSSProperties> = {
  'pre[class*="language-"]': {
    display: 'block',
    background: 'var(--color-surface)',
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
  inserted: { color: 'var(--color-success)', backgroundColor: 'var(--color-success-soft)' },
  deleted: { color: 'var(--color-danger)', backgroundColor: 'var(--color-danger-soft)' },
};
