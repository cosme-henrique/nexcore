import { removeAccents } from './removeAccents';

describe('removeAccents', () => {
  it('should remove accents from text', () => {
    expect(removeAccents('Ação Direção')).toBe('Acao Direcao');
  });

  it('should handle cedilla', () => {
    expect(removeAccents('Atenção')).toBe('Atencao');
  });

  it('should return text unchanged if no accents', () => {
    expect(removeAccents('nexcore')).toBe('nexcore');
  });

  it('should handle all common Portuguese accents', () => {
    expect(removeAccents('áéíóúàèìòùâêîôûãõç')).toBe('aeiouaeiouaeiouaoc');
  });
});
