import * as React from 'react';

/** Une case de la pagination : un lien, une flèche ou des points de suspension. */
export function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li {...props} />;
}
