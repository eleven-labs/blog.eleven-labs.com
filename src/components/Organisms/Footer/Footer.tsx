import type { ComponentPropsWithoutRef, IconNameType } from '@/design-system/types';

import React from 'react';

import { Logo } from '@/components';
import { Button, Heading, Icon, Link, Text } from '@/design-system';

export interface FooterProps {
  introBlock: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  elevenLabsSiteLink: ComponentPropsWithoutRef<'a'>;
  addressList: { title?: React.ReactNode; description: React.ReactNode }[];
  contactLink: { label: React.ReactNode } & ComponentPropsWithoutRef<'a'>;
  socialLinks: ({
    iconName: Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;
  } & ComponentPropsWithoutRef<'a'>)[];
  languageLinks: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & ComponentPropsWithoutRef<'a'>)[];
}

export const Footer: React.FC<FooterProps> = ({
  introBlock,
  elevenLabsSiteLink,
  contactLink: { label: contactLabel, ...contactLink },
  addressList,
  socialLinks,
  languageLinks,
}) => (
  <footer className="bg-footer text-center body-s text-on-brand md:text-left">
    <div className="flex flex-col items-center justify-center gap-4 bg-footer-strong py-6 md:flex-row md:items-end">
      <Heading size="s">{introBlock.title}</Heading>
      <a {...elevenLabsSiteLink} className="text-on-brand underline">
        {introBlock.description}
      </a>
    </div>
    <div className="mx-4 flex flex-col items-center justify-around py-8 md:flex-row md:py-10">
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
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
          {socialLinks.map(({ iconName, ...linkProps }, socialLinkIndex) => (
            <a
              key={socialLinkIndex}
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
                className={iconName === 'twitter' ? 'rounded-[6px] text-ink' : 'rounded-[6px] text-on-brand'}
              />
            </a>
          ))}
          <Button render={<a {...contactLink} />}>
            {contactLabel}
          </Button>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center border-t border-[rgb(0_0_0/20%)] py-4">
      <div className="mr-2">
        <Icon size="28px" name="language" />
      </div>
      {languageLinks.map(({ label, isActive, ...linkProps }, index) => (
        <React.Fragment key={index}>
          {isActive ? (
            <Text className="font-bold">{label}</Text>
          ) : (
            <Link {...linkProps} data-internal-link="home">
              {label}
            </Link>
          )}
          {languageLinks.length - 1 !== index && <div className="mx-4" />}
        </React.Fragment>
      ))}
    </div>
  </footer>
);
