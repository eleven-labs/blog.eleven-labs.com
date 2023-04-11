import './styles';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

import { i18nConfig } from '@/config/i18n/i18n.config';
import { BackLinkContainer } from '@/containers/BackLinkContainer/BackLinkContainer';
import { CookieConsentContainer } from '@/containers/CookieConsentContainer';
import { HeaderContainer } from '@/containers/HeaderContainer';
import { PostPreviewListContainer } from '@/containers/PostPreviewListContainer';
import { RootContainer } from '@/containers/RootContainer';
import { SearchPageContainer } from '@/containers/SearchPageContainer';

const i18n = i18next.createInstance().use(LanguageDetector).use(initReactI18next);
i18n.init(i18nConfig);

const hydrateContainers = document.querySelectorAll('[partial-hydrate]');

const getPartialHydrateComponent = (componentName?: string): JSX.Element | undefined => {
  switch (componentName) {
    case 'cookie-consent-container':
      return (
        <RootContainer i18n={i18n}>
          <CookieConsentContainer />
        </RootContainer>
      );
    case 'back-link-container':
      return (
        <RootContainer i18n={i18n}>
          <BackLinkContainer />
        </RootContainer>
      );
    case 'header-container':
      return (
        <RootContainer i18n={i18n}>
          <HeaderContainer />
        </RootContainer>
      );
    case 'post-preview-container':
      return (
        <RootContainer i18n={i18n}>
          <PostPreviewListContainer allPosts={window.posts} />
        </RootContainer>
      );
    case 'search-page-container':
      return (
        <RootContainer i18n={i18n}>
          <SearchPageContainer />
        </RootContainer>
      );
  }
};
hydrateContainers.forEach((container) => {
  const componentName = container.attributes?.getNamedItem('partial-hydrate')?.value;
  const component = getPartialHydrateComponent(componentName);
  if (component) {
    ReactDOMClient.hydrateRoot(container, <React.StrictMode>{component}</React.StrictMode>);
  }
});
