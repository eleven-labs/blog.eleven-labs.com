import { StaticPayload } from 'hoofd/dist/dispatcher';
import React from 'react';

import { googleSiteVerificationKey, themeColor } from '@/config/website';
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
      <meta name="robots" content="index, follow, noarchive" />
      <meta name="google-site-verification" content={googleSiteVerificationKey} />

      {/* SEO */}
      {staticPayload?.metas?.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      {[...(scripts || []), ...(staticPayload?.scripts || [])]
        .filter((script) => script.type === 'application/ld+json' && script.text)
        .map((script, index) => (
          <script key={index} type={script.type} dangerouslySetInnerHTML={{ __html: script.text as string }} />
        ))}

      {/* Allow installing the app to the homescreen */}
      <link rel="manifest" href={getPathFile('/manifest.json')} />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* iOS home screen icons */}
      <meta name="apple-mobile-web-app-title" content="Blog Eleven Labs" />
      {[
        { sizes: '120x120', path: '/imgs/icons/apple-icon-120x120.png' },
        { sizes: '120x120', path: '/imgs/icons/apple-icon-152x152.png' },
        { sizes: '120x120', path: '/imgs/icons/apple-icon-180x180.png' },
      ].map((appleTouchIcon, index) => (
        <link key={index} rel="apple-touch-icon" sizes={appleTouchIcon.sizes} href={getPathFile(appleTouchIcon.path)} />
      ))}
      <meta name="theme-color" content={themeColor} />
      <link rel="shortcut icon" type="image/x-icon" href={getPathFile('/favicon.ico')} />

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
        .filter((script) => script.type !== 'application/ld+json' && script.text)
        .map((script, index) => (
          <script key={index} type={script.type} dangerouslySetInnerHTML={{ __html: script.text as string }} />
        ))}
      {[...(scripts || []), ...(staticPayload?.scripts || [])]
        .filter((script) => script.type === 'module')
        .map((script, index) => (
          <script key={index} defer {...script} />
        ))}
    </body>
  </html>
);
