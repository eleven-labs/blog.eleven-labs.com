import { camelCase } from '@/helpers/stringHelper';

interface DataLayerEvent {
  event: string;
}

interface DatalayerInternalLinkClickEvent extends DataLayerEvent {
  event: 'internal_link_click';
  link_type: 'home' | 'post' | 'author' | 'relatedPost' | 'category' | 'back';
  link_url: string;
}

interface DatalayerShareLinkClickEvent extends DataLayerEvent {
  event: 'share_link_click';
  share_type: 'twitter' | 'facebook' | 'linkedIn' | 'reddit';
  share_url: string;
}

interface DatalayerNewsletterLinkClickEvent extends DataLayerEvent {
  event: 'newsletter_link_click';
}

interface DatalayerRSSLinkClickEvent extends DataLayerEvent {
  event: 'rss_link_click';
}

interface DatalayerSocialLinkClickEvent extends DataLayerEvent {
  event: 'social_link_click';
  social_type: 'facebook' | 'twitter' | 'linkedin' | 'welcometothejungle';
}

interface DatalayerWebsiteLinkClickEvent extends DataLayerEvent {
  event: 'website_link_click';
}

interface DatalayerLoadMoreButtonClickEvent extends DataLayerEvent {
  event: 'load_more_button_click';
}

interface DatalayerCopyLinkButtonClickEvent extends DataLayerEvent {
  event: 'copy_link_button_click';
  link_url: string;
}

interface DatalayerContentSearchEvent extends DataLayerEvent {
  event: 'content_search';
  content_search_term: string;
}

export type DataLayerClickEventAvailable =
  | DatalayerInternalLinkClickEvent
  | DatalayerShareLinkClickEvent
  | DatalayerNewsletterLinkClickEvent
  | DatalayerRSSLinkClickEvent
  | DatalayerSocialLinkClickEvent
  | DatalayerWebsiteLinkClickEvent
  | DatalayerLoadMoreButtonClickEvent
  | DatalayerCopyLinkButtonClickEvent;

export type DataLayerEventAvailable = DataLayerClickEventAvailable | DatalayerContentSearchEvent;

interface ClickEventType {
  eventName: DataLayerClickEventAvailable['event'];
  dataAttribute: string;
  dataAttributeValue?: string;
}

const clickEvents: ClickEventType[] = [
  {
    eventName: 'internal_link_click',
    dataAttribute: 'internal-link',
  },
  {
    eventName: 'share_link_click',
    dataAttribute: 'share-link',
  },
  {
    eventName: 'newsletter_link_click',
    dataAttribute: 'newsletter-link',
  },
  {
    eventName: 'rss_link_click',
    dataAttribute: 'rss-link',
  },
  {
    eventName: 'social_link_click',
    dataAttribute: 'social-link',
  },
  {
    eventName: 'website_link_click',
    dataAttribute: 'website-link',
  },
  {
    eventName: 'load_more_button_click',
    dataAttribute: 'button',
    dataAttributeValue: 'loadMore',
  },
  {
    eventName: 'copy_link_button_click',
    dataAttribute: 'button',
    dataAttributeValue: 'copyLink',
  },
];

export const getClickEventElements = (): HTMLElement[] =>
  clickEvents.reduce<HTMLElement[]>(
    (elements, clickEvent) => [
      ...elements,
      ...document.querySelectorAll<HTMLElement>(`[data-${clickEvent.dataAttribute}]`).values(),
    ],
    [] as HTMLElement[]
  );

export const handleClickEventListener = (event: MouseEvent): void => {
  const target = event.currentTarget as HTMLElement;
  const clickEvent = clickEvents.find((clickEvent) => {
    const attributeValue = target.dataset?.[camelCase(clickEvent.dataAttribute)];
    return clickEvent.dataAttributeValue ? attributeValue === clickEvent.dataAttributeValue : attributeValue;
  });
  if (!clickEvent) {
    return;
  }

  let dataLayerEvent: DataLayerEventAvailable;
  switch (clickEvent.eventName) {
    case 'internal_link_click':
      dataLayerEvent = {
        event: clickEvent.eventName,
        link_type: target.dataset[camelCase(clickEvent.dataAttribute)] as DatalayerInternalLinkClickEvent['link_type'],
        link_url: target.getAttribute('href') as string,
      };
      break;
    case 'share_link_click':
      dataLayerEvent = {
        event: clickEvent.eventName,
        share_type: target.dataset['sharing'] as DatalayerShareLinkClickEvent['share_type'],
        share_url: window.location.pathname,
      };
      break;
    case 'social_link_click':
      dataLayerEvent = {
        event: clickEvent.eventName,
        social_type: target.dataset[
          camelCase(clickEvent.dataAttribute)
        ] as DatalayerSocialLinkClickEvent['social_type'],
      };
      break;
    case 'copy_link_button_click':
      dataLayerEvent = {
        event: clickEvent.eventName,
        link_url: window.location.pathname,
      };
      break;
    default:
      dataLayerEvent = {
        event: clickEvent.eventName,
      };
      break;
  }

  window.dataLayer.push(dataLayerEvent);
};

export const trackContentSearchEvent = (term: string): void => {
  const dataLayerEvent: DatalayerContentSearchEvent = {
    event: 'content_search',
    content_search_term: term,
  };
  window.dataLayer.push(dataLayerEvent);
};
