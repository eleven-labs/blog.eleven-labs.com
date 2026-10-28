import type { ComponentPropsWithoutRef } from '@/design-system/types';

import React from 'react';

/**
 * An image of a content: the `maxWidth`, `maxHeight`, `width` and `height` parameters of its url size it,
 * e.g. `schema.png?maxWidth=400`.
 */
export const ContentImage: React.FC<ComponentPropsWithoutRef<'img'>> = (props) => {
  const urlParams = new URLSearchParams(props.src?.split('?')?.[1] ?? '');
  return React.createElement('img', {
    // A tutorial gathers all of its steps on one page, its images are only loaded when read
    loading: 'lazy',
    decoding: 'async',
    ...props,
    style: {
      maxWidth: urlParams.get('maxWidth') ? `${urlParams.get('maxWidth')}px` : undefined,
      maxHeight: urlParams.get('maxHeight') ? `${urlParams.get('maxHeight')}px` : undefined,
      width: urlParams.get('width') ? `${urlParams.get('width')}px` : undefined,
      height: urlParams.get('height') ? `${urlParams.get('height')}px` : undefined,
    },
  });
};
