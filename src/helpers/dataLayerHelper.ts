interface DataLayerEvent {
  event: string;
}

interface DatalayerContentSearchEvent extends DataLayerEvent {
  event: 'content_search';
  content_search_term: string;
}

export const trackContentSearchEvent = (term: string): void => {
  const dataLayerEvent: DatalayerContentSearchEvent = {
    event: 'content_search',
    content_search_term: term,
  };
  window.dataLayer.push(dataLayerEvent);
};
