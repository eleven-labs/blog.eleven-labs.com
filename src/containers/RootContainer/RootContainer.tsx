import { useLang, useTitleTemplate } from 'hoofd';
import { i18n } from 'i18next';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

export const RootContainer: React.FC<{ i18n: i18n; children: React.ReactNode }> = ({ i18n, children }) => {
  useLang(i18n.language);
  useTitleTemplate('Blog Eleven Labs - %s');

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
