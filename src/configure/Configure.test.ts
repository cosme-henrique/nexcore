import { __reset, api, Configure } from './Configure';

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

describe('Configure', () => {
  beforeEach(() => {
    __reset();
    jest.clearAllMocks();
  });

  it('aceita configuração de auth', () => {
    expect(() =>
      Configure({ auth: { autoRefresh: true, onSessionExpired: '/login' } }),
    ).not.toThrow();
  });

  it('aceita chamada sem opções', () => {
    expect(() => Configure({})).not.toThrow();
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
