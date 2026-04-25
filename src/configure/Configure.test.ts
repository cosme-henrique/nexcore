import { EnvService } from '../classes/EnvService';
import { HttpClient } from '../classes/HttpClient';
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

const mockGet = jest.fn().mockResolvedValue({ data: 'ok' });
const mockPost = jest.fn().mockResolvedValue({ data: 'ok' });

jest.mock('../classes/HttpClient', () => ({
  HttpClient: jest.fn().mockImplementation(() => ({
    get: mockGet,
    post: mockPost,
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  })),
}));

const mockedEnvService = EnvService as jest.Mocked<typeof EnvService>;
const MockedHttpClient = HttpClient as jest.MockedClass<typeof HttpClient>;

describe('Configure', () => {
  beforeEach(() => {
    __reset();
    jest.clearAllMocks();
  });

  it('chama EnvService.register com as envs fornecidas', () => {
    const envs = { nodeEnv: { value: 'development' } };
    mockedEnvService.get.mockReturnValue(undefined);
    Configure({ envs });
    expect(mockedEnvService.register).toHaveBeenCalledWith(envs);
  });

  it('cria HttpClient quando apiUrl está registrada', () => {
    mockedEnvService.get.mockReturnValue('https://api.example.com');
    Configure({ envs: { apiUrl: { value: 'https://api.example.com', required: true } } });
    expect(MockedHttpClient).toHaveBeenCalledWith({
      baseURL: 'https://api.example.com',
      token: expect.any(Function),
    });
  });

  it('não cria HttpClient quando apiUrl não está registrada', () => {
    mockedEnvService.get.mockReturnValue(undefined);
    Configure({ envs: { nodeEnv: { value: 'development' } } });
    expect(MockedHttpClient).not.toHaveBeenCalled();
  });

  it('recria o HttpClient ao chamar Configure novamente', () => {
    mockedEnvService.get.mockReturnValue('https://api.example.com');
    Configure({ envs: { apiUrl: { value: 'https://api.example.com' } } });
    Configure({ envs: { apiUrl: { value: 'https://api2.example.com' } } });
    expect(MockedHttpClient).toHaveBeenCalledTimes(2);
  });
});

describe('api', () => {
  beforeEach(() => {
    __reset();
    jest.clearAllMocks();
  });

  it('lança erro se usado antes do Configure()', () => {
    expect(() => api.get('/users')).toThrow(
      '[nexcore] api não disponível. Registre "apiUrl" nas envs do Configure().',
    );
  });

  it('delega get() para a instância do HttpClient', async () => {
    mockedEnvService.get.mockReturnValue('https://api.example.com');
    Configure({ envs: { apiUrl: { value: 'https://api.example.com' } } });
    await api.get('/users');
    expect(mockGet).toHaveBeenCalledWith('/users');
  });

  it('delega post() para a instância do HttpClient', async () => {
    mockedEnvService.get.mockReturnValue('https://api.example.com');
    Configure({ envs: { apiUrl: { value: 'https://api.example.com' } } });
    await api.post('/users', { name: 'Cosme' });
    expect(mockPost).toHaveBeenCalledWith('/users', { name: 'Cosme' });
  });
});
