import React from 'react';

// eslint-disable-next-line
export const useLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : () => {};
