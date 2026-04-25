import { isValidCNPJ } from './isValidCNPJ';

describe('isValidCNPJ', () => {
  it('should return true for a valid CNPJ', () => {
    expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
  });

  it('should return true for valid CNPJ without mask', () => {
    expect(isValidCNPJ('11222333000181')).toBe(true);
  });

  it('should return false for CNPJ with all same digits', () => {
    expect(isValidCNPJ('00.000.000/0000-00')).toBe(false);
  });

  it('should return false for CNPJ with wrong check digits', () => {
    expect(isValidCNPJ('12.345.678/0001-90')).toBe(false);
  });

  it('should return false for CNPJ with wrong length', () => {
    expect(isValidCNPJ('123.456')).toBe(false);
  });
});
