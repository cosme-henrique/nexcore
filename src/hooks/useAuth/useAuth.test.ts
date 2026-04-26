/**
 * @jest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { useAuth } from './useAuth';

const mockUser = { id: '1', email: 'test@test.com', name: 'Test', role: 'user' };

jest.mock('../../modules/auth/authActions', () => ({
  loginAction: jest
    .fn()
    .mockResolvedValue({ id: '1', email: 'test@test.com', name: 'Test', role: 'user' }),
  registerAction: jest.fn().mockResolvedValue(undefined),
  logoutAction: jest.fn().mockResolvedValue(undefined),
  forgotPasswordAction: jest.fn().mockResolvedValue(undefined),
  resetPasswordAction: jest.fn().mockResolvedValue(undefined),
  verifyEmailAction: jest.fn().mockResolvedValue(undefined),
}));

const {
  loginAction,
  registerAction,
  logoutAction,
  forgotPasswordAction,
  resetPasswordAction,
  verifyEmailAction,
} = jest.requireMock('../../modules/auth/authActions');

describe('useAuth', () => {
  beforeEach(() => jest.clearAllMocks());

  it('inicia com isLoading false e error null', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('chama loginAction e retorna o usuário', async () => {
    const { result } = renderHook(() => useAuth());
    let user: Awaited<ReturnType<typeof result.current.login>> | undefined;

    await act(async () => {
      user = await result.current.login({ email: 'test@test.com', password: '123456' });
    });

    expect(loginAction).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
    expect(user).toEqual(mockUser);
  });

  it('chama registerAction', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register({ name: 'Test', email: 'test@test.com', password: '123456' });
    });

    expect(registerAction).toHaveBeenCalled();
  });

  it('chama logoutAction', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(logoutAction).toHaveBeenCalled();
  });

  it('chama forgotPasswordAction', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.forgotPassword({ email: 'test@test.com' });
    });

    expect(forgotPasswordAction).toHaveBeenCalledWith({ email: 'test@test.com' });
  });

  it('chama resetPasswordAction', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.resetPassword({ token: 'abc', newPassword: 'new123' });
    });

    expect(resetPasswordAction).toHaveBeenCalledWith({ token: 'abc', newPassword: 'new123' });
  });

  it('chama verifyEmailAction', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.verifyEmail({ code: '123456' });
    });

    expect(verifyEmailAction).toHaveBeenCalledWith({ code: '123456' });
  });

  it('define error quando a action falha', async () => {
    loginAction.mockRejectedValueOnce(new Error('Credenciais inválidas'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ email: 'x@x.com', password: 'wrong' }).catch(() => {});
    });

    expect(result.current.error?.message).toBe('Credenciais inválidas');
  });

  it('limpa o error com clearError', async () => {
    loginAction.mockRejectedValueOnce(new Error('Erro'));
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login({ email: 'x@x.com', password: 'wrong' }).catch(() => {});
    });

    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());

    expect(result.current.error).toBeNull();
  });
});
