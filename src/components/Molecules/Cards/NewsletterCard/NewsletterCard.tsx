import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import React from 'react';

import { Heading, Icon, Text } from '@/design-system';
import { cn } from '@/design-system/helpers/cn';

export const newsletterCardVariant = ['horizontal', 'vertical'] as const;
export type NewsletterCardVariantType = (typeof newsletterCardVariant)[number];

export const newsletterCardVariants = cva(
  'flex rounded-xs bg-primary bg-[url(/imgs/wave-background.png)] bg-bottom-right bg-no-repeat p-l text-white',
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
      vertical: 'mb-xl border-b pb-xl',
      horizontal: 'max-md:mb-xl max-md:border-b max-md:pb-xl md:mr-xl md:border-r md:pr-xl',
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
      <Heading size="m" className="text-accent">
        {title}
      </Heading>
      <Icon name="underline" className="text-accent" width="56px" />
      <Text className="mt-m">{description}</Text>
    </div>
    <div className="flex-2">{children}</div>
  </div>
);
