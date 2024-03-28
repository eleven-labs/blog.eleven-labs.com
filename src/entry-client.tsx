import './styles';

import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider, initReactI18next, useSSR } from 'react-i18next';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { HeaderContainer } from '@/containers/LayoutTemplateContainer/HeaderContainer';
import { SearchPageContentContainer } from '@/containers/SearchPageContainer';

const i18n = i18next.createInstance().use(initReactI18next);

const RootBrowser: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useSSR(window.initialI18nStore, window.initialLanguage);
  return <>{children}</>;
};

const headerContainer = document.getElementById('header');
if (headerContainer) {
  i18n.init(i18nConfig);
  ReactDOM.hydrateRoot(
    headerContainer,
    <RootBrowser>
      <I18nextProvider i18n={i18n}>
        <HeaderContainer layoutTemplateData={window.layoutTemplateData} />
      </I18nextProvider>
    </RootBrowser>
  );
}

const searchPageContentContainer = document.getElementById('searchPageContent');
if (searchPageContentContainer) {
  ReactDOM.hydrateRoot(
    searchPageContentContainer,
    <RootBrowser>
      <I18nextProvider i18n={i18n}>
        <SearchPageContentContainer />
      </I18nextProvider>
    </RootBrowser>
  );
}
