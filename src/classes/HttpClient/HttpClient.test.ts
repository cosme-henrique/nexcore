import { HttpClient, HttpClientError } from './HttpClient';

const BASE_URL = 'https://api.example.com';

const mockFetch = (status: number, data: unknown) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('HttpClient', () => {
  describe('GET', () => {
    it('should make a GET request and return data', async () => {
      mockFetch(200, { id: 1, name: 'Cosme' });
      const api = new HttpClient({ baseURL: BASE_URL });

      const result = await api.get<{ id: number; name: string }>('/users/1');

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/users/1`,
        expect.objectContaining({ method: 'GET' }),
      );
      expect(result).toEqual({ id: 1, name: 'Cosme' });
    });

    it('should support Next.js cache options', async () => {
      mockFetch(200, []);
      const api = new HttpClient({ baseURL: BASE_URL });

      await api.get('/posts', { cache: 'force-cache' });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/posts`,
        expect.objectContaining({ cache: 'force-cache' }),
      );
    });

    it('should support Next.js revalidate options', async () => {
      mockFetch(200, []);
      const api = new HttpClient({ baseURL: BASE_URL });

      await api.get('/posts', { next: { revalidate: 60 } });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/posts`,
        expect.objectContaining({ next: { revalidate: 60 } }),
      );
    });
  });

  describe('POST', () => {
    it('should make a POST request with body', async () => {
      mockFetch(201, { id: 2, title: 'Novo post' });
      const api = new HttpClient({ baseURL: BASE_URL });

      const result = await api.post<{ id: number }>('/posts', { title: 'Novo post' });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/posts`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'Novo post' }),
        }),
      );
      expect(result.id).toBe(2);
    });
  });

  describe('PUT', () => {
    it('should make a PUT request with body', async () => {
      mockFetch(200, { id: 1, title: 'Editado' });
      const api = new HttpClient({ baseURL: BASE_URL });

      const result = await api.put<{ id: number; title: string }>('/posts/1', { title: 'Editado' });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/posts/1`,
        expect.objectContaining({ method: 'PUT' }),
      );
      expect(result.title).toBe('Editado');
    });
  });

  describe('PATCH', () => {
    it('should make a PATCH request with body', async () => {
      mockFetch(200, { id: 1, title: 'Parcial' });
      const api = new HttpClient({ baseURL: BASE_URL });

      await api.patch('/posts/1', { title: 'Parcial' });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/posts/1`,
        expect.objectContaining({ method: 'PATCH' }),
      );
    });
  });

  describe('DELETE', () => {
    it('should make a DELETE request', async () => {
      mockFetch(200, null);
      const api = new HttpClient({ baseURL: BASE_URL });

      await api.delete('/posts/1');

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/posts/1`,
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });

  describe('auth token', () => {
    it('should inject Bearer token in headers', async () => {
      mockFetch(200, {});
      const api = new HttpClient({
        baseURL: BASE_URL,
        token: () => 'my-token',
      });

      await api.get('/me');

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/me`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-token',
          }),
        }),
      );
    });

    it('should not inject Authorization header when token returns null', async () => {
      mockFetch(200, {});
      const api = new HttpClient({
        baseURL: BASE_URL,
        token: () => null,
      });

      await api.get('/public');

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/public`,
        expect.objectContaining({
          headers: expect.not.objectContaining({ Authorization: expect.anything() }),
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should throw HttpClientError on failed request', async () => {
      mockFetch(404, { message: 'Not found' });
      const api = new HttpClient({ baseURL: BASE_URL });

      await expect(api.get('/missing')).rejects.toThrow(HttpClientError);
    });

    it('should call onError callback on failed request', async () => {
      mockFetch(401, { message: 'Unauthorized' });
      const onError = jest.fn();
      const api = new HttpClient({ baseURL: BASE_URL, onError });

      await expect(api.get('/protected')).rejects.toThrow();
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ status: 401 }));
    });

    it('should expose status and data in HttpClientError', async () => {
      mockFetch(422, { errors: ['invalid'] });
      const api = new HttpClient({ baseURL: BASE_URL });

      try {
        await api.get('/validate');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpClientError);
        expect((error as HttpClientError).status).toBe(422);
        expect((error as HttpClientError).data).toEqual({ errors: ['invalid'] });
      }
    });
  });
});
