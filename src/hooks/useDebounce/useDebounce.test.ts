/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('inicial', 500));
    expect(result.current).toBe('inicial');
  });

  it('não atualiza o valor antes do delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('a');
  });

  it('atualiza o valor após o delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('b');
  });

  it('reinicia o timer a cada mudança de valor', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    rerender({ value: 'c' });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe('a');

    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe('c');
  });

  it('funciona com tipos numéricos', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe(42);
  });
});
