import { useRender } from '@base-ui/react/use-render';
import * as React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { CloseButton } from '@/design-system/ui/close-button';
import { Icon } from '@/design-system/ui/icon';
import { Input } from '@/design-system/ui/input';

export interface SearchFieldProps extends useRender.ElementProps<'div'> {
  /** Champ de saisie : son nom accessible vient de `aria-label` ou d'un `<label>` associé. */
  input: useRender.ElementProps<'input'>;
  /** Rendu en `<button>`, ou dans l'élément passé en `render` (un lien dans l'autocomplétion). Nom accessible par défaut : « Rechercher ». */
  buttonSearch: useRender.ComponentProps<'button'>;
  /** Bouton d'effacement, affiché quand le champ a une valeur. Nom accessible par défaut : « Fermer ». */
  buttonClose?: useRender.ElementProps<'button'>;
}

/** Champ de recherche : saisie, bouton d'effacement (si le champ est rempli) et bouton de lancement de la recherche. */
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
      'aria-label': 'Rechercher',
      ...buttonSearchProps,
      className: cn('search-field-submit', buttonSearchProps.className),
      children: <Icon name="search" size="2.5rem" aria-hidden="true" />,
    },
  });

  return (
    <div {...props} className={cn('search-field', className)}>
      <Input {...input} className={cn('search-field-input', input.className)} />
      <div className="search-field-actions">
        {Boolean(input.value) && <CloseButton {...buttonClose} variant="secondary" />}
        {searchButton}
      </div>
    </div>
  );
};
