import { StaticPayload } from 'hoofd/dist/dispatcher';
import React from 'react';

import { getPathFile } from '@/helpers/assetHelper';

export interface HtmlTemplateProps {
  staticPayload: StaticPayload;
  content: string;
  links?: StaticPayload['links'];
  scripts?: StaticPayload['scripts'];
}

export const HtmlTemplate: React.FC<HtmlTemplateProps> = ({ staticPayload, content, links, scripts }) => (
  <html lang={staticPayload.lang}>
    <head>
      <meta charSet="UTF-8" />
      <link rel="icon" href={getPathFile('/favicon.ico')} />
      {[...(links || []), ...(staticPayload?.links || [])].map((link, index) => (
        <link key={index} {...link} />
      ))}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{staticPayload.title}</title>
    </head>
    <body>
      <div
        id="root"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      {[...(scripts || []), ...(staticPayload?.scripts || [])]
        .filter((script) => script.text)
        .map((script, index) => (
          <script key={index} dangerouslySetInnerHTML={{ __html: script.text as string }} />
        ))}
      {[...(scripts || []), ...(staticPayload?.scripts || [])]
        .filter((script) => script.type === 'module')
        .map((script, index) => (
          <script key={index} defer {...script} />
        ))}
    </body>
  </html>
);
