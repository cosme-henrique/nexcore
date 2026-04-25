import { slugify } from './slugify';

describe('slugify', () => {
  it('should convert text to slug', () => {
    expect(slugify('Olá Mundo')).toBe('ola-mundo');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('meu post aqui')).toBe('meu-post-aqui');
  });

  it('should remove accents', () => {
    expect(slugify('Ação e Direção')).toBe('acao-e-direcao');
  });

  it('should trim leading and trailing hyphens', () => {
    expect(slugify('  texto  ')).toBe('texto');
  });

  it('should handle multiple spaces', () => {
    expect(slugify('Next.js  é  incrível')).toBe('nextjs-e-incrivel');
  });
});
