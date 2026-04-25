import { isValidEmail } from './isValidEmail';

describe('isValidEmail', () => {
  it('should return true for a valid email', () => {
    expect(isValidEmail('cosme@email.com')).toBe(true);
  });

  it('should return true for email with subdomain', () => {
    expect(isValidEmail('cosme@mail.company.com')).toBe(true);
  });

  it('should return false for email without @', () => {
    expect(isValidEmail('invalido.com')).toBe(false);
  });

  it('should return false for email without domain', () => {
    expect(isValidEmail('invalido@')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should ignore leading and trailing spaces', () => {
    expect(isValidEmail('  cosme@email.com  ')).toBe(true);
  });
});
