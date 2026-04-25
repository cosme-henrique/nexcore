/**
 * @jest-environment jsdom
 */
import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside', () => {
  it('retorna uma ref', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));
    expect(result.current).toBeDefined();
  });

  it('dispara o callback ao clicar fora do elemento', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(callback));

    const div = document.createElement('div');
    document.body.appendChild(div);
    Object.defineProperty(result.current, 'current', { value: div, writable: true });

    const outside = document.createElement('button');
    document.body.appendChild(outside);

    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(div);
    document.body.removeChild(outside);
  });

  it('não dispara o callback ao clicar dentro do elemento', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside<HTMLDivElement>(callback));

    const div = document.createElement('div');
    const inner = document.createElement('span');
    div.appendChild(inner);
    document.body.appendChild(div);
    Object.defineProperty(result.current, 'current', { value: div, writable: true });

    inner.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it('remove o listener ao desmontar', () => {
    const removeEventListener = jest.spyOn(document, 'removeEventListener');
    const callback = jest.fn();
    const { unmount } = renderHook(() => useClickOutside(callback));

    unmount();

    expect(removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));

    removeEventListener.mockRestore();
  });
});
