import { RefObject, useEffect, useRef } from 'react';

export const useClickListener = <T>(callback: (event: MouseEvent) => void): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    document.addEventListener('click', callback);
    return (): void => {
      document.removeEventListener('click', callback);
    };
  }, [callback]);

  return ref;
};
