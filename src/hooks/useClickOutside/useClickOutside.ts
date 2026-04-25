import { type RefObject, useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(callback: () => void): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      callback();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [callback]);

  return ref;
}
