import { isValidCPF } from './isValidCPF';

describe('isValidCPF', () => {
  it('should return true for a valid CPF', () => {
    expect(isValidCPF('529.982.247-25')).toBe(true);
  });

  it('should return true for valid CPF without mask', () => {
    expect(isValidCPF('52998224725')).toBe(true);
  });

  it('should return false for CPF with all same digits', () => {
    expect(isValidCPF('111.111.111-11')).toBe(false);
  });

  it('should return false for CPF with wrong check digits', () => {
    expect(isValidCPF('123.456.789-01')).toBe(false);
  });

  it('should return false for CPF with wrong length', () => {
    expect(isValidCPF('123.456')).toBe(false);
  });
});
