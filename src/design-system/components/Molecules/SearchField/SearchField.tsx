import type { ComponentPropsWithoutRef, ElementTagName } from '@/design-system/types';

import * as React from 'react';

import { CloseButton, Icon } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export interface SearchFieldProps extends ComponentPropsWithoutRef<'div'> {
  input: ComponentPropsWithoutRef<'input'>;
  /** Rendu en `<button>`, ou dans la balise passée en `as` — un lien dans l'autocomplétion. */
  buttonSearch: ComponentPropsWithoutRef<'a'> & { as?: ElementTagName };
  buttonClose?: ComponentPropsWithoutRef<'button'>;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  input,
  buttonClose = {},
  buttonSearch,
  className,
  ...props
}) => {
  const { as, ...buttonSearchProps } = buttonSearch;
  const ButtonSearchTag = (as ?? 'button') as React.ElementType;

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
        <ButtonSearchTag {...buttonSearchProps} className="border-none bg-transparent">
          <Icon name="search" size="2.5rem" className="mx-xs text-primary" />
        </ButtonSearchTag>
      </div>
    </div>
  );
};
