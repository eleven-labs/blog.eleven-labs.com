import * as React from 'react';

import { getPathFile } from '@/helpers/assetHelper';

export interface HtmlTemplateProps {
  lang: string;
  title: string;
  content: string;
  metas?: Array<React.MetaHTMLAttributes<HTMLMetaElement>>;
  links?: Array<React.LinkHTMLAttributes<HTMLLinkElement>>;
  styles?: Array<React.StyleHTMLAttributes<HTMLStyleElement> & { text: string }>;
  scripts?: Array<React.ScriptHTMLAttributes<HTMLScriptElement> & { critical?: boolean; text?: string }>;
}

const renderScripts = (scripts: HtmlTemplateProps['scripts']): JSX.Element[] | undefined =>
  scripts?.map<JSX.Element>((script, index) => (
    <script
      key={index}
      {...script}
      dangerouslySetInnerHTML={
        script.text
          ? {
              __html: script.text,
            }
          : undefined
      }
    />
  ));

export const HtmlTemplate: React.FC<HtmlTemplateProps> = ({ lang, title, content, metas, links, styles, scripts }) => (
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
      <link rel="shortcut icon" type="image/x-icon" href={getPathFile('/favicon.ico')} />
      <link rel="manifest" href={getPathFile('/web-app-manifest.json')} />
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
      {renderScripts(scripts?.filter((script) => script.critical))}
      <title>{title}</title>
    </head>
    <body>
      <div
        id="root"
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
      {renderScripts(scripts?.filter((script) => !script.critical))}
    </body>
  </html>
);
