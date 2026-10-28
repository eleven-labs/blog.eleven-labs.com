import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/design-system/helpers/cn';

export interface PaginationLinkProps extends useRender.ComponentProps<'a'> {
  /** Page courante : posée en `aria-current="page"`, mise en avant en couleur primaire. */
  isActive?: boolean;
}

/**
 * Case carrée menant à une page. Sans `href`, la case est désactivée : `role="link"` et `aria-disabled`, pour
 * qu'elle garde son nom accessible (un `<a>` sans `href` n'a pas de rôle) ; `render` remplace la balise `<a>`
 * (lien du routeur, par exemple).
 */
export function PaginationLink({ className, isActive, render, ...props }: PaginationLinkProps) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>(
      {
        className: cn('pagination-link', className),
        'aria-current': isActive ? 'page' : undefined,
        role: props.href === undefined ? 'link' : undefined,
        'aria-disabled': props.href === undefined ? 'true' : undefined,
      },
      props
    ),
    render,
  });
}
