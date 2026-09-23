import type { ThemeTokenValues } from '@/design-system';

import React from 'react';

import { readThemeTokens, Text } from '@/design-system';

import { Table } from '../Table';

export interface DesignTokenTableRow {
  /** Nom du jeton tel qu'on l'écrit dans une classe utilitaire, par exemple `primary` ou `xxs-2`. */
  name: string;
  /** Propriété personnalisée correspondante dans `theme.css`, dont la valeur est relue à l'écran. */
  cssVariable: string;
  preview?: React.ReactNode;
}

export interface DesignTokenTableProps {
  title?: string;
  tokens: DesignTokenTableRow[];
  /** Ajoute une colonne pour la valeur appliquée au-delà de `md`. */
  withDesktop?: boolean;
}

const emptyValues: ThemeTokenValues = { base: {}, desktop: {} };

export const DesignTokenTable: React.FC<DesignTokenTableProps> = ({ title, tokens, withDesktop = false }) => {
  // La feuille de style n'est lisible qu'une fois la page montée.
  const [values, setValues] = React.useState<ThemeTokenValues>(emptyValues);
  React.useEffect(() => setValues(readThemeTokens()), []);

  const hasPreview = tokens.some((token) => token.preview !== undefined);

  return (
    <Table
      title={title}
      columns={[
        { name: 'name', label: 'Name' },
        ...(hasPreview ? [{ name: 'preview', label: 'Preview' }] : []),
        { name: 'value', label: withDesktop ? 'Value (mobile)' : 'Value' },
        ...(withDesktop ? [{ name: 'desktopValue', label: 'Value (desktop)' }] : []),
      ]}
      rows={tokens.map((token) => ({
        name: <Text className="font-medium">{token.name}</Text>,
        preview: token.preview,
        value: values.base[token.cssVariable],
        desktopValue: values.desktop[token.cssVariable],
      }))}
    />
  );
};
