type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

type RequestOptions = Omit<RequestInit, 'method' | 'body'> & {
  next?: NextFetchOptions;
};

type HttpClientConfig = {
  baseURL: string;
  headers?: Record<string, string>;
  token?: () => string | null | undefined | Promise<string | null | undefined>;
  onError?: (error: HttpClientError) => void;
  onUnauthorized?: () => Promise<boolean>;
};

export class HttpClientError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'HttpClientError';
    this.status = status;
    this.data = data;
  }
}

export class HttpClient {
  private config: HttpClientConfig;

  constructor(config: HttpClientConfig) {
    this.config = config;
  }

  private async buildHeaders(custom?: Record<string, string>): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...custom,
    };

    if (this.config.token) {
      const token = await this.config.token();
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
    isRetry = false,
  ): Promise<T> {
    const url = `${this.config.baseURL}${path}`;
    const headers = await this.buildHeaders(options?.headers as Record<string, string>);

    const response = await fetch(url, {
      ...options,
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 && !isRetry && this.config.onUnauthorized) {
        const refreshed = await this.config.onUnauthorized();
        if (refreshed) {
          return this.request<T>(method, path, body, options, true);
        }
      }

      const error = new HttpClientError(
        `${method} ${path} failed with status ${response.status}`,
        response.status,
        data,
      );
      this.config.onError?.(error);
      throw error;
    }

    return data as T;
  }

  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }
}
