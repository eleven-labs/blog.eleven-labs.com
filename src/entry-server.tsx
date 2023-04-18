import { createStaticHandler } from '@remix-run/router';
import { Request, Response } from 'cross-fetch';
import { createDispatcher, HoofdProvider } from 'hoofd';
import { i18n } from 'i18next';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';

import { routes } from '@/config/router';
import { BASE_URL } from '@/constants';
import { RootContainer } from '@/containers/RootContainer';
import { HtmlTemplate, HtmlTemplateProps } from '@/templates/HtmlTemplate';

export type RenderOptions = {
  request: Request;
  i18n: i18n;
} & Pick<HtmlTemplateProps, 'links' | 'styles' | 'scripts'>;

export const render = async (options: RenderOptions): Promise<string> => {
  const dispatcher = createDispatcher();
  const { query } = createStaticHandler(routes, { basename: BASE_URL });
  const context = await query(options.request);

  if (context instanceof Response) {
    throw context;
  }
  const router = createStaticRouter(routes, context);

  const content = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HoofdProvider value={dispatcher}>
        <RootContainer i18n={options.i18n}>
          <StaticRouterProvider router={router} context={context} nonce="the-nonce" />
        </RootContainer>
      </HoofdProvider>
    </React.StrictMode>
  );

  const staticPayload = dispatcher.toStatic();
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HtmlTemplate
        lang={staticPayload.lang ?? options.i18n.language}
        title={staticPayload.title ?? ''}
        content={content}
        metas={staticPayload.metas?.map(({ charset: charSet, ...meta }) => ({ charSet, ...meta }))}
        styles={options.styles}
        scripts={[
          ...(options.scripts ?? []),
          ...(staticPayload.scripts?.map(({ crossorigin: crossOrigin, ...script }) => ({ crossOrigin, ...script })) ??
            []),
        ]}
        links={[
          ...(options.links ?? []),
          ...(staticPayload.links?.map(({ crossorigin: crossOrigin, hreflang: hrefLang, ...link }) => ({
            crossOrigin,
            hrefLang,
            ...link,
          })) ?? []),
        ]}
      />
    </React.StrictMode>
  );

  return `<!DOCTYPE html>${html}`;
};
