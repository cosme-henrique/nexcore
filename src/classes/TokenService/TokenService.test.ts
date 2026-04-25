import { TokenService } from './TokenService';

const mockCookieStore = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookieStore)),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('TokenService', () => {
  describe('get', () => {
    it('should return the access token', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'access-jwt' });
      expect(await TokenService.get()).toBe('access-jwt');
      expect(mockCookieStore.get).toHaveBeenCalledWith('access_token');
    });

    it('should return undefined when token does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      expect(await TokenService.get()).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set access token with httpOnly and default options', async () => {
      await TokenService.set('my-token');
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'access_token',
        'my-token',
        expect.objectContaining({ httpOnly: true, path: '/', sameSite: 'lax' }),
      );
    });

    it('should allow overriding default options', async () => {
      await TokenService.set('my-token', { maxAge: 3600, sameSite: 'strict' });
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'access_token',
        'my-token',
        expect.objectContaining({ sameSite: 'strict', maxAge: 3600 }),
      );
    });
  });

  describe('remove', () => {
    it('should delete the access token cookie', async () => {
      await TokenService.remove();
      expect(mockCookieStore.delete).toHaveBeenCalledWith('access_token');
    });
  });

  describe('getRefresh', () => {
    it('should return the refresh token', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'refresh-jwt' });
      expect(await TokenService.getRefresh()).toBe('refresh-jwt');
      expect(mockCookieStore.get).toHaveBeenCalledWith('refresh_token');
    });

    it('should return undefined when refresh token does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      expect(await TokenService.getRefresh()).toBeUndefined();
    });
  });

  describe('setRefresh', () => {
    it('should set refresh token with httpOnly and 7 days maxAge', async () => {
      await TokenService.setRefresh('my-refresh-token');
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        'refresh_token',
        'my-refresh-token',
        expect.objectContaining({ httpOnly: true, maxAge: 60 * 60 * 24 * 7 }),
      );
    });
  });

  describe('removeRefresh', () => {
    it('should delete the refresh token cookie', async () => {
      await TokenService.removeRefresh();
      expect(mockCookieStore.delete).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('exists', () => {
    it('should return true when access token exists', async () => {
      mockCookieStore.get.mockReturnValue({ value: 'access-jwt' });
      expect(await TokenService.exists()).toBe(true);
    });

    it('should return false when access token does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      expect(await TokenService.exists()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should delete both access and refresh tokens', async () => {
      await TokenService.clear();
      expect(mockCookieStore.delete).toHaveBeenCalledWith('access_token');
      expect(mockCookieStore.delete).toHaveBeenCalledWith('refresh_token');
    });
  });
});
