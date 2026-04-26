import { TokenService } from '../../classes/TokenService';
import { api } from '../../configure';
import type {
  AuthTokens,
  AuthUser,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from '../../types';

type LoginResponse = AuthTokens & { user: AuthUser };

export const auth = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const { accessToken, refreshToken, user } = await api.post<LoginResponse>(
      '/auth/login',
      payload,
    );
    await TokenService.set(accessToken);
    if (refreshToken) await TokenService.setRefresh(refreshToken);
    return user;
  },

  async register(payload: RegisterPayload): Promise<void> {
    await api.post('/auth/register', payload);
  },

  async logout(): Promise<void> {
    await TokenService.clear();
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    await api.post('/auth/forgot-password', payload);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/auth/reset-password', payload);
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<void> {
    await api.post('/auth/verify-email', payload);
  },

  async refresh(): Promise<void> {
    const refreshToken = await TokenService.getRefresh();
    if (!refreshToken) throw new Error('[nexcore] Refresh token não encontrado.');
    const { accessToken } = await api.post<AuthTokens>('/auth/refresh', { refreshToken });
    await TokenService.set(accessToken);
  },

  async isAuthenticated(): Promise<boolean> {
    return TokenService.exists();
  },

  async requireAuth(redirectTo = '/login'): Promise<void> {
    const authenticated = await TokenService.exists();
    if (!authenticated) {
      const { redirect } = await import('next/navigation');
      redirect(redirectTo);
    }
  },
};
