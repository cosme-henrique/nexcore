import { EnvService } from '../classes/EnvService';
import { HttpClient } from '../classes/HttpClient';
import { TokenService } from '../classes/TokenService';

type EnvMap = Parameters<typeof EnvService.register>[0];

export type ConfigureOptions = {
  envs: EnvMap;
};

let _httpClient: HttpClient | null = null;

export function Configure(options: ConfigureOptions): void {
  _httpClient = null;
  EnvService.register(options.envs);

  const baseURL = EnvService.get('apiUrl');
  if (baseURL) {
    _httpClient = new HttpClient({
      baseURL,
      token: () => TokenService.get(),
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
}
