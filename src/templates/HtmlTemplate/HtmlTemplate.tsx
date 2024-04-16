import { ResourceStore } from 'i18next';
import * as React from 'react';

import { GTM_ID } from '@/constants';
import { generateUrl } from '@/helpers/assetHelper';

export interface HtmlTemplateProps {
  lang: string;
  i18nStore: ResourceStore;
  title: string;
  content: string;
  metas?: Array<React.MetaHTMLAttributes<HTMLMetaElement>>;
  links?: Array<React.LinkHTMLAttributes<HTMLLinkElement>>;
  styles?: Array<React.StyleHTMLAttributes<HTMLStyleElement> & { text: string }>;
  scripts?: Array<React.ScriptHTMLAttributes<HTMLScriptElement> & { critical?: boolean; text?: string }>;
}

const ldJsonType = 'application/ld+json';

const renderScripts = (scripts: HtmlTemplateProps['scripts']): JSX.Element[] | undefined =>
  scripts?.map<JSX.Element>(({ text, ...script }, index) => (
    <script
      key={index}
      {...script}
      dangerouslySetInnerHTML={
        text
          ? {
              __html: text,
            }
          : undefined
      }
    />
  ));

export const HtmlTemplate: React.FC<HtmlTemplateProps> = ({
  lang,
  title,
  content,
  metas,
  links,
  styles,
  scripts,
  i18nStore,
}) => (
  <html lang={lang}>
    <head>
      <meta charSet="UTF-8" />
      <meta name="robots" content="index, follow, noarchive" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      {metas?.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      <link rel="shortcut icon" type="image/x-icon" href={generateUrl('/favicon.ico')} />
      <link rel="manifest" href={generateUrl('/web-app-manifest.json')} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Agdasima:wght@400;700&family=Montserrat:wght@100;400;500;700&display=swap"
        rel="stylesheet"
      />
      {links?.map((link, index) => (
        <link key={index} {...link} />
      ))}
      {styles?.map(({ text, ...props }, index) => (
        <style
          key={index}
          {...props}
          dangerouslySetInnerHTML={
            text
              ? {
                  __html: text,
                }
              : undefined
          }
        />
      ))}
      {renderScripts(scripts?.filter((script) => script.critical && ![ldJsonType].includes(script.type as string)))}
      <title>{title}</title>
      {renderScripts(scripts?.filter((script) => ldJsonType === (script.type as string)))}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
        }}
      />
    </head>
    <body>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
      <div
        id="root"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: [
            `window.initialLanguage = '${lang}';`,
            `window.initialI18nStore = ${JSON.stringify({ [lang]: i18nStore.data[lang] ?? {} })};`,
          ].join('\n'),
        }}
      />
      {renderScripts(scripts?.filter((script) => !script.critical && ![ldJsonType].includes(script.type as string)))}
    </body>
  </html>
);
