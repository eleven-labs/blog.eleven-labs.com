import * as React from 'react';

// This hook was created to remove warnings when used with SSR
 
export const useLayoutEffect = typeof window === 'undefined' ? (): void => {} : React.useLayoutEffect;
