import { formatCNPJ } from './formatCNPJ';

describe('formatCNPJ', () => {
  it('should format raw digits', () => {
    expect(formatCNPJ('12345678000190')).toBe('12.345.678/0001-90');
  });

  it('should format already masked CNPJ', () => {
    expect(formatCNPJ('12.345.678/0001-90')).toBe('12.345.678/0001-90');
  });
});
