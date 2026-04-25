/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

const mockMatchMedia = (matches: boolean) => {
  const listeners: ((event: MediaQueryListEvent) => void)[] = [];

  const media = {
    matches,
    addEventListener: jest.fn((_: string, fn: (e: MediaQueryListEvent) => void) => {
      listeners.push(fn);
    }),
    removeEventListener: jest.fn(),
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockReturnValue(media),
  });

  return { media, listeners };
};

describe('useMediaQuery', () => {
  it('retorna false por padrão antes do efeito', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('retorna true quando a query está ativa', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('atualiza quando a media query muda', () => {
    const { listeners } = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    expect(result.current).toBe(false);

    act(() => {
      listeners[0]({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it('remove o listener ao desmontar', () => {
    const { media } = mockMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

    unmount();

    expect(media.removeEventListener).toHaveBeenCalled();
  });
});
