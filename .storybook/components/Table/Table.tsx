import React from 'react';

import { Heading } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface TableProps<TRow = any> {
  title?: string;
  columns: {
    name: string;
    label: string;
  }[];
  rows: TRow[];
  className?: string;
}

export const Table: React.FC<TableProps> = ({ title, columns, rows, className }) => {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
  } as React.CSSProperties;

  return (
    <div className={cn(className)}>
      {title && (
        <Heading size="l" className="mb-xxs">
          {title}
        </Heading>
      )}
      <div>
        <div className="grid bg-secondary py-xs text-primary" style={gridStyle}>
          {columns.map((column) => (
            <div key={column.name} className="px-xxs">
              {column.label}
            </div>
          ))}
        </div>
        {rows.map((row, index) => (
          <div key={index} className="grid py-s" style={gridStyle}>
            {columns.map((column) => (
              <div key={column.name} className="px-xxs">
                {row[column.name] || '-'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
