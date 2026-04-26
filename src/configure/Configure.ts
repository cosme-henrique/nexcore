import { EnvService } from '../classes/EnvService';
import { HttpClient } from '../classes/HttpClient';
import { type AuthConfig, setAuthConfig } from './configStore';

type EnvMap = Parameters<typeof EnvService.register>[0];

export type ConfigureOptions = {
  envs?: EnvMap;
  auth?: AuthConfig;
};

export function Configure(options: ConfigureOptions): void {
  if (options.envs) EnvService.register(options.envs);
  if (options.auth) setAuthConfig(options.auth);
}

function getBaseURL(): string {
  const url = process.env.BASE_URL;
  if (!url) throw new Error('[nexcore] BASE_URL não definida. Adicione BASE_URL no seu .env.');
  return url;
}

export const api = new Proxy({} as HttpClient, {
  get(_, prop: string) {
    const client = new HttpClient({
      baseURL: getBaseURL(),
      token: async () => {
        const { TokenService } = await import('../classes/TokenService');
        return TokenService.get();
      },
    });
    const value = (client as unknown as Record<string, unknown>)[prop];
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

export function __reset(): void {
  // noop — mantido para compatibilidade com testes
}
