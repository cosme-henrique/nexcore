import { truncate } from './truncate';

describe('truncate', () => {
  it('should truncate text that exceeds maxLength', () => {
    expect(truncate('Texto muito longo aqui', 10)).toBe('Texto m...');
  });

  it('should return original text if within maxLength', () => {
    expect(truncate('Curto', 10)).toBe('Curto');
  });

  it('should return original text if equal to maxLength', () => {
    expect(truncate('Exato', 5)).toBe('Exato');
  });

  it('should support custom suffix', () => {
    expect(truncate('Texto muito longo', 10, ' →')).toBe('Texto mu →');
  });
});
