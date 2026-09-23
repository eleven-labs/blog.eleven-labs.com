import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';

interface RequestLineGrammar {
  pattern: RegExp;
  inside: Record<string, { pattern: RegExp }>;
}

interface PrismLike {
  languages: Record<string, Record<string, RequestLineGrammar>>;
}

/**
 * The upstream `request-line` grammar requires the HTTP version, so the short form used in API
 * documentation (`GET /api/v1/articles`) is left untokenized. This wrapper registers the official
 * grammar, then makes that suffix optional.
 */
export const httpLanguage = Object.assign(
  (prism: PrismLike): void => {
    http(prism);

    const requestLine = prism.languages.http['request-line'];
    requestLine.pattern =
      /^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*(?:\sHTTP\/[\d.]+)?/m;
    requestLine.inside['request-target'].pattern = /^(\s)(?:https?:\/\/|\/)\S*(?=\s|$)/;
  },
  { displayName: 'http', aliases: [] as string[] }
);
