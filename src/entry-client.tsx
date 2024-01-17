import './styles';

import i18next from 'i18next';
import mermaid from 'mermaid';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { HeaderContainer } from '@/containers/LayoutTemplateContainer/HeaderContainer';
import { RootContainer } from '@/containers/RootContainer';

const i18n = i18next.createInstance().use(initReactI18next);

const headerContainer = document.getElementById('header');
if (headerContainer) {
  i18n.init(i18nConfig);
  i18n.changeLanguage(window.language);
  ReactDOM.hydrateRoot(
    headerContainer,
    <RootContainer i18n={i18n}>
      <HeaderContainer layoutTemplateData={window.layoutTemplateData} />
    </RootContainer>
  );
}

const mermaidElements = document.getElementsByClassName('mermaid');
if (mermaidElements.length) {
  mermaid.initialize({});
  mermaid.contentLoaded();
}
