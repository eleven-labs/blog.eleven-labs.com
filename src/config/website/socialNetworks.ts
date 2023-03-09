import { IconNameType } from '@eleven-labs/design-system';

export const socialNetworks: {
  iconName: Extract<IconNameType, 'rss' | 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle'>;
  url: string;
}[] = [
  /*{
    iconName: 'rss',
    url: 'https://blog.eleven-labs.com/feed.xml',
  },*/
  {
    iconName: 'facebook',
    url: 'https://www.facebook.com/11Labs',
  },
  {
    iconName: 'twitter',
    url: 'https://www.twitter.com/eleven_labs/',
  },
  {
    iconName: 'linkedin',
    url: 'https://linkedin.com/company/eleven-labs',
  },
  {
    iconName: 'welcometothejungle',
    url: 'https://www.welcometothejungle.com/companies/eleven-labs',
  },
];
