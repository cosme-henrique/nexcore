import { redirect } from 'next/navigation';
import { EnvService } from '../classes/EnvService';
import { HttpClient } from '../classes/HttpClient';
import { TokenService } from '../classes/TokenService';
import { type AuthConfig, setAuthConfig } from './configStore';

type EnvMap = Parameters<typeof EnvService.register>[0];

export type ConfigureOptions = {
  envs: EnvMap;
  auth?: AuthConfig;
};

let _httpClient: HttpClient | null = null;
let _isRefreshing = false;

export function Configure(options: ConfigureOptions): void {
  _httpClient = null;
  _isRefreshing = false;
  EnvService.register(options.envs);

  if (options.auth) {
    setAuthConfig(options.auth);
  }

  const baseURL = EnvService.get('apiUrl');
  if (baseURL) {
    _httpClient = new HttpClient({
      baseURL,
      token: () => TokenService.get(),
      onUnauthorized: async () => {
        if (!options.auth?.autoRefresh || _isRefreshing) return false;

        _isRefreshing = true;
        try {
          const refreshToken = await TokenService.getRefresh();
          if (!refreshToken) return false;

          const { accessToken } = await fetch(`${baseURL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          }).then((r) => r.json());

          await TokenService.set(accessToken);
          return true;
        } catch {
          if (options.auth?.onSessionExpired) {
            redirect(options.auth.onSessionExpired);
          }
          return false;
        } finally {
          _isRefreshing = false;
        }
      },
    });
  }
}

export const api = new Proxy({} as HttpClient, {
  get(_, prop: string) {
    if (!_httpClient) {
      throw new Error('[nexcore] api não disponível. Registre "apiUrl" nas envs do Configure().');
    }
    const value = (_httpClient as unknown as Record<string, unknown>)[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(_httpClient)
      : value;
  },
});

export function __reset(): void {
  _httpClient = null;
  _isRefreshing = false;
}
