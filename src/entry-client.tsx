import './styles';

import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { HeaderContainer } from '@/containers/LayoutTemplateContainer/HeaderContainer';
import { SearchPageContentContainer } from '@/containers/SearchPageContainer';

const i18n = i18next.createInstance().use(initReactI18next);
i18n.init({
  ...i18nConfig,
  lng: window.initialLanguage,
  resources: window.initialI18nStore,
});

const headerContainer = document.getElementById('header');
if (headerContainer) {
  ReactDOM.hydrateRoot(
    headerContainer,
    <I18nextProvider i18n={i18n}>
      <HeaderContainer layoutTemplateData={window.layoutTemplateData} />
    </I18nextProvider>
  );
}

const searchPageContentContainer = document.getElementById('searchPageContent');
if (searchPageContentContainer) {
  ReactDOM.hydrateRoot(
    searchPageContentContainer,
    <I18nextProvider i18n={i18n}>
      <SearchPageContentContainer />
    </I18nextProvider>
  );
}

const loadTwitterScript = (): void => {
  const script = document.createElement('script');
  script.src = 'https://platform.twitter.com/widgets.js';
  document.body.appendChild(script);
};

const loadMermaidScript = (): void => {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js';
  document.body.appendChild(script);
};

document.addEventListener('DOMContentLoaded', () => {
  const twitterTweetElements = document.getElementsByClassName('twitter-tweet');
  const mermaidElements = document.getElementsByClassName('mermaid');

  if (twitterTweetElements.length) {
    loadTwitterScript();
  }

  if (mermaidElements.length) {
    loadMermaidScript();
  }
});
