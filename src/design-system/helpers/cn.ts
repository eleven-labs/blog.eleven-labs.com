import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Les échelles personnalisées déclarées dans `styles/theme.css` sont répétées ici : sans elles,
 * `tailwind-merge` prendrait `text-heading-xl` pour une couleur et le supprimerait face à
 * `text-primary`. Toute valeur ajoutée au thème doit l'être des deux côtés.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        'primary',
        'primary-dark',
        'primary-very-dark',
        'secondary',
        'secondary-dark',
        'info',
        'accent',
        'ultra-light-grey',
        'light-grey',
        'grey',
        'dark-grey',
        'ultra-dark-grey',
      ],
      font: ['base', 'heading', 'blockquote'],
      text: [
        'xs',
        's',
        'm',
        'heading-xs',
        'heading-s',
        'heading-m',
        'heading-l',
        'heading-xl',
        'markup-s',
        'markup-m',
        'markup-l',
        'markup-xl',
      ],
      leading: ['base', 'large'],
      tracking: ['heading-xl'],
      radius: ['xs', 's', 'full-rounded'],
      spacing: ['xxs-3', 'xxs-2', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxl-2', 'xxl-3'],
      breakpoint: ['sm', 'md', 'lg'],
    },
  },
});

/**
 * Concatène des classes conditionnelles puis résout les conflits Tailwind, pour qu'une classe
 * passée par l'appelant l'emporte toujours sur celle posée par le composant.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
