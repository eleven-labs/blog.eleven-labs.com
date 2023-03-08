import React from 'react';

import { useScript } from '@/hooks/useScript';

export const Script: React.FC<React.ComponentProps<'script'>> = (props) => {
  const status = useScript(props.src as string, {
    removeOnUnmount: false,
  });

  React.useEffect((): void => {
    if (status === 'ready' && /twitter/.test(props.src as string)) {
      (window as any).twttr.widgets.load(); //eslint-disable-line @typescript-eslint/no-explicit-any
    }
  }, [status, props.src]);

  return null;
};
