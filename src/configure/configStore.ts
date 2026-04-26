export type AuthConfig = {
  autoRefresh?: boolean;
  onSessionExpired?: string;
};

let _authConfig: AuthConfig | null = null;

export function setAuthConfig(config: AuthConfig): void {
  _authConfig = config;
}

export function getAuthConfig(): AuthConfig | null {
  return _authConfig;
}
