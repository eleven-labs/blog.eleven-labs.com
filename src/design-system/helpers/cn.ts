import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Les échelles des tokens gardent les noms de Tailwind (`text-sm`, `p-4`), que `tailwind-merge` connaît. Seuls les noms
 * propres au design system sont déclarés ici : sans eux, `heading-xl` et `text-primary` ne seraient pas reconnus comme
 * taille et couleur concurrentes, et une dimension nommée (`size-control`) ne remplacerait pas `size-4`. Un token de
 * taille ajouté dans `styles/tokens.css`, ou un utilitaire de `styles/classes/typography.css`, l'est aussi ici.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: ['control', 'sticky'],
      radius: ['control', 'card'],
      shadow: ['card', 'overlay'],
    },
    classGroups: {
      'font-size': [
        'body-xs',
        'body-s',
        'body-m',
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
    },
  },
});

/**
 * Concatène des classes conditionnelles puis résout les conflits Tailwind, pour qu'une classe
 * passée par l'appelant l'emporte toujours sur celle posée par le composant.
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
