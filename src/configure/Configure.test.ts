import { EnvService } from '../classes/EnvService';
import { __reset, api, Configure } from './Configure';

jest.mock('../classes/EnvService', () => ({
  EnvService: {
    register: jest.fn(),
    get: jest.fn(),
  },
}));

jest.mock('../classes/TokenService', () => ({
  TokenService: {
    get: jest.fn().mockResolvedValue('mock-token'),
  },
}));

jest.mock('../classes/HttpClient', () => ({
  HttpClient: jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue({ data: 'ok' }),
    post: jest.fn().mockResolvedValue({ data: 'ok' }),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

const mockedEnvService = EnvService as jest.Mocked<typeof EnvService>;

describe('Configure', () => {
  beforeEach(() => {
    __reset();
    jest.clearAllMocks();
  });

  it('chama EnvService.register com as envs fornecidas', () => {
    const envs = { nodeEnv: { value: 'development' } };
    Configure({ envs });
    expect(mockedEnvService.register).toHaveBeenCalledWith(envs);
  });

  it('não exige envs para funcionar', () => {
    expect(() => Configure({ auth: { autoRefresh: true } })).not.toThrow();
  });

  it('aceita configuração de auth', () => {
    expect(() =>
      Configure({ auth: { autoRefresh: true, onSessionExpired: '/login' } }),
    ).not.toThrow();
  });
});

describe('api', () => {
  beforeEach(() => {
    __reset();
    jest.clearAllMocks();
  });

  it('lança erro se BASE_URL não está definida', () => {
    delete process.env.BASE_URL;
    expect(() => api.get('/users')).toThrow(
      '[nexcore] BASE_URL não definida. Adicione BASE_URL no seu .env.',
    );
  });

  it('cria HttpClient com BASE_URL do process.env', () => {
    process.env.BASE_URL = 'https://api.example.com';
    expect(() => api.get('/users')).not.toThrow();
    delete process.env.BASE_URL;
  });
});
