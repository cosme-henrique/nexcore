import { capitalize } from './capitalize';

describe('capitalize', () => {
  it('should capitalize first letter of each word', () => {
    expect(capitalize('cosme henrique')).toBe('Cosme Henrique');
  });

  it('should handle already capitalized text', () => {
    expect(capitalize('COSME HENRIQUE')).toBe('Cosme Henrique');
  });

  it('should handle single word', () => {
    expect(capitalize('nexcore')).toBe('Nexcore');
  });

  it('should handle text with multiple spaces', () => {
    expect(capitalize('next js lib')).toBe('Next Js Lib');
  });
});
