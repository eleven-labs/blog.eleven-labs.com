import type { ComponentPropsWithoutRef } from './ComponentPropsWithoutRef';
import type React from 'react';

/**
 * Balises HTML qu'un composant polymorphe accepte.
 *
 * Volontairement limité aux éléments natifs : passer un composant React à `as` empilerait deux
 * composants, rendrait le balisage produit imprévisible, et storybook afficherait le composant
 * entier à la place du nom de la balise.
 */
export type ElementTagName = keyof React.JSX.IntrinsicElements;

/**
 * Props d'un composant polymorphe : les siennes, `as`, et celles de la balise effectivement rendue.
 */
export type PolymorphicProps<TTagName extends ElementTagName, TOwnProps> = TOwnProps & {
  /** Balise HTML à rendre à la place de celle par défaut. */
  as?: TTagName;
} & Omit<ComponentPropsWithoutRef<TTagName>, 'as' | keyof TOwnProps>;
