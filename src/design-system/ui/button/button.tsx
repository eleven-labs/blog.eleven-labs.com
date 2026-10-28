import type { VariantProps } from 'class-variance-authority';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva } from 'class-variance-authority';

import { cn } from '@/design-system/helpers/cn';
import { Icon } from '@/design-system/ui/icon';

/** Variantes du bouton : classe de base `btn`, un modificateur par variante et par taille. */
export const buttonVariants = cva('btn', {
  variants: {
    variant: {
      default: 'btn-primary',
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
      destructive: 'btn-danger',
      link: 'btn-link',
    },
    size: {
      // La taille par défaut est celle de la classe de base
      default: '',
      xs: 'btn-xs',
      sm: 'btn-sm',
      lg: 'btn-lg',
      icon: 'btn-icon',
      'icon-xs': 'btn-icon-xs',
      'icon-sm': 'btn-icon-sm',
      'icon-lg': 'btn-icon-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export interface ButtonProps extends ButtonPrimitive.Props, VariantProps<typeof buttonVariants> {
  /** Affiche la flèche du bouton. Par défaut, les variantes d'action (primary, secondary, accent) l'affichent. */
  arrow?: boolean;
}

const arrowVariants = new Set(['default', 'primary', 'secondary', 'accent']);

/**
 * Bouton d'action. `render` change la balise (un lien, par exemple) sans changer le rendu.
 * La variante `secondary` ramène en arrière : sa flèche précède le libellé, retournée.
 */
export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  size = 'default',
  arrow,
  render,
  nativeButton = !render,
  children,
  ...props
}) => {
  const hasArrow = arrow ?? arrowVariants.has(variant ?? 'primary');

  return (
    <ButtonPrimitive
      {...props}
      render={render}
      nativeButton={nativeButton}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {hasArrow && variant === 'secondary' && <Icon name="arrow" className="btn-arrow-back" aria-hidden="true" />}
      {children}
      {hasArrow && variant !== 'secondary' && <Icon name="arrow" aria-hidden="true" />}
    </ButtonPrimitive>
  );
};
