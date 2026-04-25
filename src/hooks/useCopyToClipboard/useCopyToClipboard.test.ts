/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useCopyToClipboard } from './useCopyToClipboard';

const mockWriteText = jest.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, 'clipboard', {
  value: { writeText: mockWriteText },
  writable: true,
});

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockWriteText.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('inicia com copied false', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    expect(result.current.copied).toBe(false);
  });

  it('copia o texto para a área de transferência', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('texto copiado');
    });

    expect(mockWriteText).toHaveBeenCalledWith('texto copiado');
  });

  it('define copied como true após copiar', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('texto');
    });

    expect(result.current.copied).toBe(true);
  });

  it('reseta copied para false após o delay padrão (2000ms)', async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    await act(async () => {
      await result.current.copy('texto');
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.copied).toBe(false);
  });

  it('reseta copied após delay customizado', async () => {
    const { result } = renderHook(() => useCopyToClipboard(500));

    await act(async () => {
      await result.current.copy('texto');
    });

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current.copied).toBe(false);
  });
});
