import './styles';

import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { routes } from '@/config/router';
import { BASE_URL } from '@/constants';
import { RootContainer } from '@/containers/RootContainer';

const container = document.getElementById('root');
const i18n = i18next.createInstance().use(initReactI18next);
const router = createBrowserRouter(routes, { basename: BASE_URL });

if (container) {
  i18n.init(i18nConfig);
  i18n.changeLanguage(window.language);
  ReactDOM.hydrateRoot(
    container,
    <RootContainer i18n={i18n}>
      <RouterProvider router={router} />
    </RootContainer>
  );
}

if (import.meta.hot) {
  import.meta.hot.on('markdown-update', () => {
    window.location.reload();
  });
}
