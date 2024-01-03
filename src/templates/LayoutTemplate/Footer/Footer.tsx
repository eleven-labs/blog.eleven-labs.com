import './Footer.scss';

import { Box, Button, Flex, Icon, IconNameType, Link, Logo, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface FooterProps {
  introBlock: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  elevenLabsSiteLink: React.ComponentPropsWithoutRef<'a'>;
  addressList: { title?: React.ReactNode; description: React.ReactNode }[];
  contactLink: { label: React.ReactNode } & React.ComponentPropsWithoutRef<'a'>;
  socialLinks: ({
    iconName: Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;
  } & React.ComponentPropsWithoutRef<'a'>)[];
  languageLinks: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & React.ComponentPropsWithoutRef<'a'>)[];
}

export const Footer: React.FC<FooterProps> = ({
  introBlock,
  elevenLabsSiteLink,
  contactLink: { label: contactLabel, ...contactLink },
  addressList,
  socialLinks,
  languageLinks,
}) => (
  <Box as="footer" bg="navy" color="white" textAlign={{ xs: 'center', md: 'left' }} textSize="s" className="footer">
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
      py="xs"
      className="footer__intro"
    >
      <Text fontWeight="bold">{introBlock.title}</Text>
      <Box as="a" ml="s" {...elevenLabsSiteLink} className="footer__intro-link">
        {introBlock.description}
      </Box>
    </Flex>
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="around"
      alignItems="center"
      pt={{ xs: 'l', md: 'xl' }}
      pb={{ xs: 'l', md: 'xl' }}
      mx="s"
    >
      <Box mb="xl">
        <Flex justifyContent={{ xs: 'center', md: 'start' }} alignItems="center" mb="xxs">
          <Logo name="website" size="2.5em" />
        </Flex>
      </Box>
      <Box>
        <Flex flexDirection={{ xs: 'column', md: 'row' }} gap={{ md: 'xl' }}>
          {addressList.map((currentContact, contactIndex) => (
            <Box key={contactIndex} mb="m">
              {currentContact.title && (
                <Text fontWeight="bold" mb="xxs-2">
                  {currentContact.title}
                </Text>
              )}
              {currentContact.description}
            </Box>
          ))}
        </Flex>
        <Flex justifyContent={{ xs: 'center', md: 'start' }} alignItems="center" flexWrap="wrap" gap="s">
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
              <Icon name={iconName} size="2.5em" color="white" className="footer__social-icon" />
            </a>
          ))}
          <Button as="a" {...contactLink}>
            {contactLabel}
          </Button>
        </Flex>
      </Box>
    </Flex>
    <Flex py="s" justifyContent="center" alignItems="center" className="footer__language-links-container">
      <Box mr="xxs">
        <Icon name="language" />
      </Box>
      {languageLinks.map(({ label, isActive, ...linkProps }, index) => (
        <React.Fragment key={index}>
          {isActive ? (
            <Text fontWeight="bold">{label}</Text>
          ) : (
            <Link {...linkProps} data-internal-link="home">
              {label}
            </Link>
          )}
          {languageLinks.length - 1 !== index && <Box mx="s" />}
        </React.Fragment>
      ))}
    </Flex>
  </Box>
);
