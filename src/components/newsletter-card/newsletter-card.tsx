import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/design-system/helpers/cn';
import { Heading } from '@/design-system/ui/heading';
import { Icon } from '@/design-system/ui/icon';
import { Text } from '@/design-system/ui/text';

export const newsletterCardVariant = ['horizontal', 'vertical'] as const;
export type NewsletterCardVariantType = (typeof newsletterCardVariant)[number];

// En dessous de `md` la carte s'empile toujours : la colonne latérale y passe sous le contenu (voir `newsletter-card.css`).
export const newsletterCardVariants = cva('newsletter-card', {
  variants: {
    variant: {
      vertical: '',
      horizontal: 'newsletter-card-horizontal',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

export interface NewsletterCardProps extends VariantProps<typeof newsletterCardVariants> {
  title: React.ReactNode;
  description: React.ReactNode;
  /** Le formulaire d'inscription, dont le balisage est produit par Webmecanik (`newsletter-card-webmecanik.css`). */
  children: React.ReactNode;
  className?: string;
}

/** Carte d'inscription à la newsletter : un titre, une description et le formulaire fourni en enfant. */
export const NewsletterCard: React.FC<NewsletterCardProps> = ({
  title,
  description,
  children,
  variant = 'vertical',
  className,
}) => (
  <div className={cn(newsletterCardVariants({ variant }), className)}>
    <div className="newsletter-card-intro">
      <Heading size="m" className="text-highlight">
        {title}
      </Heading>
      <Icon name="underline" className="text-highlight" width="56px" />
      <Text className="mt-6">{description}</Text>
    </div>
    <div className="flex-2">{children}</div>
  </div>
);
