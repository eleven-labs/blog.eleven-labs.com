import './CoverImage.scss';

import React from 'react';

import { Container } from '../Container';

export interface CoverImageProps {
  cover?: {
    desktop?: string;
    alt?: string;
  };
}

//*--------------Suggested resolution for cover images ----------------*//
//Desktop: 864x288

export const CoverImage = ({ cover }: CoverImageProps): React.JSX.Element | undefined => {
  if (!cover) return;
  const { desktop, alt } = cover;
  return (
    <Container className="cover-image__wrapper" variant="content" mt="l">
      <picture className="cover-image__picture">
        <source srcSet={`${desktop} 100w`} />
        <img src={desktop} alt={alt} className="cover-image__content" />
      </picture>
    </Container>
  );
};
