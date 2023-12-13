import './Footer.scss';

import { AsProps, Box, Button, Flex, Heading, Icon, IconNameType, Link, Logo, Text } from '@eleven-labs/design-system';
import React from 'react';

export interface FooterProps {
  introBlock: {
    title: React.ReactNode;
    description: React.ReactNode;
  };
  elevenLabsSiteLink: { label: React.ReactNode } & AsProps<'a'>;
  contact: {
    title: React.ReactNode;
    list: { title?: React.ReactNode; description: React.ReactNode }[];
  };
  socialLinks: ({
    iconName: Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;
  } & AsProps<'a'>)[];
  languageLinks: ({
    label: React.ReactNode;
    isActive?: boolean;
  } & AsProps<'a'>)[];
}

export const Footer: React.FC<FooterProps> = ({
  introBlock,
  elevenLabsSiteLink: { label: elevenLabsSiteLinkLabel, ...elevenLabsSiteLinkProps },
  contact,
  socialLinks,
  languageLinks,
}) => (
  <Box as="footer" bg="navy" color="white" textAlign={{ xs: 'center', md: 'left' }} textSize="s" className="footer">
    <Flex
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="around"
      alignItems="center"
      pt={{ md: 'xl' }}
      pb={{ md: 'xl' }}
      mb="xl"
    >
      <Box mb="xl">
        <Flex justifyContent={{ xs: 'center', md: 'start' }} alignItems="center" pt={{ xs: 'l', md: '0' }} mb="xxs">
          <Logo name="website" size="2.5em" />
        </Flex>
        <Text>{introBlock.title}</Text>
        <Text fontWeight="bold" mb="s" mx={{ xs: 's', md: '0' }}>
          {introBlock.description}
        </Text>
        <Button {...(elevenLabsSiteLinkProps as typeof Button)}>{elevenLabsSiteLinkLabel}</Button>
      </Box>
      <Box>
        <Heading as="p" size="l" mb="s">
          {contact.title}
        </Heading>
        <Flex flexDirection={{ xs: 'column', md: 'row' }} gap={{ md: 'xl' }}>
          {contact.list.map((currentContact, contactIndex) => (
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
        <Flex gapY="s" alignItems="center">
          {socialLinks.map(({ as: As = 'a', iconName, ...linkProps }, socialLinkIndex) => (
            <As
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
              <Icon name={iconName} size="2.5em" color="white" mx="xxs-2" className="footer__social-icon" />
            </As>
          ))}
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
