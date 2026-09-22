import type { MatchBreakpointsType } from '@/design-system/types';

import * as React from 'react';

import { matchMediaQueryList } from '@/design-system/constants';
import { useLayoutEffect } from '@/design-system/hooks/useLayoutEffect';

export const useMediaQuery = (query: MatchBreakpointsType): boolean => {
  const [matches, setMatches] = React.useState<boolean>(false);

  useLayoutEffect((): (() => void) => {
    const media = window.matchMedia(matchMediaQueryList[query]);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = (): void => setMatches(media.matches);
    window.addEventListener('resize', listener);
    return (): void => window.removeEventListener('resize', listener);
  }, [query, matches, setMatches]);

  return matches;
};
