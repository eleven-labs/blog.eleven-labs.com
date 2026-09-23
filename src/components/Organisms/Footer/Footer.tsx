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
  <footer className="bg-primary-dark text-center text-s text-white md:text-left">
    <div className="flex flex-col items-center justify-center gap-s bg-primary-very-dark py-m md:flex-row md:items-end">
      <Heading size="s">{introBlock.title}</Heading>
      <a {...elevenLabsSiteLink} className="text-white underline">
        {introBlock.description}
      </a>
    </div>
    <div className="mx-s flex flex-col items-center justify-around py-l md:flex-row md:py-xl">
      <div className="mb-xl">
        <div className="mb-xxs flex items-center justify-center md:justify-start">
          <Logo name="website" size="2.5em" />
        </div>
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:gap-xl">
          {addressList.map((currentContact, contactIndex) => (
            <div key={contactIndex} className="mb-m">
              {currentContact.title && <Text className="mb-xxs-2 font-bold">{currentContact.title}</Text>}
              {currentContact.description}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-s md:justify-start">
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
                className={iconName === 'twitter' ? 'rounded-[6px] text-black' : 'rounded-[6px] text-white'}
              />
            </a>
          ))}
          <Button render={<a {...contactLink} />}>
            {contactLabel}
          </Button>
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center border-t border-[rgb(0_0_0/20%)] py-s">
      <div className="mr-xxs">
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
          {languageLinks.length - 1 !== index && <div className="mx-s" />}
        </React.Fragment>
      ))}
    </div>
  </footer>
);
