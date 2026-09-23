import * as React from 'react';

import { CloseButton, Icon } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';
import { polyRef } from '@/design-system/helpers/polyRef';

export interface SearchFieldProps {
  input: React.ComponentPropsWithoutRef<'input'>;
  /** Rendu en `<button>`, ou dans l'élément passé en `as` — un lien dans l'autocomplétion. */
  buttonSearch: React.ComponentPropsWithoutRef<'a'> & { as?: React.ElementType };
  buttonClose?: React.ComponentPropsWithoutRef<'button'>;
  className?: string;
}

export const SearchField = polyRef<'div', SearchFieldProps>(
  ({ as: As = 'div', input, buttonClose = {}, buttonSearch, className, ...props }, ref) => {
    const { as: ButtonSearchAs = 'button', ...buttonSearchProps } = buttonSearch;

    return (
      <As {...props} ref={ref} className={cn('relative', className)}>
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
          <ButtonSearchAs {...buttonSearchProps} className="border-none bg-transparent">
            <Icon name="search" size="2.5rem" className="mx-xs text-primary" />
          </ButtonSearchAs>
        </div>
      </As>
    );
  }
);

SearchField.displayName = 'SearchField';
