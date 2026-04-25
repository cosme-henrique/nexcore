import { isValidPhone } from './isValidPhone';

describe('isValidPhone', () => {
  it('should return true for cellphone with 11 digits', () => {
    expect(isValidPhone('11999999999')).toBe(true);
  });

  it('should return true for landline with 10 digits', () => {
    expect(isValidPhone('1133334444')).toBe(true);
  });

  it('should return true for masked cellphone', () => {
    expect(isValidPhone('(11) 99999-9999')).toBe(true);
  });

  it('should return false for phone with too few digits', () => {
    expect(isValidPhone('119999')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidPhone('')).toBe(false);
  });
});
