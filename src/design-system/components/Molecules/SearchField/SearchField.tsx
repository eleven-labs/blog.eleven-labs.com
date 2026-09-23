import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { CloseButton, Icon } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface SearchFieldProps extends useRender.ElementProps<'div'> {
  input: useRender.ElementProps<'input'>;
  /** Rendu en `<button>`, ou dans l'élément passé en `render` — un lien dans l'autocomplétion. */
  buttonSearch: useRender.ComponentProps<'button'>;
  buttonClose?: useRender.ElementProps<'button'>;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  input,
  buttonClose = {},
  buttonSearch,
  className,
  ...props
}) => {
  const { render: buttonSearchRender, ...buttonSearchProps } = buttonSearch;

  const searchButton = useRender({
    defaultTagName: 'button',
    render: buttonSearchRender,
    props: {
      ...buttonSearchProps,
      className: 'border-none bg-transparent',
      children: <Icon name="search" size="2.5rem" className="mx-xs text-primary" />,
    },
  });

  return (
    <div {...props} className={cn('relative', className)}>
      <input
        {...input}
        className={cn(
          'w-full rounded-[22px] border-2 border-transparent bg-secondary py-xs pr-[calc(var(--spacing-xxl)+var(--spacing-xl))] pl-xs font-base text-xs text-primary',
          'placeholder:text-primary',
          'focus-visible:border-primary focus-visible:shadow-[0_4px_30px_rgb(0_0_0/6%)] focus-visible:outline-none'
        )}
      />
      <div className="absolute top-0 right-0 flex h-full items-center justify-center py-xxs">
        {Boolean(input.value) && <CloseButton {...buttonClose} variant="secondary" />}
        {searchButton}
      </div>
    </div>
  );
};
