import React from 'react';

import { Text } from '@/design-system';

import { Table } from '../Table';

export interface DesignTokenTableProps {
  title: string;
  tokenVariables: Record<string, { value: string }>;
}

export const DesignTokenTable: React.FC<DesignTokenTableProps> = ({ title, tokenVariables }) => (
  <>
    <Table
      title={title}
      columns={[
        {
          name: 'name',
          label: 'Name',
        },
        {
          name: 'value',
          label: 'Value',
        },
      ]}
      rows={Object.entries(tokenVariables).map(([tokenName, token]) => ({
        name: <Text fontWeight="medium">{tokenName}</Text>,
        value: token.value,
      }))}
    />
  </>
);
