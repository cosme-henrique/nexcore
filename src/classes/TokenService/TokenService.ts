import { cookies } from 'next/headers';

type CookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: 'lax' | 'strict' | 'none';
};

const DEFAULT_OPTIONS: CookieOptions = {
  maxAge: 60 * 60, // 1 hora — access token
  path: '/',
  sameSite: 'lax',
};

const DEFAULT_REFRESH_OPTIONS: CookieOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 dias — refresh token
  path: '/',
  sameSite: 'lax',
};

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const isProduction = process.env.NODE_ENV === 'production';

export const TokenService = {
  async get(): Promise<string | undefined> {
    const store = await cookies();
    return store.get(ACCESS_TOKEN_KEY)?.value;
  },

  async set(token: string, options: CookieOptions = {}): Promise<void> {
    const store = await cookies();
    store.set(ACCESS_TOKEN_KEY, token, {
      httpOnly: true,
      secure: isProduction,
      ...DEFAULT_OPTIONS,
      ...options,
    });
  },

  async remove(): Promise<void> {
    const store = await cookies();
    store.delete(ACCESS_TOKEN_KEY);
  },

  async getRefresh(): Promise<string | undefined> {
    const store = await cookies();
    return store.get(REFRESH_TOKEN_KEY)?.value;
  },

  async setRefresh(token: string, options: CookieOptions = {}): Promise<void> {
    const store = await cookies();
    store.set(REFRESH_TOKEN_KEY, token, {
      httpOnly: true,
      secure: isProduction,
      ...DEFAULT_REFRESH_OPTIONS,
      ...options,
    });
  },

  async removeRefresh(): Promise<void> {
    const store = await cookies();
    store.delete(REFRESH_TOKEN_KEY);
  },

  async exists(): Promise<boolean> {
    const token = await TokenService.get();
    return !!token;
  },

  async clear(): Promise<void> {
    await TokenService.remove();
    await TokenService.removeRefresh();
  },
};
