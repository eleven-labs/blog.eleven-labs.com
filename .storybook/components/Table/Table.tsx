import './Table.scss';

import React from 'react';

import { Box, BoxProps, Heading } from '@/design-system';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableProps<TRow = any> extends BoxProps {
  title: string;
  columns: {
    name: string;
    label: string;
  }[];
  rows: TRow[];
}

export const Table: React.FC<TableProps> = ({ title, columns, rows, ...boxProps }) => (
  <Box {...boxProps}>
    <Heading as="p" size="l" mb="xxs">
      {title}
    </Heading>
    <div
      className="storybook-table"
      style={
        {
          '--storybook-table-grid-cols': columns.length,
        } as React.CSSProperties
      }
    >
      <Box py="xs" bg="secondary" color="primary-light" className="storybook-table__head">
        {columns.map((column) => (
          <Box key={column.name} px="xxs">
            {column.label}
          </Box>
        ))}
      </Box>
      {rows.map((row, index) => (
        <Box key={index} py="s" className="storybook-table__row">
          {columns.map((column) => (
            <Box key={column.name} px="xxs">
              {row[column.name] || '-'}
            </Box>
          ))}
        </Box>
      ))}
    </div>
  </Box>
);
