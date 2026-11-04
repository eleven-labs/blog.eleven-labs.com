import type { ComponentPropsWithoutRef, IconNameType } from '@/design-system/types';

import React from 'react';

import { Logo } from '@/components/logo';
import { cn } from '@/design-system/helpers/cn';
import { Button } from '@/design-system/ui/button';
import { Heading } from '@/design-system/ui/heading';
import { Icon } from '@/design-system/ui/icon';
import { Link } from '@/design-system/ui/link';
import { Text } from '@/design-system/ui/text';

type SocialIconName = Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;

export interface FooterProps {
  introBlock: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  elevenLabsSiteLink: ComponentPropsWithoutRef<'a'>;
  addressList: { title?: React.ReactNode; description: React.ReactNode }[];
  contactLink: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
  socialLinks: ({
    iconName: SocialIconName;
    /** Nom accessible du lien (l'icône seule n'en a pas) ; le nom du réseau par défaut. */
    label?: string;
  } & ComponentPropsWithoutRef<'a'>)[];
  languageLinks: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & ComponentPropsWithoutRef<'a'>)[];
}

/* Noms de marque, identiques dans toutes les langues */
const socialLabels: Record<SocialIconName, string> = {
  rss: 'RSS',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  welcometothejungle: 'Welcome to the Jungle',
};

/** Pied de page : accroche vers le site, adresses, réseaux sociaux (liens à nom accessible), contact et langues. */
export const Footer: React.FC<FooterProps> = ({
  introBlock,
  elevenLabsSiteLink,
  contactLink: { label: contactLabel, ...contactLink },
  addressList,
  socialLinks,
  languageLinks,
}) => (
  <footer className="footer">
    <div className="footer-banner">
      <Heading size="s">{introBlock.title}</Heading>
      <a {...elevenLabsSiteLink} className="footer-banner-link">
        {introBlock.description}
      </a>
    </div>
    <div className="footer-body">
      <div className="mb-10">
        <div className="mb-2 flex items-center justify-center md:justify-start">
          <Logo name="website" size="2.5em" />
        </div>
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:gap-10">
          {addressList.map((currentContact, contactIndex) => (
            <div key={contactIndex} className="mb-6">
              {currentContact.title && <Text className="mb-1.5 font-bold">{currentContact.title}</Text>}
              {currentContact.description}
            </div>
          ))}
        </div>
        <div className="footer-social">
          {socialLinks.map(({ iconName, label, ...linkProps }, socialLinkIndex) => (
            <a
              key={socialLinkIndex}
              aria-label={label ?? socialLabels[iconName]}
              {...linkProps}
              target="_blank"
              {...(iconName === 'rss'
                ? {
                    'data-rss-link': true,
                  }
                : {
                    'data-social-link': iconName,
                  })}
            >
              <Icon
                name={iconName}
                size="36px"
                aria-hidden="true"
                className={cn('footer-social-icon', iconName === 'twitter' && 'footer-social-icon-twitter')}
              />
            </a>
          ))}
          <Button render={<a {...contactLink} />}>{contactLabel}</Button>
        </div>
      </div>
    </div>
    <div className="footer-languages">
      <div className="mr-2">
        <Icon size="28px" name="language" aria-hidden="true" />
      </div>
      {languageLinks.map(({ label, isActive, ...linkProps }, index) => (
        <React.Fragment key={index}>
          {isActive ? (
            <Text className="font-bold">{label}</Text>
          ) : (
            <Link {...linkProps} data-internal-link="home" className="footer-language-link">
              {label}
            </Link>
          )}
          {languageLinks.length - 1 !== index && <div className="mx-4" />}
        </React.Fragment>
      ))}
    </div>
  </footer>
);
