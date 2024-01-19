import './styles';

import i18next from 'i18next';
import mermaid from 'mermaid';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { IS_DEBUG } from '@/constants';
import { HeaderContainer } from '@/containers/LayoutTemplateContainer/HeaderContainer';
import { RootContainer } from '@/containers/RootContainer';
import { SearchPageContentContainer } from '@/containers/SearchPageContainer';

const i18n = i18next.createInstance().use(initReactI18next);

const headerContainer = document.getElementById('header');
if (headerContainer) {
  i18n.init(i18nConfig);
  if (IS_DEBUG) {
    i18n.changeLanguage(window.language);
  }
  ReactDOM.hydrateRoot(
    headerContainer,
    <RootContainer i18n={i18n}>
      <HeaderContainer layoutTemplateData={window.layoutTemplateData} />
    </RootContainer>
  );
}

const searchPageContentContainer = document.getElementById('searchPageContent');
if (searchPageContentContainer) {
  ReactDOM.hydrateRoot(
    searchPageContentContainer,
    <RootContainer i18n={i18n}>
      <SearchPageContentContainer />
    </RootContainer>
  );
}

const mermaidElements = document.getElementsByClassName('mermaid');
if (mermaidElements.length) {
  mermaid.initialize({});
  mermaid.contentLoaded();
}
