import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import { cn } from '@/design-system/helpers/cn';

/** Lien vers une étape : `render` remplace la balise `<a>` (lien du routeur, par exemple). */
export function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<'a'>) {
  return useRender({
    defaultTagName: 'a',
    props: mergeProps<'a'>({ className: cn('breadcrumb-link', className) }, props),
    render,
  });
}
