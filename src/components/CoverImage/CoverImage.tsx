import './CoverImage.scss';

import React from 'react';

import { Container } from '../Container';

export interface CoverImageProps {
  src?: string;
  alt?: string;
}

export const CoverImage: React.FC<CoverImageProps> = ({ src, alt }) => {
  return (
    <Container className="cover-image__wrapper" variant="content" mt="l">
      <picture className="cover-image__picture">
        <img src={src} alt={alt} className="cover-image__content" />
      </picture>
    </Container>
  );
};
