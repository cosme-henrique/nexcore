import { EnvService } from './EnvService';

describe('EnvService', () => {
  afterEach(() => {
    // Reset state between tests
    EnvService.register({});
  });

  describe('register + validate', () => {
    it('registers envs without throwing when all required are present', () => {
      expect(() =>
        EnvService.register({
          apiUrl: { value: 'https://api.example.com', required: true },
          nodeEnv: { value: 'development' },
        }),
      ).not.toThrow();
    });

    it('throws when a required env is missing', () => {
      expect(() =>
        EnvService.register({
          apiUrl: { value: undefined, required: true },
        }),
      ).toThrow('[nexcore] Env obrigatória não encontrada: "apiUrl"');
    });

    it('throws listing all missing required envs', () => {
      expect(() =>
        EnvService.register({
          apiUrl: { value: undefined, required: true },
          secretKey: { value: undefined, required: true },
        }),
      ).toThrow('"apiUrl", "secretKey"');
    });

    it('does not throw when optional env is missing', () => {
      expect(() =>
        EnvService.register({
          optionalVar: { value: undefined, required: false },
        }),
      ).not.toThrow();
    });
  });

  describe('get', () => {
    it('returns the value for a registered key', () => {
      EnvService.register({ apiUrl: { value: 'https://api.example.com' } });
      expect(EnvService.get('apiUrl')).toBe('https://api.example.com');
    });

    it('returns undefined for an unknown key', () => {
      EnvService.register({});
      expect(EnvService.get('unknown')).toBeUndefined();
    });
  });

  describe('isProduction / isDevelopment', () => {
    it('returns true for isProduction when nodeEnv is production', () => {
      EnvService.register({ nodeEnv: { value: 'production' } });
      expect(EnvService.isProduction()).toBe(true);
      expect(EnvService.isDevelopment()).toBe(false);
    });

    it('returns true for isDevelopment when nodeEnv is development', () => {
      EnvService.register({ nodeEnv: { value: 'development' } });
      expect(EnvService.isDevelopment()).toBe(true);
      expect(EnvService.isProduction()).toBe(false);
    });

    it('returns false for both when nodeEnv is not set', () => {
      EnvService.register({});
      expect(EnvService.isProduction()).toBe(false);
      expect(EnvService.isDevelopment()).toBe(false);
    });
  });
});
