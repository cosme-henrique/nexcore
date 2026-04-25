import { isValidCEP } from './isValidCEP';

describe('isValidCEP', () => {
  it('should return true for a valid CEP', () => {
    expect(isValidCEP('01310-100')).toBe(true);
  });

  it('should return true for CEP without mask', () => {
    expect(isValidCEP('01310100')).toBe(true);
  });

  it('should return false for CEP with wrong length', () => {
    expect(isValidCEP('000')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidCEP('')).toBe(false);
  });
});
