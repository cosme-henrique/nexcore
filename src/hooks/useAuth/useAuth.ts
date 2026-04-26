'use client';

import { useState, useTransition } from 'react';
import {
  forgotPasswordAction,
  loginAction,
  logoutAction,
  registerAction,
  resetPasswordAction,
  verifyEmailAction,
} from '../../modules/auth/authActions';
import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../../types';

type UseAuthReturn = {
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
};

export function useAuth(): UseAuthReturn {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<Error | null>(null);

  function wrap<TArgs extends unknown[], TReturn>(
    action: (...args: TArgs) => Promise<TReturn>,
  ): (...args: TArgs) => Promise<TReturn> {
    return (...args: TArgs) =>
      new Promise<TReturn>((resolve, reject) => {
        setError(null);
        startTransition(async () => {
          try {
            const result = await action(...args);
            resolve(result);
          } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            setError(err);
            reject(err);
          }
        });
      });
  }

  return {
    login: wrap(loginAction),
    register: wrap(registerAction),
    logout: wrap(logoutAction),
    forgotPassword: wrap(forgotPasswordAction),
    resetPassword: wrap(resetPasswordAction),
    verifyEmail: wrap(verifyEmailAction),
    isLoading: isPending,
    error,
    clearError: () => setError(null),
  };
}
