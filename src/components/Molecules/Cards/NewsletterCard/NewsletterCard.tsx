import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import React from 'react';

import { Heading, Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const newsletterCardVariant = ['horizontal', 'vertical'] as const;
export type NewsletterCardVariantType = (typeof newsletterCardVariant)[number];

export const newsletterCardVariants = cva(
  'flex rounded-card bg-brand bg-[url(/imgs/wave-background.png)] bg-bottom-right bg-no-repeat p-8 text-on-brand',
  {
    variants: {
      // En dessous de `md` la carte s'empile toujours : la colonne latérale y passe sous le contenu.
      variant: {
        vertical: 'flex-col',
        horizontal: 'max-md:flex-col md:flex-row',
      },
    },
    defaultVariants: {
      variant: 'vertical',
    },
  }
);

const introVariants = cva('flex-1 border-[rgb(0_0_0/20%)]', {
  variants: {
    variant: {
      vertical: 'mb-10 border-b pb-10',
      horizontal: 'max-md:mb-10 max-md:border-b max-md:pb-10 md:mr-10 md:border-r md:pr-10',
    },
  },
  defaultVariants: {
    variant: 'vertical',
  },
});

export interface NewsletterCardProps extends VariantProps<typeof newsletterCardVariants> {
  title: React.ReactNode;
  description: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const NewsletterCard: React.FC<NewsletterCardProps> = ({
  title,
  description,
  children,
  variant = 'vertical',
  className,
}) => (
  <div className={cn(newsletterCardVariants({ variant }), className)}>
    <div className={introVariants({ variant })}>
      <Heading size="m" className="text-highlight">
        {title}
      </Heading>
      <Icon name="underline" className="text-highlight" width="56px" />
      <Text className="mt-6">{description}</Text>
    </div>
    <div className="flex-2">{children}</div>
  </div>
);
