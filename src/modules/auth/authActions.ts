'use server';

import type {
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../../types';
import { auth } from './auth';

export async function loginAction(payload: LoginPayload): Promise<AuthUser> {
  return auth.login(payload);
}

export async function registerAction(payload: RegisterPayload): Promise<void> {
  return auth.register(payload);
}

export async function logoutAction(): Promise<void> {
  return auth.logout();
}

export async function forgotPasswordAction(payload: ForgotPasswordPayload): Promise<void> {
  return auth.forgotPassword(payload);
}

export async function resetPasswordAction(payload: ResetPasswordPayload): Promise<void> {
  return auth.resetPassword(payload);
}

export async function verifyEmailAction(payload: VerifyEmailPayload): Promise<void> {
  return auth.verifyEmail(payload);
}
